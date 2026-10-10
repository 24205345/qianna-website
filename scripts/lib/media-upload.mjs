import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import { uploadMediaObject } from "../../lib/media/storage-core.ts";

const envFile = fileURLToPath(new URL("../../.env.local", import.meta.url));
const env = { ...(existsSync(envFile) ? parseEnv(readFileSync(envFile, "utf8")) : {}), ...process.env };

// Legacy seed scripts overwrite deterministic paths. Keep their cache lifetime short.
export function uploadScriptMedia(supabase, key, body, contentType) {
  return uploadMediaObject(supabase, key, body, {
    contentType,
    upsert: true,
    cacheControl: "public, max-age=3600",
  }, env);
}
