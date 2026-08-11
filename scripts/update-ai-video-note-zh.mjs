/**
 * 更新 ai-video-downloader-summarizer 中文正文，并同步英文章节六（部署）
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

const DEPLOYMENT_SECTION_EN = `## 6. Deployment

Production uses **Alibaba Cloud ECS + Docker Compose**:

1. Install Docker on Linux ECS and start the app with the repo's \`compose.yaml\`
2. Inject API keys, database, and Stripe settings via \`.env.docker\` / \`.env\`
3. *(Optional)* Put Baota or Nginx in front of the container port for domain + HTTPS
4. *(Optional)* Wire GitHub Actions to rsync and \`docker compose up\` on \`git push\`

For the full walkthrough (mirror tuning, firewall, health checks, production webhooks, etc.), see **[Aliyun ECS Deployment Guide: Docker Compose Single-Container Apps](/notes/aliyun-ecs-docker-deploy)**.`;

const EN_OVERVIEW_ITEM_5_OLD = "5. **Deploy** (still to be documented)";
const EN_OVERVIEW_ITEM_5_NEW =
  "5. **Deploy** (ECS + Docker Compose—see Section 6)";

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

function patchEnglishDeployment(bodyMarkdownEn) {
  let next = bodyMarkdownEn.replace(EN_OVERVIEW_ITEM_5_OLD, EN_OVERVIEW_ITEM_5_NEW);
  next = next.replace(
    /## 6\. Deployment[\s\S]*?(?=\n---\n\n## Appendix: prompt index)/,
    `${DEPLOYMENT_SECTION_EN}\n\n---\n\n`
  );
  if (next === bodyMarkdownEn) {
    throw new Error("未能匹配英文章节六，请检查 body_markdown_en 结构");
  }
  return next;
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

  const { data: existing, error: fetchError } = await supabase
    .from("notes")
    .select("body_markdown_en")
    .eq("slug", SLUG)
    .single();

  if (fetchError) throw new Error(`读取失败: ${fetchError.message}`);

  const body_markdown_en = patchEnglishDeployment(existing.body_markdown_en);

  const { error } = await supabase
    .from("notes")
    .update({ body_markdown, body_markdown_en })
    .eq("slug", SLUG);

  if (error) throw new Error(`更新失败: ${error.message}`);
  console.log(`已更新中英文正文: /notes/${SLUG}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
