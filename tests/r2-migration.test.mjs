import assert from "node:assert/strict";
import { test } from "node:test";
import { applyChange, forEachConcurrent, listStorageObjects, rewriteMediaReferences, sameValue } from "../scripts/lib/r2-migration.mjs";

test("transfers stay within the memory/network limit and visit every object once", async () => {
  let active = 0;
  let peak = 0;
  const visited = [];
  await forEachConcurrent([0, 1, 2, 3, 4], async (item) => {
    active++;
    peak = Math.max(peak, active);
    await Promise.resolve();
    visited.push(item);
    active--;
  }, 2);
  assert.equal(peak, 2);
  assert.equal(active, 0);
  assert.deepEqual(visited.sort(), [0, 1, 2, 3, 4]);
});

test("failed transfers stop new objects and finish in-flight checkpoints before rejecting", async () => {
  const gate = Promise.withResolvers();
  const started = [];
  let drained = false;
  let settled = false;
  const failure = new Error("network failure");
  const transfers = forEachConcurrent([0, 1, 2, 3], async (item) => {
    started.push(item);
    if (item === 0) throw failure;
    await gate.promise;
    drained = true;
  }, 2).catch((error) => { settled = true; throw error; });
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(settled, false);
  assert.deepEqual(started, [0, 1]);
  gate.resolve();
  await assert.rejects(transfers, (error) => error === failure);
  assert.equal(drained, true);
  assert.deepEqual(started, [0, 1]);
});

const base = "https://source.supabase.co/storage/v1/object/public/portfolio-media/";
const files = new Map([
  ["notes/a.png", { publicUrl: "https://media.example.com/legacy/notes/a.png" }],
  ["摄影/cover 1.jpg", { publicUrl: "https://media.example.com/legacy/%E6%91%84%E5%BD%B1/cover%201.jpg" }],
]);

test("rewrites both Notes languages, nested JSON, encoded filenames and punctuation", () => {
  const refs = new Set();
  const before = { body_markdown: `![image](${base}notes/a.png)`, body_markdown_en: `See ${base}notes/a.png.`,
    steps: [{ url: `${base}%E6%91%84%E5%BD%B1/cover%201.jpg` }], nil: null };
  const after = rewriteMediaReferences(before, base, files, refs);
  assert.equal(after.body_markdown, "![image](https://media.example.com/legacy/notes/a.png)");
  assert.equal(after.body_markdown_en, "See https://media.example.com/legacy/notes/a.png.");
  assert.equal(after.steps[0].url, files.get("摄影/cover 1.jpg").publicUrl);
  assert.equal(before.steps[0].url, `${base}%E6%91%84%E5%BD%B1/cover%201.jpg`);
  assert.equal(refs.size, 2);
});

test("preserves local fallback images and external video/attachment URLs", () => {
  const value = ["/images/hero-image.jpg", "https://drive.google.com/file/d/id/preview", "https://other.supabase.co/storage/v1/object/public/portfolio-media/a.jpg"];
  assert.deepEqual(rewriteMediaReferences(value, base, files), value);
});

test("missing objects stop the plan rather than generating broken links", () => {
  assert.throws(() => rewriteMediaReferences(`${base}missing.png`, base, files), /Unresolved/);
});

test("storage inventory traverses folders and every page", async () => {
  const entries = Array.from({ length: 205 }, (_, index) => ({ id: String(index), name: `${index}.jpg` }));
  const calls = [];
  const supabase = { storage: { from() { return { async list(prefix, options) {
    calls.push([prefix, options.offset]);
    const children = prefix ? entries : [{ id: null, name: "nested" }, { id: "root", name: "root.png" }];
    return { data: children.slice(options.offset, options.offset + options.limit), error: null };
  } }; } } };
  const result = await listStorageObjects(supabase, "portfolio-media", (key) => key);
  assert.equal(result.length, 206);
  assert.ok(result.includes("nested/204.jpg"));
  assert.deepEqual(calls, [["", 0], ["nested", 0], ["nested", 100], ["nested", 200]]);
});

test("listing permission failures abort instead of returning an incomplete inventory", async () => {
  const supabase = { storage: { from() { return { async list() { return { error: { message: "denied" } }; } }; } } };
  await assert.rejects(listStorageObjects(supabase, "portfolio-media", (key) => key), /denied/);
});

const change = { table: "notes", pk: "id", id: "note-1", before: { body_markdown: "original" }, after: { body_markdown: "migrated" } };
function fakeDatabase(current, updatedCount = 1) {
  let writes = 0;
  const filters = [];
  return {
    get writes() { return writes; }, filters,
    from() { return {
      select() { return { eq() { return { async single() { return { data: { ...current, updated_at: "version-1" }, error: null }; } }; } }; },
      update(value) {
        writes++;
        const query = { eq(key, expected) { filters.push([key, expected]); return query; },
          is(key, expected) { filters.push([key, expected]); return query; },
          async select() { if (updatedCount === 1) Object.assign(current, value); return { data: Array.from({ length: updatedCount }, () => ({ id: "note-1" })), error: null }; } };
        return query;
      },
    }; },
  };
}

test("apply and rollback restore exact text with a small atomic version guard", async () => {
  const row = { body_markdown: "original" };
  const db = fakeDatabase(row);
  await applyChange(db, change);
  assert.equal(row.body_markdown, "migrated");
  assert.deepEqual(db.filters, [["id", "note-1"], ["updated_at", "version-1"]]);
  await applyChange(db, change, true);
  assert.equal(row.body_markdown, "original");
});

test("apply resumes an already applied write without a second update", async () => {
  const db = fakeDatabase({ body_markdown: "migrated" });
  await applyChange(db, change);
  assert.equal(db.writes, 0);
});

test("changes since planning and races during the write are detected", async () => {
  const edited = fakeDatabase({ body_markdown: "new user content" });
  await assert.rejects(applyChange(edited, change), /Content changed/);
  assert.equal(edited.writes, 0);
  await assert.rejects(applyChange(fakeDatabase({ body_markdown: "original" }, 0), change), /Concurrent edit/);
});

test("rollback refuses to overwrite edits made after cutover", async () => {
  const db = fakeDatabase({ body_markdown: "new user content" });
  await assert.rejects(applyChange(db, change, true), /Content changed/);
  assert.equal(db.writes, 0);
});

test("manifest changes cannot target arbitrary database tables or columns", async () => {
  await assert.rejects(applyChange({}, { ...change, table: "guestbook_messages" }), /Invalid database/);
  await assert.rejects(applyChange({}, { ...change, after: { status: "published" } }), /Invalid database/);
});

test("JSONB ordering does not produce false conflicts", () => {
  assert.equal(sameValue({ a: 1, b: [{ c: 2 }] }, { b: [{ c: 2 }], a: 1 }), true);
  assert.equal(sameValue([1, 2], [2, 1]), false);
});
