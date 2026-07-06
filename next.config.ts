import type { NextConfig } from "next";
import { PUBLIC_SUPABASE_URL } from "./lib/supabase/public-env";

const supabaseHost = PUBLIC_SUPABASE_URL
  ? new URL(PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: supabaseHost
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
