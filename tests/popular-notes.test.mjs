import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const compiled = ts.transpileModule(
  fs.readFileSync(new URL("../lib/notes/queries.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }
).outputText;

const preview = (slug, overrides = {}) => ({
  slug, title: "中文标题", title_en: `English ${slug}`, excerpt: "中文摘要",
  excerpt_en: `Excerpt ${slug}`, tags: ["Notes"], published_at: "2026-10-20T00:00:00Z",
  ...overrides,
});

function fixture({ configured = true, ranked = [], rpcError = null, rpcThrows = false, latest = [] } = {}) {
  const calls = [];
  const client = {
    async rpc(name, args) {
      calls.push({ type: "rpc", name, args });
      if (rpcThrows) throw new Error("Transport failed");
      return { data: rpcError ? null : ranked, error: rpcError };
    },
    from(table) {
      const call = { type: "table", table };
      calls.push(call);
      const builder = {
        select(columns) { call.columns = columns; return builder; },
        eq(key, value) { call.filter = [key, value]; return builder; },
        order(key, options) { call.order = [key, options]; return builder; },
        limit(limit) { call.limit = limit; return Promise.resolve({ data: latest.slice(0, limit), error: null }); },
      };
      return builder;
    },
  };
  const fallback = { slug: "static", title: "Static title", titleEn: "Static title", titleZh: "静态标题",
    excerpt: "Static excerpt", tags: [], publishedAt: null };
  const exports = {};
  vm.runInNewContext(compiled, { exports, require(name) {
    if (name === "@/app/_data/notes") return { fallbackNotes: [fallback] };
    if (name === "@/lib/supabase/server") return {
      isSupabaseConfigured: () => configured,
      createClient: async () => client,
    };
    throw new Error(`Unexpected import ${name}`);
  } });
  return { calls, get: exports.getMostViewedNotes };
}

test("homepage preserves database popularity order and returns English-first public previews", async () => {
  const f = fixture({ ranked: [preview("older-popular", { published_at: "2026-07-01T00:00:00Z" }), preview("newer")] });
  const notes = await f.get(3);
  assert.deepEqual(Array.from(notes, n => n.slug), ["older-popular", "newer"]);
  assert.equal(notes[0].title, "English older-popular");
  assert.equal(notes[0].excerpt, "Excerpt older-popular");
  assert.deepEqual(Object.keys(notes[0]).sort(), ["excerpt", "publishedAt", "slug", "tags", "title"]);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].name, "get_most_viewed_notes");
  assert.equal(f.calls[0].args.p_limit, 3);
});

test("missing translations and tags use the existing Chinese fallback", async () => {
  const f = fixture({ ranked: [preview("a", { title_en: " ", excerpt_en: null, tags: null })] });
  const [note] = await f.get();
  assert.equal(note.title, "中文标题");
  assert.equal(note.excerpt, "中文摘要");
  assert.equal(note.tags.length, 0);
});

test("an empty published ranking stays empty instead of adding static articles", async () => {
  const f = fixture();
  assert.equal((await f.get()).length, 0);
  assert.equal(f.calls.length, 1);
});

for (const failure of ["missing migration", "transport failure"]) {
  test(`${failure} falls back to latest published notes`, async () => {
    const f = fixture({
      rpcError: failure === "missing migration" ? { code: "PGRST202" } : null,
      rpcThrows: failure === "transport failure",
      latest: [preview("recent")],
    });
    assert.equal((await f.get(1))[0].slug, "recent");
    const query = f.calls.find(c => c.type === "table");
    assert.equal(query.table, "notes");
    assert.deepEqual(query.filter, ["status", "published"]);
    assert.equal(query.order[0], "published_at");
    assert.equal(query.limit, 1);
  });
}

test("an unconfigured environment keeps static fallback without database requests", async () => {
  const f = fixture({ configured: false });
  assert.equal((await f.get())[0].slug, "static");
  assert.equal(f.calls.length, 0);
});

test("limits reject empty selections and bound database work", async () => {
  for (const limit of [0, -1]) {
    const f = fixture();
    assert.equal((await f.get(limit)).length, 0);
    assert.equal(f.calls.length, 0);
  }
  for (const [limit, expected] of [[2.9, 2], [100, 12], [NaN, 3], [Infinity, 3]]) {
    const f = fixture();
    await f.get(limit);
    assert.equal(f.calls[0].args.p_limit, expected);
  }
});
