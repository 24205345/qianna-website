import type { NextConfig } from "next";
import { PUBLIC_SUPABASE_URL } from "./lib/supabase/public-env";
import { getPublicImagePatterns } from "./lib/media/image-config";

const remotePatterns = getPublicImagePatterns(PUBLIC_SUPABASE_URL, process.env.R2_PUBLIC_BASE_URL);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STATIC_MEDIA_BASE_URL: (process.env.STATIC_MEDIA_PROVIDER || process.env.MEDIA_STORAGE_PROVIDER) === "r2" ? (process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "") || "") : "",
  },
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
