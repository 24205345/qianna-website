/**
 * 从当前 Storage URL 或本地源图重新压缩并覆盖 home-hero.webp
 * 用法：npm run recompress:home
 * 可选环境变量 HERO_SOURCE_URL（默认拉取线上 home-hero.webp）
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
const HERO_IMAGE_MAX_WIDTH = 1920;
const HERO_IMAGE_WEBP_QUALITY = 75;
const DEFAULT_SOURCE_URL =
  "https://aqsdwfocoocnzyxopvvg.supabase.co/storage/v1/object/public/portfolio-media/site/home-hero.webp";

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

async function loadSourceBuffer() {
  if (existsSync(SOURCE)) {
    console.log(`使用本地源图: ${SOURCE}`);
    return readFileSync(SOURCE);
  }

  const url = process.env.HERO_SOURCE_URL?.trim() || DEFAULT_SOURCE_URL;
  console.log(`下载当前 Hero: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败: ${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function compressHero(input) {
  return sharp(input)
    .rotate()
    .resize({ width: HERO_IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: HERO_IMAGE_WEBP_QUALITY })
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

  const source = await loadSourceBuffer();
  console.log(`源图大小: ${(source.length / 1024).toFixed(0)} KB`);

  console.log("压缩 Hero 图片…");
  const buffer = await compressHero(source);
  console.log(`压缩后: ${(buffer.length / 1024).toFixed(0)} KB`);

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
      hero_image_url: data.publicUrl,
    },
    { onConflict: "singleton_key" }
  );
  if (upsertError) {
    throw new Error(`更新 site_settings 失败: ${upsertError.message}`);
  }

  console.log(`\n✅ Hero 已重新压缩并上传`);
  console.log(data.publicUrl);
}

main().catch((err) => {
  console.error("\n❌", err.message || err);
  process.exit(1);
});
