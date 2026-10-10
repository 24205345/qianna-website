import type { NextConfig } from "next";
import { PUBLIC_SUPABASE_URL } from "./lib/supabase/public-env";

const supabaseHost = PUBLIC_SUPABASE_URL
  ? new URL(PUBLIC_SUPABASE_URL).hostname
  : undefined;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (supabaseHost) {
  remotePatterns.push({ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" });
}
if (process.env.R2_PUBLIC_BASE_URL?.trim()) {
  const mediaUrl = new URL(process.env.R2_PUBLIC_BASE_URL.trim());
  if (mediaUrl.protocol !== "https:" || mediaUrl.username || mediaUrl.password || mediaUrl.search || mediaUrl.hash) {
    throw new Error("R2_PUBLIC_BASE_URL must be a public HTTPS URL.");
  }
  remotePatterns.push({
    protocol: "https",
    hostname: mediaUrl.hostname,
    port: mediaUrl.port,
    pathname: `${mediaUrl.pathname.replace(/\/+$/, "")}/**`,
    search: "",
  });
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    remotePatterns,
    // Local proxy DNS can map public hosts to private IPs blocked by the optimizer.
    unoptimized: process.env.NODE_ENV === "development" && process.env.DEV_IMAGE_UNOPTIMIZED === "true",
  },
};

export default nextConfig;
