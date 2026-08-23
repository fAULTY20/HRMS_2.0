import { isSupabaseConfigured } from "@/lib/auth/config";
import type { Profile } from "@/lib/auth/types";
import { canAccessPathForRole } from "@/lib/permissions";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  if (!isSupabaseConfigured()) {
    if (pathname !== "/login" && pathname !== "/unauthorized") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key", {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && pathname !== "/login" && pathname !== "/unauthorized") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (user && pathname === "/login") return NextResponse.redirect(new URL("/", request.url));
  if (user && pathname !== "/" && pathname !== "/login" && pathname !== "/unauthorized" && !pathname.startsWith("/api/")) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle<Pick<Profile, "role">>();
    if (!profile || !canAccessPathForRole(profile.role, pathname)) return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };