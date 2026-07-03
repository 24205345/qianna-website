import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/admin/reset-password";
  }
  return next;
}

/**
 * 兼容 token_hash 型邮件链接（部分 Supabase 邮件模板仍走 verifyOtp）。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next"));

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.search = "";

  if (!tokenHash || !type) {
    redirectTo.pathname = "/admin/login";
    redirectTo.search = "?error=missing_token";
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    redirectTo.pathname = "/admin/login";
    redirectTo.search = "?error=auth_confirm_failed";
    return NextResponse.redirect(redirectTo);
  }

  return NextResponse.redirect(redirectTo);
}
