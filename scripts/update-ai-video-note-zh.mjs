/**
 * 更新 ai-video-downloader-summarizer 中文正文（含中文提示词）
 * 用法：node scripts/update-ai-video-note-zh.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MARKDOWN_PATH = join(
  ROOT,
  "docs",
  "notes",
  "ai-video-downloader-summarizer.zh.md"
);
const SLUG = "ai-video-downloader-summarizer";

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

function prepareBodyMarkdown(raw) {
  const lines = raw.replace(/^\uFEFF/, "").split(/\r?\n/);
  let start = 0;
  if (lines[start]?.startsWith("# ")) start += 1;
  while (start < lines.length && lines[start].trim() === "") start += 1;
  return lines.slice(start).join("\n").trim();
}

async function main() {
  const env = loadEnvLocal();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: env.SUPABASE_ADMIN_EMAIL,
    password: env.SUPABASE_ADMIN_PASSWORD,
  });
  if (authError) throw new Error(`登录失败: ${authError.message}`);

  const body_markdown = prepareBodyMarkdown(readFileSync(MARKDOWN_PATH, "utf8"));

  const { error } = await supabase
    .from("notes")
    .update({ body_markdown })
    .eq("slug", SLUG);

  if (error) throw new Error(`更新失败: ${error.message}`);
  console.log(`已更新中文正文: /notes/${SLUG}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
