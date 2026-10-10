// The allowlist is also used when validating a saved plan before any DB writes.
export const MEDIA_TABLES = [
  { table: "projects", pk: "id", columns: ["cover_image_url", "hero_video_url", "intro_video_url", "content", "overview_paragraphs", "project_details"] },
  { table: "project_media", pk: "id", columns: ["url", "caption"] },
  { table: "photography_photos", pk: "id", columns: ["url", "description"] },
  { table: "visual_works", pk: "id", columns: ["url", "description"] },
  { table: "field_notes", pk: "id", columns: ["cover_image_url", "description"] },
  { table: "field_note_media", pk: "id", columns: ["url", "caption"] },
  { table: "site_settings", pk: "singleton_key", columns: ["hero_image_url"] },
  { table: "about_page_content", pk: "singleton_key", columns: ["profile_image_url", "timeline_items"] },
  { table: "notes", pk: "id", columns: ["cover_image_url", "body_markdown", "body_markdown_en"] },
  { table: "workbench_pipelines", pk: "id", columns: ["steps", "featured_note"], optional: true },
];
const VERSIONED_TABLES = new Set(["projects", "field_notes", "site_settings", "about_page_content", "notes", "workbench_pipelines"]);

/** Bound network transfers; on failure, drain in-flight work before closing clients. */
export async function forEachConcurrent(items, operation, limit = 4) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("Invalid transfer concurrency.");
  let next = 0;
  let failed = false;
  let failure;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (!failed && next < items.length) {
      const item = items[next++];
      try { await operation(item); }
      catch (error) { if (!failed) failure = error; failed = true; }
    }
  }));
  if (failed) throw failure;
}

export async function listStorageObjects(supabase, bucket, mapObject, prefix = "", pageSize = 100) {
  const files = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: pageSize, offset, sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(`Storage inventory failed: ${error.message}`);
    for (const entry of data) {
      const key = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) files.push(...await listStorageObjects(supabase, bucket, mapObject, key, pageSize));
      else files.push(mapObject(key, entry));
    }
    if (data.length < pageSize) return files;
  }
}

export function sameValue(left, right) {
  // JSONB object property order is not significant.
  if (left === right) return true;
  if (!left || !right || typeof left !== "object" || typeof right !== "object") return false;
  if (Array.isArray(left) !== Array.isArray(right)) return false;
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length && keys.every((key) =>
    Object.hasOwn(right, key) && sameValue(left[key], right[key]));
}

export function rewriteMediaReferences(value, sourceBase, files, referenced = new Set()) {
  if (typeof value === "string") {
    const escapedBase = sourceBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`${escapedBase}[^\\s<>"'\x60\\[\\]\\(\\)]+`, "g");
    return value.replace(pattern, (match) => {
      let suffix = "";
      let key = decodeURIComponent(match.slice(sourceBase.length));
      // Preserve sentence punctuation after a URL. Never guess a missing object.
      while (!files.has(key) && /[.,;:!?]$/.test(key)) {
        suffix = key.slice(-1) + suffix;
        key = key.slice(0, -1);
      }
      const file = files.get(key);
      if (!file) throw new Error(`Unresolved Supabase media reference: ${match}`);
      referenced.add(key);
      return file.publicUrl + suffix;
    });
  }
  if (Array.isArray(value)) return value.map((item) => rewriteMediaReferences(item, sourceBase, files, referenced));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) =>
      [key, rewriteMediaReferences(item, sourceBase, files, referenced)]));
  }
  return value;
}

export function validateChange(change) {
  const spec = MEDIA_TABLES.find((item) => item.table === change.table && item.pk === change.pk);
  if (!spec || typeof change.id !== "string" || !change.id ||
      !change.before || !change.after || Object.keys(change.before).length === 0 ||
      !sameValue(Object.keys(change.before).sort(), Object.keys(change.after).sort()) ||
      Object.keys(change.before).some((column) => !spec.columns.includes(column))) {
    throw new Error("Invalid database change in migration plan.");
  }
}

/** Compare-and-set avoids replacing content edited since the plan was generated. */
export async function applyChange(supabase, change, rollback = false) {
  validateChange(change);
  const expected = rollback ? change.after : change.before;
  const replacement = rollback ? change.before : change.after;
  const columns = Object.keys(expected);
  const versioned = VERSIONED_TABLES.has(change.table);
  const { data: current, error: readError } = await supabase.from(change.table)
    .select([...columns, ...(versioned ? ["updated_at"] : [])].join(",")).eq(change.pk, change.id).single();
  if (readError) throw new Error(`Read failed: ${change.table}/${change.id}: ${readError.message}`);
  const currentValues = Object.fromEntries(columns.map((column) => [column, current[column]]));
  if (sameValue(currentValues, replacement)) return; // Resume after an interrupted journal write.
  if (!sameValue(currentValues, expected)) throw new Error(`Content changed: ${change.table}/${change.id}; review before continuing.`);
  let query = supabase.from(change.table).update(replacement).eq(change.pk, change.id);
  // Avoid putting a long Markdown body/JSON into a PostgREST URL. updated_at
  // is changed by the existing database trigger on each edit.
  for (const column of (versioned ? ["updated_at"] : columns)) {
    const value = versioned ? current.updated_at : expected[column];
    query = value === null ? query.is(column, null) : query.eq(column,
      typeof value === "object" ? JSON.stringify(value) : value);
  }
  const { data, error } = await query.select(change.pk);
  if (error || data?.length !== 1) {
    throw new Error(`Concurrent edit or update failure: ${change.table}/${change.id}: ${error?.message || "no row updated"}`);
  }
}
