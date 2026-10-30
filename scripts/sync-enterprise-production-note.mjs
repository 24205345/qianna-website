/** Sync the chapter 08 Markdown sources into the local Notes fallback. No CMS writes. */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);

function readSource(language) {
  const source = readFileSync(
    new URL(`docs/notes/enterprise-ai-production.${language}.md`, root),
    "utf8",
  ).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = /^# (.+)\n+([\s\S]+)$/.exec(source);
  if (!match) throw new Error(`Missing document title: ${language}`);
  return { title: match[1], body: match[2].trim() };
}

const zh = readSource("zh");
const en = readSource("en");
const excerptZh =
  "用一张六分支概念地图和一个视频总结案例，理解个人 Demo 升级为团队与企业平台时需要补齐的权限、后台任务、响应速度、并发、恢复与运营能力，并把下一步交给 Coding Agent 实现。";
const excerptEn =
  "A six-branch upgrade map and one video-summary case explain permissions, background jobs, responsiveness, concurrency, recovery, and operations, then turn the next improvement into a task for a coding agent.";

const note = {
  slug: "enterprise-ai-production",
  title: en.title,
  excerpt: excerptEn,
  publishedAt: "2026-10-30T00:00:00.000Z",
  tags: ["AI Development", "Enterprise Platforms", "Product Design"],
  titleZh: zh.title,
  titleEn: en.title,
  excerptZh,
  excerptEn,
  bodyMarkdownZh: zh.body,
  bodyMarkdownEn: en.body,
  coverImageUrl: null,
};

const target = new URL("app/_data/enterprise-production.json", root);
const expected = `${JSON.stringify(note, null, 2)}\n`;
let current;
try {
  current = readFileSync(target, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (process.argv.includes("--check")) {
  if (current !== expected) {
    throw new Error("Chapter 08 fallback is stale. Run node scripts/sync-enterprise-production-note.mjs");
  }
  console.log("Chapter 08 fallback matches both Markdown sources.");
} else if (current !== expected) {
  writeFileSync(target, expected, "utf8");
  console.log(`Updated ${fileURLToPath(target)}`);
} else {
  console.log("Chapter 08 fallback is already up to date.");
}
