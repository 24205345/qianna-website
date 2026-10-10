import assert from "node:assert/strict";
import { test } from "node:test";
import { S3Client } from "@aws-sdk/client-s3";
import { createR2Client, getMediaProvider, getR2PublicUrl, uploadMediaObject, validateObjectKey } from "../lib/media/storage-core.ts";

const env = {
  MEDIA_STORAGE_PROVIDER: "r2", R2_ACCOUNT_ID: "a".repeat(32), R2_ACCESS_KEY_ID: "test-key",
  R2_SECRET_ACCESS_KEY: "test-secret", R2_BUCKET_NAME: "portfolio-media", R2_PUBLIC_BASE_URL: "https://media.example.com/assets/",
};

test("unconfigured installations still upload through Supabase", async () => {
  let upload;
  const supabase = { storage: { from(bucket) {
    assert.equal(bucket, "portfolio-media");
    return {
      async upload(...args) { upload = args; return { error: null }; },
      getPublicUrl(key) { return { data: { publicUrl: `https://source.example/${key}` } }; },
    };
  } } };
  const url = await uploadMediaObject(supabase, "notes/a.png", Buffer.from("image"), { contentType: "image/png" }, {});
  assert.equal(url, "https://source.example/notes/a.png");
  assert.equal(upload[2].upsert, false);
  assert.equal(getMediaProvider({}), "supabase");
});

test("Supabase upload failure does not return an unusable URL", async () => {
  const supabase = { storage: { from() { return { async upload() { return { error: { message: "denied" } }; } }; } } };
  await assert.rejects(uploadMediaObject(supabase, "a.jpg", Buffer.from("image"), {}, {}), /denied/);
});

test("R2 uploads encode URLs and prevent overwrite with a conditional write", async (context) => {
  let command;
  context.mock.method(S3Client.prototype, "send", async (sent) => { command = sent; return {}; });
  const url = await uploadMediaObject({}, "notes/旅行 cover.png", new Blob(["image"]), { contentType: "image/png" }, env);
  assert.equal(url, "https://media.example.com/assets/notes/%E6%97%85%E8%A1%8C%20cover.png");
  assert.equal(command.input.Key, "notes/旅行 cover.png");
  assert.equal(command.input.IfNoneMatch, "*");
  assert.equal(command.input.ContentType, "image/png");
  assert.equal(command.input.Body.toString(), "image");
  assert.match(command.input.CacheControl, /immutable/);
});

test("mutable seed uploads respect their short cache lifetime", async (context) => {
  context.mock.method(S3Client.prototype, "send", async ({ input }) => {
    assert.equal(input.IfNoneMatch, undefined);
    assert.equal(input.CacheControl, "public, max-age=3600");
  });
  await uploadMediaObject({}, "site/home-hero.webp", Buffer.from("image"), { upsert: true, cacheControl: "public, max-age=3600" }, env);
  await uploadMediaObject({}, "site/home-hero.webp", Buffer.from("image"), { upsert: true }, env);
});

test("bad provider or partial R2 config fails closed without falling back", async () => {
  assert.throws(() => getMediaProvider({ MEDIA_STORAGE_PROVIDER: "cloudflare" }), /must be/);
  await assert.rejects(uploadMediaObject({}, "a.jpg", Buffer.from("image"), {}, { MEDIA_STORAGE_PROVIDER: "r2" }), /Missing R2_/);
  assert.throws(() => createR2Client({ ...env, R2_SECRET_ACCESS_KEY: "" }), /R2_SECRET_ACCESS_KEY/);
});

test("R2 errors propagate instead of silently sending files to Supabase", async (context) => {
  context.mock.method(S3Client.prototype, "send", async () => { throw new Error("R2 denied"); });
  await assert.rejects(uploadMediaObject({}, "a.jpg", Buffer.from("image"), {}, env), /R2 denied/);
});

test("object paths and public endpoints reject unsafe values", () => {
  for (const key of ["", "/absolute.jpg", "../secret", "folder/../secret", "folder//a", "a\\b", "a\u0000b"]) {
    assert.throws(() => validateObjectKey(key), /Invalid/);
  }
  for (const base of ["http://media.example.com", "https://user:password@media.example.com", "https://media.example.com?a=1", "https://media.example.com#anchor", "https://account.r2.cloudflarestorage.com"]) {
    assert.throws(() => getR2PublicUrl("a.jpg", { ...env, R2_PUBLIC_BASE_URL: base }), /public HTTPS/);
  }
});
