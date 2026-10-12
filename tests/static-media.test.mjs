import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { test } from "node:test";
import ts from "typescript";

const manifest = JSON.parse(fs.readFileSync("lib/media/public-media-manifest.json", "utf8"));
const compiled = ts.transpileModule(fs.readFileSync("lib/media/public-media.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports, process: { env: {} }, require(name) {
  assert.equal(name, "./public-media-manifest.json");
  return { default: manifest };
} });
const resolve = exports.resolvePublicMedia;

test("static aliases resolve encoded file paths and preserve query fragments", () => {
  const local = Object.keys(manifest.assets)[0];
  const key = manifest.assets[local].key.split("/").map(encodeURIComponent).join("/");
  assert.equal(resolve(local, "https://media.example.com/"), "https://media.example.com/" + key);
  assert.equal(resolve(encodeURI(local) + "?v=1#image", "https://media.example.com"), "https://media.example.com/" + key + "?v=1#image");
});
test("static rollback and non-asset URLs remain intact", () => {
  const local = Object.keys(manifest.assets)[0];
  assert.equal(resolve(local), local);
  for (const src of ["/projects/undergraduate-portfolio", "/missing.jpg", "/%ZZ.jpg", "//evil.test/a.jpg", "/\\evil.test/a.jpg", "https://external.test/a.jpg", "blob:example", "data:image/png;base64,test", "/__proto__"]) {
    assert.equal(resolve(src, "https://media.example.com"), src);
  }
});
test("manifest covers every source media file with the correct bytes and SHA-256", () => {
  const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".mp4", ".pdf"]);
  const sources = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (extensions.has(path.extname(file).toLowerCase())) sources.push(file);
    }
  }
  visit("public");
  assert.equal(sources.length, 182);
  assert.equal(Object.keys(manifest.assets).length, sources.length);
  let total = 0, reused = 0;
  for (const file of sources) {
    const local = "/" + path.relative("public", file).replaceAll("\\", "/");
    const row = manifest.assets[local];
    assert.ok(row, local);
    const bytes = fs.readFileSync(file);
    assert.equal(row.size, bytes.length, local);
    assert.equal(row.sha256, createHash("sha256").update(bytes).digest("hex"), local);
    assert.ok(row.contentType, local);
    if (row.key.startsWith("legacy/portfolio-media/")) reused += 1;
    else assert.equal(row.key, "static/" + row.sha256 + "/" + path.basename(file));
    total += row.size;
  }
  assert.equal(reused, 1);
  assert.equal(total, 601898269);
});
