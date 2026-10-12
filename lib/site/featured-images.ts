import type { FeaturedProject } from "@/lib/projects/queries";
import type { FeaturedTraceItem } from "@/lib/traces/queries";
export type HomeFeaturedImages = Record<string, string>;
export function featuredImageKey(group: "project" | "trace", id: string) { return `${group}:${id}`; }
export function featuredImageField(key: string) { return `featured_image_${encodeURIComponent(key)}`; }
export function applyProjectImages(projects: FeaturedProject[], images: HomeFeaturedImages) {
  return projects.map(item => ({ ...item, coverImageUrl: images[featuredImageKey("project", item.slug)] || item.coverImageUrl }));
}
export function applyTraceImages(traces: FeaturedTraceItem[], images: HomeFeaturedImages) {
  return traces.map(item => ({ ...item, imageUrl: images[featuredImageKey("trace", item.id)] || item.imageUrl }));
}
/** Write only changed, server-authorized items, preserving unrelated covers. */
export async function collectFeaturedImageChanges(form: FormData, allowedKeys: string[], readUpload: (field: string) => Promise<string | null>) {
  const fields = new Set(allowedKeys.map(featuredImageField));
  for (const name of form.keys()) {
    if (!name.startsWith("featured_image_")) continue;
    if (!fields.has(name) && !fields.has(name.replace(/_(upload_receipt|reset)$/, ""))) throw new Error("首页展示项目已变化，请刷新后重试。");
  }
  const changes: { item_key: string; image_url: string | null }[] = [];
  for (const key of allowedKeys) {
    const field = featuredImageField(key), reset = form.get(field + "_reset") === "1";
    const url = await readUpload(field);
    if (reset && url) throw new Error("同一张展示图不能同时更换和恢复。");
    if (url || reset) changes.push({ item_key: key, image_url: url });
  }
  return changes;
}
