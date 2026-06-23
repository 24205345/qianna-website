/**
 * 一次性迁移脚本：压缩 public/projects 下的图片/小视频，上传到 Supabase Storage，
 * 并写入 project_media / projects.cover_image_url / projects.hero_video_url。
 *
 * 用法（需先配置 .env.local 中的 Supabase 与管理员账号）：
 *   npm run migrate:media
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";

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

const thesisGallery = [
  {
    local: "public/projects/thesis/images/01_Transport Gaps.jpg",
    title: "Transport Gaps",
    caption:
      "This analysis examines transport infrastructure to uncover regional disparities and shifts over time. By identifying gaps in urban functionality, it highlights where services fall short and where interventions are most needed.",
  },
  {
    local: "public/projects/thesis/images/02_Facility Services Analysis.jpg",
    title: "Facility Services Analysis",
    caption:
      "The study examines transportation infrastructure to reveal regional disparities and shifts over time. By highlighting gaps in urban functionality, it provides insight into where improvements are needed for more balanced city access.",
  },
  {
    local: "public/projects/thesis/images/03_Sensing Transport.jpg",
    title: "Sensing Transport",
    caption:
      "Using the four most common routes in the monitored community, this analysis captures and compares travel experiences across different transport modes, revealing how mobility shapes daily routines and perceptions of the city.",
  },
  {
    local: "public/projects/thesis/images/04_T-Distributed Stochastic Neighbor Embedding (t-SNE) Spatial Clusters.jpg",
    title: "t-SNE Spatial Clusters",
    caption:
      "By compressing multi-vector data into 3D space with t-distributed Stochastic Neighbor Embedding (t-SNE), zones of similar negative experiences cluster together. These patterns form the basis for spatial growth.",
  },
  {
    local: "public/projects/thesis/images/05_Principles of Data Collection.jpg",
    title: "Principles of Data Collection",
    caption:
      "Wearable devices capture shifts in physiological activity as people move through the city. By measuring skin potential changes triggered by perception, they reveal how urban environments affect the body and shape lived experience.",
  },
  {
    local: "public/projects/thesis/images/06_Data Translation and Skeleton Generation.jpg",
    title: "Data Translation and Skeleton Generation",
    caption:
      "Growth locations and skeletal structures are translated from two-dimensional data via the wool algorithm, then combined with site characteristics and visible construction zones to generate the parasitic structures.",
  },
  {
    local: "public/projects/thesis/images/07_Strategic Overview.jpg",
    title: "Strategic Overview",
    caption:
      "This project uses sensors to explore hidden issues of urban mobility. Through data analysis and spatial translation, it creates parasitic spaces that amplify human perception and reconnect people with the city in a dynamic, symbiotic way.",
  },
  {
    local: "public/projects/thesis/images/08_Rendering and Possibility.jpg",
    title: "Rendering and Possibility",
    caption:
      "Human perception resonates with the urban fabric, blurring the line between observer and environment. Through sensory exchange, people and cities co-transform, creating a feedback loop where space is continually redefined.",
  },
];

const xicaoshiGallery = [
  { local: "public/projects/xicaoshi-red-temple/images/01_site_analysis.jpg", title: "Site Analysis" },
  { local: "public/projects/xicaoshi-red-temple/images/02_current_situation_analysis.png", title: "Current Situation Analysis" },
  { local: "public/projects/xicaoshi-red-temple/images/03_landscape_rendering.jpg", title: "Landscape Rendering" },
  { local: "public/projects/xicaoshi-red-temple/images/04_planning_guidelines.jpg", title: "Planning Guidelines" },
  { local: "public/projects/xicaoshi-red-temple/images/05_important_node_updates.png", title: "Important Node Updates" },
  { local: "public/projects/xicaoshi-red-temple/images/07_courtyard_location_analysis.jpg", title: "Courtyard Location Analysis" },
  { local: "public/projects/xicaoshi-red-temple/images/08_current_situation.png", title: "Current Situation of Courtyard" },
  { local: "public/projects/xicaoshi-red-temple/images/09_morphological_evolution.png", title: "Morphological Evolution Process" },
  { local: "public/projects/xicaoshi-red-temple/images/10_analysis_chart.png", title: "Analysis Chart" },
  { local: "public/projects/xicaoshi-red-temple/images/11_profile_view.jpg", title: "Profile View" },
  { local: "public/projects/xicaoshi-red-temple/images/12_ground_floor_plan.jpg", title: "Ground Floor Plan" },
  { local: "public/projects/xicaoshi-red-temple/images/13_exploded_axonometric.jpg", title: "Exploded Axonometric" },
];

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

async function uploadRawFile(supabaseClient, storagePath, filePath, contentType) {
  const buffer = readFileSync(filePath);
  return uploadBuffer(supabaseClient, storagePath, buffer, contentType);
}

async function getProjectId(slug) {
  const { data, error } = await supabase.from("projects").select("id").eq("slug", slug).single();
  if (error || !data) throw new Error(`找不到项目 slug=${slug}: ${error?.message}`);
  return data.id;
}

async function clearProjectMedia(projectId) {
  await supabase.from("project_media").delete().eq("project_id", projectId);
}

async function migrateThesis(projectId) {
  console.log("\n=== thesis ===");

  const heroLocal = join(ROOT, "public/projects/thesis/video/01_hero_video.mp4");
  if (!existsSync(heroLocal)) throw new Error(`缺少文件: ${heroLocal}`);
  const heroUrl = await uploadRawFile(
    supabase,
    "projects/thesis/video/01_hero_video.mp4",
    heroLocal,
    "video/mp4"
  );
  await supabase.from("projects").update({ hero_video_url: heroUrl }).eq("id", projectId);
  console.log("hero video:", heroUrl);

  await clearProjectMedia(projectId);

  for (let i = 0; i < thesisGallery.length; i++) {
    const item = thesisGallery[i];
    const localPath = join(ROOT, item.local);
    if (!existsSync(localPath)) throw new Error(`缺少文件: ${localPath}`);
    const { buffer, contentType, ext } = await compressImage(localPath);
    const storagePath = `projects/thesis/images/${String(i + 1).padStart(2, "0")}_${slugify(item.title)}.${ext}`;
    const publicUrl = await uploadBuffer(supabase, storagePath, buffer, contentType);
    const { error } = await supabase.from("project_media").insert({
      project_id: projectId,
      type: "image",
      url: publicUrl,
      title: item.title,
      caption: item.caption,
      sort_order: i,
    });
    if (error) throw new Error(error.message);
    console.log(`  [${i + 1}/${thesisGallery.length}] ${item.title} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }
}

async function migrateXicaoshi(projectId) {
  console.log("\n=== xicaoshi-red-temple ===");

  const coverLocal = join(ROOT, "public/projects/xicaoshi-red-temple/images/00_landscape_cover.jpg");
  if (!existsSync(coverLocal)) throw new Error(`缺少文件: ${coverLocal}`);
  const { buffer: coverBuf, contentType: coverType, ext: coverExt } = await compressImage(coverLocal);
  const coverUrl = await uploadBuffer(
    supabase,
    `projects/xicaoshi-red-temple/cover.${coverExt}`,
    coverBuf,
    coverType
  );
  await supabase.from("projects").update({ cover_image_url: coverUrl }).eq("id", projectId);
  console.log("cover:", coverUrl, `(${(coverBuf.length / 1024).toFixed(0)} KB)`);

  await clearProjectMedia(projectId);

  for (let i = 0; i < xicaoshiGallery.length; i++) {
    const item = xicaoshiGallery[i];
    const localPath = join(ROOT, item.local);
    if (!existsSync(localPath)) throw new Error(`缺少文件: ${localPath}`);
    const { buffer, contentType, ext } = await compressImage(localPath);
    const storagePath = `projects/xicaoshi-red-temple/images/${String(i + 1).padStart(2, "0")}_${slugify(basename(item.local, extname(item.local)))}.${ext}`;
    const publicUrl = await uploadBuffer(supabase, storagePath, buffer, contentType);
    const { error } = await supabase.from("project_media").insert({
      project_id: projectId,
      type: "image",
      title: item.title,
      url: publicUrl,
      sort_order: i,
    });
    if (error) throw new Error(error.message);
    console.log(`  [${i + 1}/${xicaoshiGallery.length}] ${item.title} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }
}

async function main() {
  console.log("登录 Supabase…");
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) throw new Error(`登录失败: ${authError.message}`);
  console.log("登录成功");

  const thesisId = await getProjectId("thesis");
  const xicaoshiId = await getProjectId("xicaoshi-red-temple");

  await migrateThesis(thesisId);
  await migrateXicaoshi(xicaoshiId);

  console.log("\n✅ 迁移完成");
}

main().catch((err) => {
  console.error("\n❌", err.message || err);
  process.exit(1);
});
