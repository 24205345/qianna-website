import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseEnv } from "node:util";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client, getR2PublicBaseUrl, getR2PublicUrl } from "../lib/media/storage-core.ts";
import { forEachConcurrent } from "./lib/r2-migration.mjs";
const root = process.cwd();
const env = { ...parseEnv(fs.readFileSync(path.join(root, ".env.local"), "utf8")), ...process.env };
const apply = process.argv.includes("--apply");
const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".mp4": "video/mp4", ".pdf": "application/pdf" };
const hash = b => createHash("sha256").update(b).digest("hex");
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const legacyFile = path.join(root, ".media-migration/r2-plan.json");
const legacy = fs.existsSync(legacyFile) ? JSON.parse(fs.readFileSync(legacyFile, "utf8")) : {};
const reused = new Map((legacy.files ?? []).map(f => [f.sha256, f.targetKey]));
const assets = {};
for (const file of walk(path.join(root, "public")).sort()) {
  if (!types[path.extname(file).toLowerCase()]) continue;
  const localPath = "/" + path.relative(path.join(root, "public"), file).split(path.sep).join("/");
  const bytes = fs.readFileSync(file), sha256 = hash(bytes);
  const key = reused.get(sha256) ?? "static/" + sha256 + "/" + path.basename(file);
  assets[localPath] = { key, sha256, size: bytes.length, contentType: types[path.extname(file).toLowerCase()] };
}
const entries = Object.entries(assets), toCopy = entries.filter(([, v]) => !v.key.startsWith("legacy/"));
console.log(JSON.stringify({ mode: apply ? "apply" : "plan", files: entries.length, bytes: entries.reduce((n,[,a])=>n+a.size,0), reused: entries.length-toCopy.length, newFiles: toCopy.length }));
if (apply) {
  const client = createR2Client(env);
  const baseUrl = getR2PublicBaseUrl(env);
  const progressPath = path.join(root, ".media-migration/static-media-progress.json");
  const previous = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")).files : [];
  const verifiedBefore = new Map(previous.map(row => [row.localPath, row]));
  const evidence = [];
  fs.mkdirSync(path.join(root, ".media-migration"), { recursive: true });
  // This journal is separate from the formal 159-row database rollback plan.
  fs.writeFileSync(path.join(root, ".media-migration/static-media-plan.json"), JSON.stringify({ baseUrl, assets, createdAt: new Date().toISOString() }, null, 2));
  let done = 0;
  try {
    await forEachConcurrent(entries, async ([localPath, asset]) => {
        const bytes = fs.readFileSync(path.join(root, "public", localPath.slice(1)));
        if (hash(bytes) !== asset.sha256) throw new Error("Local asset changed since planning: " + localPath);
        const md5 = createHash("md5").update(bytes).digest("hex");
        let head;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            try { head = await client.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: asset.key }), { abortSignal: AbortSignal.timeout(60_000) }); }
            catch (error) {
              if (error.$metadata?.httpStatusCode !== 404 || asset.key.startsWith("legacy/")) throw error;
              await client.send(new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: asset.key, Body: bytes, ContentType: asset.contentType,
                ChecksumSHA256: Buffer.from(asset.sha256, "hex").toString("base64"),
                CacheControl: "public, max-age=31536000, immutable", IfNoneMatch: "*", Metadata: { sha256: asset.sha256 } }), { abortSignal: AbortSignal.timeout(180_000) });
              head = await client.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: asset.key }));
            }
            if (head.ContentLength !== asset.size || head.ETag?.replaceAll('"', "") !== md5) throw new Error("R2 object digest/size mismatch: " + localPath);
            break;
          } catch (error) { const status = error.$metadata?.httpStatusCode; if (attempt === 3 || (status >= 400 && status < 500 && status !== 412)) throw error; console.log("Retry object upload/check: " + localPath); }
        }
        const old = verifiedBefore.get(localPath);
        if (old?.key === asset.key && old.sha256 === asset.sha256 && old.size === asset.size) {
          evidence.push({ ...old, etag: head.ETag });
          if (++done % 10 === 0) console.log("Verified " + done + "/" + entries.length);
          return;
        }
        const publicHash = createHash("sha256");
        for (let offset = 0; offset < asset.size; offset += 1024 * 1024) {
          const end = Math.min(offset + 1024 * 1024, asset.size) - 1;
          const range = "bytes=" + offset + "-" + end, expected = end - offset + 1;
          let publicBytes;
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const response = await fetch(getR2PublicUrl(asset.key, env), { headers: { Range: range }, signal: AbortSignal.timeout(60_000) });
              if (response.status !== 206 || response.headers.get("content-range") !== "bytes " + offset + "-" + end + "/" + asset.size) throw new Error("Public range mismatch");
              publicBytes = new Uint8Array(await response.arrayBuffer());
              if (publicBytes.length !== expected) throw new Error("Public length mismatch");
              break;
            } catch (error) { if (attempt === 3) throw error; console.log("Retry range verification: " + localPath + " offset " + offset); }
          }
          publicHash.update(publicBytes);
        }
        if (publicHash.digest("hex") !== asset.sha256) throw new Error("SHA-256 mismatch: " + localPath);
        const publicStatus = 206;
        evidence.push({ localPath, key: asset.key, sha256: asset.sha256, size: asset.size, etag: head.ETag, status: publicStatus, verification: "R2 HEAD digest + public SHA-256" });
        fs.writeFileSync(path.join(root, ".media-migration/static-media-progress.json"), JSON.stringify({ verifiedAt: new Date().toISOString(), files: evidence }, null, 2));
        if (++done % 10 === 0) console.log("Verified " + done + "/" + entries.length);
    }, 6);
    fs.writeFileSync(path.join(root, "lib/media/public-media-manifest.json"), JSON.stringify({ baseUrl, assets }, null, 2) + "\n");
    fs.writeFileSync(path.join(root, ".media-migration/static-media-verification.json"), JSON.stringify({ verifiedAt: new Date().toISOString(), files: evidence }, null, 2));
    console.log("All static media verified. Manifest written. Local source files preserved.");
  } finally { client.destroy(); }
}
