import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  hasPublicSupabaseConfig,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "@/lib/supabase/public-env";

/**
 * 保护 /admin/* 路由：无登录会话则重定向到 /admin/login。
 * 未配置 Supabase 环境变量时直接放行，保证无配置也能运行与构建。
 */
function redirectAuthParamsToHandler(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname !== "/") {
    return null;
  }

  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/callback";
    redirectUrl.searchParams.set("next", "/admin/reset-password");
    return NextResponse.redirect(redirectUrl);
  }

  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (tokenHash && type) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/confirm";
    redirectUrl.searchParams.set("next", "/admin/reset-password");
    return NextResponse.redirect(redirectUrl);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const authRedirect = redirectAuthParamsToHandler(request);
  if (authRedirect) {
    return authRedirect;
  }

  if (!hasPublicSupabaseConfig()) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // 重要：getUser() 会向 Auth 服务校验，请勿用 getSession() 做鉴权决策。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isResetPasswordPage = request.nextUrl.pathname === "/admin/reset-password";
  const isPublicAdminPage = isLoginPage || isResetPasswordPage;

  if (!user && !isPublicAdminPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/projects";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    {
      source: "/",
      has: [{ type: "query", key: "code" }],
    },
    {
      source: "/",
      has: [{ type: "query", key: "token_hash" }],
    },
  ],
};
