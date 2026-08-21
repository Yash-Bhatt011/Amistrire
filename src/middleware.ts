import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // 1. Full CSP Header to fix unpkg scripts and Drei 3D textures/models
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self' https://.supabase.co wss://.supabase.co https://api.razorpay.com https://raw.githubusercontent.com https://unpkg.com; worker-src 'self' blob:;"
  );

  // 2. Admin Route Protection
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "staff") {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }
  }

  return response;
}

// 3. Matcher updated to run globally on page requests while skipping static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.\\.(?:svg|png|jpg|jpeg|gif|webp)$).)",
  ],
};