/**
 * 一次性迁移：压缩 public/photography 下 46 张图，上传到 Supabase Storage，
 * 写入 photography_photos。
 *
 * 前置：已运行 seed-photography.sql（3 个 collection 元数据）
 * 用法：npm run migrate:photography
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { photographySections } from "../app/_data/photography.ts";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");

function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) throw new Error(".env.local 不存在");
  const text = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/\r$/, "");
  }
  return env;
}

const env = loadEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = env.SUPABASE_ADMIN_EMAIL;
const password = env.SUPABASE_ADMIN_PASSWORD;

if (!url || !anonKey || !email || !password) {
  throw new Error("请在 .env.local 配置 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / ADMIN 账号");
}

const supabase = createClient(url, anonKey);
const BUCKET = "portfolio-media";

async function compressImage(filePath) {
  const input = readFileSync(filePath);
  const ext = extname(filePath).toLowerCase();
  let pipeline = sharp(input).rotate().resize({ width: 2400, withoutEnlargement: true });

  if (ext === ".png") {
    pipeline = pipeline.png({ quality: 85, compressionLevel: 9 });
    return { buffer: await pipeline.toBuffer(), contentType: "image/png", ext: "png" };
  }
  pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
  return { buffer: await pipeline.toBuffer(), contentType: "image/jpeg", ext: "jpg" };
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function uploadBuffer(supabaseClient, storagePath, buffer, contentType) {
  const { error } = await supabaseClient.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Storage upload failed (${storagePath}): ${error.message}`);
  const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function getCollectionId(slug) {
  const { data, error } = await supabase
    .from("photography_collections")
    .select("id")
    .eq("slug", slug)
    .single();
  if (error || !data) throw new Error(`找不到系列 slug=${slug}: ${error?.message}`);
  return data.id;
}

async function clearPhotos(collectionId) {
  await supabase.from("photography_photos").delete().eq("collection_id", collectionId);
}

async function migrateCollection(section) {
  console.log(`\n=== ${section.slug} ===`);
  const collectionId = await getCollectionId(section.slug);
  await clearPhotos(collectionId);

  for (let i = 0; i < section.photos.length; i++) {
    const photo = section.photos[i];
    const localPath = join(ROOT, "public", section.basePath.replace(/^\//, ""), photo.filename);
    if (!existsSync(localPath)) throw new Error(`缺少文件: ${localPath}`);

    const { buffer, contentType, ext } = await compressImage(localPath);
    const storagePath = `photography/${section.slug}/${String(i + 1).padStart(2, "0")}_${slugify(photo.title)}.${ext}`;
    const publicUrl = await uploadBuffer(supabase, storagePath, buffer, contentType);

    const { error } = await supabase.from("photography_photos").insert({
      collection_id: collectionId,
      url: publicUrl,
      title: photo.title,
      date: photo.date,
      location: photo.location ?? null,
      description: photo.description,
      sort_order: i,
    });
    if (error) throw new Error(error.message);
    console.log(`  [${i + 1}/${section.photos.length}] ${photo.title} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }
}

async function main() {
  console.log("登录 Supabase…");
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) throw new Error(`登录失败: ${authError.message}`);
  console.log("登录成功");

  for (const section of photographySections) {
    await migrateCollection(section);
  }

  console.log("\n✅ Photography 迁移完成（46 张）");
}

main().catch((err) => {
  console.error("\n❌", err.message || err);
  process.exit(1);
});
