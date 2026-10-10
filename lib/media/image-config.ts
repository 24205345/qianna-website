export interface PublicImagePattern {
  protocol: "https";
  hostname: string;
  port?: string;
  pathname: string;
  search?: string;
}

// Shared by next.config and Notes: only public configuration reaches the client.
export function getPublicImagePatterns(supabaseUrl: string, r2BaseUrl?: string): PublicImagePattern[] {
  const patterns: PublicImagePattern[] = [];
  if (supabaseUrl) {
    patterns.push({ protocol: "https", hostname: new URL(supabaseUrl).hostname, pathname: "/storage/v1/object/public/**" });
  }
  if (r2BaseUrl?.trim()) {
    const url = new URL(r2BaseUrl.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
      throw new Error("R2_PUBLIC_BASE_URL must be a public HTTPS URL.");
    }
    patterns.push({ protocol: "https", hostname: url.hostname, port: url.port, pathname: `${url.pathname.replace(/\/+$/, "")}/**`, search: "" });
  }
  return patterns;
}

export function isOptimizableImageSource(src: string, patterns: PublicImagePattern[]): boolean {
  if (src.startsWith("/") && !src.startsWith("//") && !src.includes("\\")) {
    // Avoid recursively optimizing the optimizer endpoint.
    return !new URL(src, "https://local.invalid").pathname.startsWith("/_next/");
  }
  try {
    const url = new URL(src);
    if (url.username || url.password) return false;
    return patterns.some((p) => url.protocol === `${p.protocol}:` && url.hostname === p.hostname &&
      (p.port === undefined || url.port === p.port) && url.pathname.startsWith(p.pathname.slice(0, -2)) &&
      (p.search === undefined || url.search === p.search));
  } catch {
    return false;
  }
}
