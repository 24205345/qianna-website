import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "public", "notes");
const metadata = {};
for (const entry of (await fs.readdir(directory, { recursive: true })).sort()) {
  if (!/\.(png|jpe?g|webp|avif|gif)$/i.test(entry)) continue;
  const { width, height } = await sharp(path.join(directory, entry)).metadata();
  if (width && height) metadata["/notes/" + entry.split(path.sep).join("/")] = { width, height };
}
await fs.writeFile(path.join(root, "lib/notes/local-image-metadata.json"), JSON.stringify(metadata, null, 2) + "\n");
console.log("Measured " + Object.keys(metadata).length + " local Notes images.");
