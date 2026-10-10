/** Explicit phases; default --plan is read-only remotely. Never deletes source objects. */
import { createClient } from "@supabase/supabase-js";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { createR2Client, getR2PublicBaseUrl, getR2PublicUrl, MEDIA_BUCKET, validateObjectKey } from "../lib/media/storage-core.ts";
import { applyChange, forEachConcurrent, listStorageObjects, MEDIA_TABLES, rewriteMediaReferences, sameValue, validateChange } from "./lib/r2-migration.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const modes = ["--inventory", "--plan", "--copy", "--verify", "--apply", "--rollback"];
if (args.includes("--help")) {
  console.log("npm run migrate:r2 -- [--inventory|--plan|--copy|--verify|--apply|--rollback] [--manifest path]\nDefault: --plan. --inventory needs no R2 configuration. Pause CMS editing throughout migration. See docs/exec-cloudflare-r2-2026-10-09.md.");
  process.exit(0);
}
const selectedModes = args.filter((arg) => modes.includes(arg));
if (selectedModes.length > 1) throw new Error("Choose one migration phase at a time.");
const manifestArg = args.indexOf("--manifest");
if (manifestArg >= 0 && (!args[manifestArg + 1] || args[manifestArg + 1].startsWith("--"))) throw new Error("--manifest requires a path.");
const consumed = new Set([...(selectedModes), ...(manifestArg >= 0 ? ["--manifest", args[manifestArg + 1]] : [])]);
if (args.some((arg) => !consumed.has(arg))) throw new Error("Unknown migration argument; use --help.");
const mode = selectedModes[0] || "--plan";
const manifestPath = resolve(ROOT, manifestArg >= 0 ? args[manifestArg + 1] : ".media-migration/r2-plan.json");
const envPath = resolve(ROOT, ".env.local");
const env = { ...(existsSync(envPath) ? parseEnv(readFileSync(envPath, "utf8")) : {}), ...process.env };
const sourceUrl = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const sourceBase = `${sourceUrl}/storage/v1/object/public/${MEDIA_BUCKET}/`;
const PREFIX = "legacy/portfolio-media/";
const PAGE_SIZE = 100;
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

function saveManifest(plan) {
  mkdirSync(dirname(manifestPath), { recursive: true });
  const temporary = `${manifestPath}.tmp`;
  writeFileSync(temporary, JSON.stringify(plan, null, 2));
  renameSync(temporary, manifestPath);
}

async function login() {
  for (const name of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ADMIN_EMAIL", "SUPABASE_ADMIN_PASSWORD"]) {
    if (!env[name]) throw new Error(`Missing ${name}.`);
  }
  if (new URL(sourceUrl).protocol !== "https:") throw new Error("Supabase source must use HTTPS.");
  const supabase = createClient(sourceUrl, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: true },
  });
  const { error } = await supabase.auth.signInWithPassword({ email: env.SUPABASE_ADMIN_EMAIL, password: env.SUPABASE_ADMIN_PASSWORD });
  if (error) throw new Error(`Supabase login failed: ${error.message}`);
  return supabase;
}

async function makePlan(supabase) {
  if (existsSync(manifestPath)) throw new Error("Manifest already exists. Use another --manifest path; preserve the rollback journal.");
  const files = await listStorageObjects(supabase, MEDIA_BUCKET, (key) => {
    validateObjectKey(key);
    return { key, targetKey: PREFIX + key, publicUrl: getR2PublicUrl(PREFIX + key, env) };
  });
  const fileMap = new Map(files.map((file) => [file.key, file]));
  const referenced = new Set();
  const changes = [];
  const skippedTables = [];
  for (const spec of MEDIA_TABLES) {
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await supabase.from(spec.table).select([spec.pk, ...spec.columns].join(","))
        .order(spec.pk).range(offset, offset + PAGE_SIZE - 1);
      if (error) {
        if (spec.optional && error.code === "PGRST205") {
          skippedTables.push(spec.table);
          console.log(`Optional table not deployed: ${spec.table}; static fallback remains unchanged.`);
          break;
        }
        throw new Error(`Inventory ${spec.table} failed: ${error.message}; check deployed migrations.`);
      }
      for (const row of data) {
        const before = {};
        const after = {};
        for (const column of spec.columns) {
          const rewritten = rewriteMediaReferences(row[column], sourceBase, fileMap, referenced);
          if (!sameValue(row[column], rewritten)) {
            before[column] = row[column];
            after[column] = rewritten;
          }
        }
        if (Object.keys(before).length) changes.push({ table: spec.table, pk: spec.pk, id: row[spec.pk], before, after, state: "planned" });
      }
      if (data.length < PAGE_SIZE) break;
    }
  }
  const plan = { version: 1, createdAt: new Date().toISOString(), sourceUrl, sourceBucket: MEDIA_BUCKET,
    destination: { bucket: env.R2_BUCKET_NAME, publicBase: getR2PublicBaseUrl(env), accountId: env.R2_ACCOUNT_ID },
    referencedObjects: referenced.size, skippedTables, files, changes };
  saveManifest(plan);
  console.log(`Plan saved: ${files.length} objects, ${referenced.size} referenced objects, ${changes.length} database rows. No remote writes.`);
}

async function inventory(supabase) {
  const files = await listStorageObjects(supabase, MEDIA_BUCKET, (key, entry) => ({ key, size: Number(entry.metadata?.size || 0) }));
  console.log(`Storage: ${files.length} objects, ${(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MiB (listed metadata).`);
  const counts = await Promise.all(MEDIA_TABLES.map(async ({ table, pk, optional }) => {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    // HEAD can return null without a parsed JSON error on a missing table.
    if (count === null && !error) {
      const { error: readError } = await supabase.from(table).select(pk).limit(1);
      if (optional && readError?.code === "PGRST205") return { table, count: "not deployed (optional)" };
      return { table, error: readError?.message || "Row count unavailable" };
    }
    return { table, count, error: error?.message };
  }));
  for (const result of counts) console.log(`${result.table}: ${result.error || result.count}`);
  if (counts.some((result) => result.error)) throw new Error("Some tables could not be inventoried; check deployed SQL migrations.");
}

function loadPlan() {
  const plan = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (plan.version !== 1 || plan.sourceUrl !== sourceUrl || plan.sourceBucket !== MEDIA_BUCKET ||
      plan.destination?.bucket !== env.R2_BUCKET_NAME || plan.destination?.publicBase !== getR2PublicBaseUrl(env) ||
      plan.destination?.accountId !== env.R2_ACCOUNT_ID || !Array.isArray(plan.files) || !Array.isArray(plan.changes)) {
    throw new Error("Manifest/environment mismatch; do not use this plan against another project or bucket.");
  }
  const keys = new Set();
  for (const file of plan.files) {
    validateObjectKey(file.key);
    if (keys.has(file.key) || file.targetKey !== PREFIX + file.key || file.publicUrl !== getR2PublicUrl(file.targetKey, env)) {
      throw new Error("Invalid object in migration plan.");
    }
    keys.add(file.key);
  }
  const fileMap = new Map(plan.files.map((file) => [file.key, file]));
  for (const change of plan.changes) {
    validateChange(change);
    if (!sameValue(rewriteMediaReferences(change.before, sourceBase, fileMap), change.after) ||
        !["planned", "applying", "applied", "rolling-back", "rolled-back"].includes(change.state)) {
      throw new Error("Invalid replacement or state in migration plan.");
    }
  }
  return plan;
}

async function copyObjects(supabase, r2, plan) {
  await forEachConcurrent(plan.files, async (file) => {
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).download(file.key);
    if (error) throw new Error(`Download ${file.key} failed: ${error.message}`);
    const bytes = Buffer.from(await data.arrayBuffer());
    const sha256 = digest(bytes);
    if (file.sha256 && file.sha256 !== sha256) throw new Error(`Source changed after copy: ${file.key}; generate a fresh plan.`);
    let existing;
    try {
      existing = await r2.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: file.targetKey }));
    } catch (err) {
      if (err.$metadata?.httpStatusCode !== 404) throw err;
    }
    if (existing) {
      if (existing.Metadata?.sha256 !== sha256 || existing.ContentLength !== bytes.length) {
        throw new Error(`Destination collision: ${file.targetKey}; refusing to overwrite.`);
      }
    } else {
      await r2.send(new PutObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: file.targetKey, Body: bytes,
        ContentType: data.type || "application/octet-stream", CacheControl: "public, max-age=31536000, immutable",
        Metadata: { sha256 }, IfNoneMatch: "*" }));
    }
    const stored = await r2.send(new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: file.targetKey }));
    if (digest(await stored.Body.transformToByteArray()) !== sha256) throw new Error(`R2 checksum mismatch: ${file.key}`);
    file.sha256 = sha256;
    file.size = bytes.length;
    saveManifest(plan);
    console.log(`Copied and verified: ${file.key}`);
  });
}

async function verifyPublic(plan) {
  await forEachConcurrent(plan.files, async (file) => {
    if (!file.sha256 || !Number.isFinite(file.size)) throw new Error(`Not yet copied: ${file.key}`);
    const response = await fetch(file.publicUrl, { redirect: "error", signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`Public URL failed (${response.status}): ${file.publicUrl}`);
    if (digest(Buffer.from(await response.arrayBuffer())) !== file.sha256) throw new Error(`Public checksum mismatch: ${file.key}`);
  });
  console.log(`Verified ${plan.files.length} public URLs and SHA-256 hashes.`);
}

async function updateReferences(supabase, plan, rollback) {
  if (!rollback) await verifyPublic(plan); // Mandatory before changing any CMS URL.
  for (const change of (rollback ? [...plan.changes].reverse() : plan.changes)) {
    if (rollback && ["planned", "rolled-back"].includes(change.state)) continue;
    change.state = rollback ? "rolling-back" : "applying";
    saveManifest(plan); // Journal before a network write; handles unknown outcomes on resume.
    await applyChange(supabase, change, rollback);
    change.state = rollback ? "rolled-back" : "applied";
    saveManifest(plan);
  }
  console.log(rollback ? "Original CMS references restored; objects retained." : "CMS references updated. Revalidate/redeploy Next.js and inspect public pages.");
}

let supabase;
let r2;
try {
  // Plan/rollback need no R2 credentials; copy explicitly checks all credentials.
  if (mode !== "--inventory") getR2PublicBaseUrl(env);
  supabase = await login();
  if (mode === "--inventory") await inventory(supabase);
  else if (mode === "--plan") await makePlan(supabase);
  else {
    const plan = loadPlan();
    if (mode === "--copy") { r2 = createR2Client(env); await copyObjects(supabase, r2, plan); }
    if (mode === "--verify") await verifyPublic(plan);
    if (mode === "--apply" || mode === "--rollback") await updateReferences(supabase, plan, mode === "--rollback");
  }
} catch (err) {
  console.error(err.message || "Migration failed.");
  process.exitCode = 1;
} finally {
  r2?.destroy();
  supabase?.auth.stopAutoRefresh();
}
