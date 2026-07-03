/**
 * 一次性迁移：Field Notes 5 条旅程、63 张图、4 个 Google Drive 视频外链。
 * 用法：npm run migrate:field-notes
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { fieldNoteDetails } from "../app/_data/field-note-details.ts";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const BUCKET = "portfolio-media";

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

async function uploadLocalImage(client, slug, localRelative, storageName) {
  const localPath = join(ROOT, "public", localRelative.replace(/^\//, ""));
  if (!existsSync(localPath)) throw new Error(`缺少文件: ${localPath}`);
  const { buffer, contentType, ext } = await compressImage(localPath);
  const storagePath = `field-notes/${slug}/images/${storageName}.${ext}`;
  const publicUrl = await uploadBuffer(client, storagePath, buffer, contentType);
  return { publicUrl, kb: buffer.length / 1024 };
}

async function ensureNotes() {
  for (const note of fieldNoteDetails) {
    const { error } = await supabase.from("field_notes").upsert(
      {
        slug: note.slug,
        title: note.title,
        date: note.date,
        location: note.location,
        description: note.description,
        activity: note.activity,
        cover_image_url: note.coverImage,
        layout_template: note.layoutTemplate,
        status: "published",
        sort_order: note.sortOrder,
      },
      { onConflict: "slug" }
    );
    if (error) throw new Error(`seed field_note ${note.slug}: ${error.message}`);
  }
}

async function getNoteId(slug) {
  const { data, error } = await supabase.from("field_notes").select("id").eq("slug", slug).single();
  if (error || !data) throw new Error(`找不到 field_note slug=${slug}`);
  return data.id;
}

async function migrateNote(note) {
  console.log(`\n=== ${note.slug} ===`);
  const noteId = await getNoteId(note.slug);
  await supabase.from("field_note_media").delete().eq("field_note_id", noteId);

  const coverRel = note.coverImage;
  const coverName = slugify(note.slug) + "-cover";
  const { publicUrl: coverUrl, kb: coverKb } = await uploadLocalImage(
    supabase,
    note.slug,
    coverRel,
    coverName
  );
  await supabase.from("field_notes").update({ cover_image_url: coverUrl }).eq("id", noteId);
  console.log(`  cover (${coverKb.toFixed(0)} KB)`);

  let sortOrder = 0;

  if (note.layoutTemplate === "gallery") {
    for (const photo of note.galleryPhotos) {
      const rel = `${note.galleryBasePath}/${photo.filename}`;
      const { publicUrl, kb } = await uploadLocalImage(
        supabase,
        note.slug,
        rel,
        `${String(sortOrder + 1).padStart(2, "0")}_${slugify(photo.title)}`
      );
      const { error } = await supabase.from("field_note_media").insert({
        field_note_id: noteId,
        type: "image",
        url: publicUrl,
        title: photo.title,
        layout: "gallery",
        sort_order: sortOrder,
      });
      if (error) throw new Error(error.message);
      console.log(`  [img ${sortOrder + 1}] ${photo.title} (${kb.toFixed(0)} KB)`);
      sortOrder++;
    }
  } else if (note.narrativeBlocks) {
    for (const block of note.narrativeBlocks) {
      const rel = `${note.galleryBasePath}/${block.filename}`;
      const { publicUrl, kb } = await uploadLocalImage(
        supabase,
        note.slug,
        rel,
        `${block.sectionKey}_${slugify(block.sectionTitle)}`
      );
      const caption = block.footerCaption ?? block.caption ?? null;
      const { error } = await supabase.from("field_note_media").insert({
        field_note_id: noteId,
        type: "image",
        url: publicUrl,
        title: block.sectionTitle,
        caption,
        section_key: block.sectionKey,
        layout: block.layout,
        aspect_ratio: block.aspectRatio,
        sort_order: sortOrder,
      });
      if (error) throw new Error(error.message);
      console.log(`  [block ${sortOrder + 1}] ${block.sectionTitle} (${kb.toFixed(0)} KB)`);
      sortOrder++;
    }
  }

  for (const video of note.videos ?? []) {
    const { error } = await supabase.from("field_note_media").insert({
      field_note_id: noteId,
      type: "video_external",
      url: video.url,
      title: video.title,
      sort_order: sortOrder,
    });
    if (error) throw new Error(error.message);
    console.log(`  [video] ${video.title}`);
    sortOrder++;
  }
}

async function main() {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: env.SUPABASE_ADMIN_EMAIL,
    password: env.SUPABASE_ADMIN_PASSWORD,
  });
  if (authError) throw new Error(`登录失败: ${authError.message}`);
  console.log("登录成功");

  await ensureNotes();
  for (const note of fieldNoteDetails) {
    await migrateNote(note);
  }
  console.log("\n✅ Field Notes 迁移完成（5 条旅程，63 图 + 4 视频）");
}

main().catch((err) => {
  console.error("\n❌", err.message || err);
  process.exit(1);
});
