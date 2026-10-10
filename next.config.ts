import type { NextConfig } from "next";
import { PUBLIC_SUPABASE_URL } from "./lib/supabase/public-env";
import { getPublicImagePatterns } from "./lib/media/image-config";

const remotePatterns = getPublicImagePatterns(PUBLIC_SUPABASE_URL, process.env.R2_PUBLIC_BASE_URL);

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
