/**
 * Supabase 公开连接信息（anon key 设计为可暴露给浏览器，数据安全靠 RLS）。
 * Vercel 未配置 NEXT_PUBLIC_* 时回退到下列默认值，避免生产环境无法登录。
 */
export const PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://aqsdwfocoocnzyxopvvg.supabase.co";

export const PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxc2R3Zm9jb29jbnp5eG9wdnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzEyNjQsImV4cCI6MjA5Nzc0NzI2NH0.x3M98CQWWLBe28nktioGxarw4OYohlgL03GhKxae4eE";

export function hasPublicSupabaseConfig(): boolean {
  return Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY);
}
