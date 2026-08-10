/**
 * 发布 Notes：阿里云 ECS 部署教程
 * 用法：node scripts/publish-aliyun-ecs-note.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MARKDOWN_PATH = join(ROOT, "docs", "notes", "aliyun-ecs-docker-deploy.md");

const NOTE = {
  slug: "aliyun-ecs-docker-deploy",
  title: "阿里云 ECS 部署教程：Docker Compose 单容器应用",
  title_en: "Aliyun ECS Deployment Guide: Docker Compose Single-Container Apps",
  excerpt:
    "国内 ECS 上 Docker Compose 部署 Web 应用的完整步骤：镜像加速、安全组验收、宝塔反代与 HTTPS、GitHub Actions 可选方案。",
  excerpt_en:
    "Deploy a Docker Compose web app on Aliyun ECS: mirror setup, security groups, Baota reverse proxy with HTTPS, and optional GitHub Actions.",
  tags: ["devops", "docker", "aliyun", "deploy"],
  sort_order: 0,
};

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
  if (lines[start]?.startsWith("# ")) {
    start += 1;
  }
  while (start < lines.length && lines[start].trim() === "") {
    start += 1;
  }
  return lines.slice(start).join("\n").trim();
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = env.SUPABASE_ADMIN_EMAIL;
  const password = env.SUPABASE_ADMIN_PASSWORD;

  if (!url || !anonKey || !email || !password) {
    throw new Error("缺少 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / ADMIN 账号配置");
  }

  const raw = readFileSync(MARKDOWN_PATH, "utf8");
  const body_markdown = prepareBodyMarkdown(raw);

  const supabase = createClient(url, anonKey);
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) throw new Error(`登录失败: ${authError.message}`);

  const { data: existing, error: readError } = await supabase
    .from("notes")
    .select("id, slug, status")
    .eq("slug", NOTE.slug)
    .maybeSingle();

  if (readError) throw new Error(`查询失败: ${readError.message}`);

  const payload = {
    title: NOTE.title,
    title_en: NOTE.title_en,
    slug: NOTE.slug,
    excerpt: NOTE.excerpt,
    excerpt_en: NOTE.excerpt_en,
    body_markdown,
    body_markdown_en: "",
    cover_image_url: null,
    tags: NOTE.tags,
    status: "published",
    sort_order: NOTE.sort_order,
    published_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await supabase
      .from("notes")
      .update(payload)
      .eq("id", existing.id);
    if (error) throw new Error(`更新失败: ${error.message}`);
    console.log(`已更新 Note: /notes/${NOTE.slug}`);
    return;
  }

  const { error } = await supabase.from("notes").insert(payload);
  if (error) throw new Error(`发布失败: ${error.message}`);

  console.log(`已发布 Note: /notes/${NOTE.slug}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
