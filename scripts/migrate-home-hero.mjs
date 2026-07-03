/**
 * 一次性迁移：首页 Hero 图压缩上传到 Supabase Storage，
 * 并写入 site_settings.hero_image_url。
 *
 * 前置：
 * 1. 已执行 supabase/migrations/0005_site_settings.sql
 * 2. 如本地缺图，先运行 scripts/download-home-hero.ps1
 *
 * 用法：npm run migrate:home
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "public", "images", "hero-image.jpg");
const BUCKET = "portfolio-media";
const STORAGE_PATH = "site/home-hero.webp";

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

async function compressHero() {
  if (!existsSync(SOURCE)) {
    throw new Error(
      `缺少文件: ${SOURCE}。请先运行 scripts/download-home-hero.ps1`
    );
  }

  return sharp(readFileSync(SOURCE))
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = env.SUPABASE_ADMIN_EMAIL;
  const password = env.SUPABASE_ADMIN_PASSWORD;

  if (!url || !anonKey || !email || !password) {
    throw new Error("请在 .env.local 配置 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / ADMIN 账号");
  }

  const supabase = createClient(url, anonKey);

  console.log("登录 Supabase…");
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) throw new Error(`登录失败: ${authError.message}`);

  console.log("压缩 Hero 图片…");
  const buffer = await compressHero();

  console.log(`上传到 Storage: ${STORAGE_PATH}`);
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(STORAGE_PATH, buffer, {
      contentType: "image/webp",
      upsert: true,
    });
  if (uploadError) throw new Error(`上传失败: ${uploadError.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(STORAGE_PATH);

  const { error: upsertError } = await supabase.from("site_settings").upsert(
    {
      singleton_key: "home",
      hero_title: "Qianna Wang",
      hero_subtitle:
        "Urban design, visual storytelling, and spatial observation.",
      hero_cta_label: "Enter",
      hero_image_url: data.publicUrl,
      hero_image_alt: "Qianna Wang cover image",
    },
    { onConflict: "singleton_key" }
  );
  if (upsertError) throw new Error(`写入 site_settings 失败: ${upsertError.message}`);

  console.log(`\n✅ Home Hero 迁移完成: ${(buffer.length / 1024).toFixed(0)} KB`);
  console.log(data.publicUrl);
}

main().catch((err) => {
  console.error("\n❌", err.message || err);
  process.exit(1);
});
