import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

function load(file, imports = {}) {
  const output = ts.transpileModule(fs.readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, { exports, URL, require(name) {
    if (!(name in imports)) throw new Error("Unexpected import " + name);
    return imports[name];
  } });
  return exports;
}
const policy = load("../lib/media/image-config.ts");
const patterns = policy.getPublicImagePatterns("https://db.example.com", "https://media.example.com/assets");

test("Notes only optimize the configured public paths and safe local sources", () => {
  for (const src of ["/notes/a.png", "https://media.example.com/assets/a.jpg",
    "https://db.example.com/storage/v1/object/public/b/a.png"]) {
    assert.equal(policy.isOptimizableImageSource(src, patterns), true, src);
  }
  for (const src of ["//media.example.com/assets/a.jpg", "/_next/image?url=x", "/notes/../_next/image?url=x", "/notes/%2e%2e/_next/image?url=x", "/\\evil.test/a",
    "https://media.example.com/other/a.jpg", "https://media.example.com/assets/a.jpg?token=x",
    "https://media.example.com:444/assets/a.jpg", "https://media.example.com.evil.test/assets/a.jpg",
    "https://user:pass@media.example.com/assets/a.jpg", "http://media.example.com/assets/a.jpg",
    "https://external.example.com/a.jpg"]) {
    assert.equal(policy.isOptimizableImageSource(src, patterns), false, src);
  }
  assert.throws(() => policy.getPublicImagePatterns("", "https://media.example.com/?secret=x"));
});

const fallback = [{ slug: "a", title: "Static A", subtitle: "", sort_order: 0, basePath: "/a",
  photos: [{ id: "fallback-a", filename: "a.jpg", title: "Fallback", date: "", description: "" }] }];
const collections = [
  { id: "b", slug: "b", title: "B", subtitle: null, description: null, sort_order: 0 },
  { id: "a", slug: "a", title: "CMS A", subtitle: null, description: null, sort_order: 1 },
];
const photos = [1, 2, 3].map(n => ({ id: String(n), collection_id: "b", url: "/b/" + n,
  title: "Photo " + n, date: null, location: null, description: null, sort_order: n }));

function fixture({ configured = true, collectionError = null, photoError = null, cap = 1000, rows = photos } = {}) {
  const calls = [];
  const client = { from(table) {
    const query = { table, filters: {}, orders: [], start: 0, end: 999 };
    calls.push(query);
    const builder = {
      select(columns, options) { query.columns = columns; query.options = options; return builder; },
      eq(key, value) { query.filters[key] = value; return builder; },
      in(key, value) { query.filters[key] = value; return builder; },
      order(key) { query.orders.push(key); return builder; },
      range(start, end) { query.start = start; query.end = end; return builder; },
      then(resolve, reject) {
        return Promise.resolve(table === "photography_collections"
          ? { data: collections, error: collectionError }
          : { data: rows.slice(query.start, Math.min(query.end + 1, query.start + cap)), error: photoError, count: rows.length })
          .then(resolve, reject);
      },
    };
    return builder;
  } };
  return { calls, get: load("../lib/photography/queries.ts", {
    "@/lib/supabase/server": { createClient: async () => client, isSupabaseConfigured: () => configured },
  }).getPhotographyPageData };
}

test("published collections use one photo batch and empty collections keep static fallback", async () => {
  const f = fixture();
  const result = await f.get(fallback);
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[0].filters.status, "published");
  assert.deepEqual(Array.from(f.calls[1].filters.collection_id), ["b", "a"]);
  assert.deepEqual(Array.from(result, c => c.id), ["b", "a"]);
  assert.deepEqual(Array.from(result[0].photos, p => p.id), ["1", "2", "3"]);
  assert.equal(result[0].photos[0].date, "");
  assert.equal(result[1].title, "CMS A");
  assert.equal(result[1].photos[0].id, "fallback-a");
});

test("batch pagination follows the actual returned count even with a smaller API cap", async () => {
  const f = fixture({ cap: 1 });
  const result = await f.get(fallback);
  assert.equal(f.calls.length, 4);
  assert.deepEqual(f.calls.slice(1).map(c => c.start), [0, 1, 2]);
  assert.equal(result[0].photos.length, 3);
});

test("query failures and unconfigured environments retain fallback behavior", async () => {
  const disabled = fixture({ configured: false });
  assert.equal((await disabled.get(fallback))[0].photos[0].url, "/a/a.jpg");
  assert.equal(disabled.calls.length, 0);
  const brokenCollections = fixture({ collectionError: { message: "unavailable" } });
  assert.equal((await brokenCollections.get(fallback))[0].id, "");
  assert.equal(brokenCollections.calls.length, 1);
  const brokenPhotos = fixture({ photoError: { message: "unavailable" } });
  const result = await brokenPhotos.get(fallback);
  assert.equal(result[0].photos.length, 0);
  assert.equal(result[1].photos[0].id, "fallback-a");
});
