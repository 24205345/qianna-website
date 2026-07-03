/**
 * 一次性迁移：压缩 public/drawings 下 22 张图，上传到 Supabase Storage，写入 visual_works。
 * 用法：npm run migrate:visual-works
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { visualWorkSections } from "../app/_data/visual-works.ts";

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
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

async function uploadBuffer(client, storagePath, buffer, contentType) {
  const { error } = await client.storage.from(BUCKET).upload(storagePath, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Upload failed (${storagePath}): ${error.message}`);
  return client.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

async function getCategoryId(slug) {
  const { data, error } = await supabase.from("visual_work_categories").select("id").eq("slug", slug).single();
  if (error || !data) throw new Error(`找不到分类 slug=${slug}: ${error?.message}`);
  return data.id;
}

async function migrateSection(section) {
  console.log(`\n=== ${section.slug} ===`);
  const categoryId = await getCategoryId(section.slug);
  await supabase.from("visual_works").delete().eq("category_id", categoryId);

  for (let i = 0; i < section.works.length; i++) {
    const work = section.works[i];
    const localPath = join(ROOT, "public", section.basePath.replace(/^\//, ""), work.filename);
    if (!existsSync(localPath)) throw new Error(`缺少文件: ${localPath}`);

    const { buffer, contentType, ext } = await compressImage(localPath);
    const storagePath = `visual-works/${section.slug}/${String(i + 1).padStart(2, "0")}_${slugify(work.title)}.${ext}`;
    const publicUrl = await uploadBuffer(supabase, storagePath, buffer, contentType);

    const { error } = await supabase.from("visual_works").insert({
      category_id: categoryId,
      url: publicUrl,
      title: work.title,
      date: work.date,
      description: work.description,
      sort_order: i,
    });
    if (error) throw new Error(error.message);
    console.log(`  [${i + 1}/${section.works.length}] ${work.title} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }
}

async function ensureCategories() {
  for (const section of visualWorkSections) {
    const { error } = await supabase.from("visual_work_categories").upsert(
      {
        slug: section.slug,
        title: section.title,
        subtitle: section.subtitle,
        description: section.description ?? null,
        status: "published",
        sort_order: section.sort_order,
      },
      { onConflict: "slug" }
    );
    if (error) throw new Error(`seed 分类失败 (${section.slug}): ${error.message}`);
  }
}

async function main() {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: env.SUPABASE_ADMIN_EMAIL,
    password: env.SUPABASE_ADMIN_PASSWORD,
  });
  if (authError) throw new Error(`登录失败: ${authError.message}`);
  console.log("登录成功");

  await ensureCategories();

  for (const section of visualWorkSections) {
    await migrateSection(section);
  }
  console.log("\n✅ Visual Works 迁移完成（22 张）");
}

main().catch((err) => {
  console.error("\n❌", err.message || err);
  process.exit(1);
});
