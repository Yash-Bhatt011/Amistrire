import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Runs before every request. For /admin routes, verifies (server-side,
 * against Supabase directly — not just trusting a cookie) that the
 * requester is logged in AND has role = 'staff' before the route is ever
 * served. The client-side check in AdminShell still exists for a smooth
 * UX after login/logout, but this is the actual security boundary: it
 * stops the admin page's HTML and data from being sent to a browser that
 * shouldn't see it in the first place, including someone hitting the URL
 * directly with JavaScript disabled or via a raw HTTP request.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    // Misconfigured deployment — fail closed rather than silently letting
    // an unauthenticated request through.
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() (not getSession()) actually re-validates the token against
  // Supabase rather than trusting whatever's in the cookie unchecked.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "staff") {
    return NextResponse.redirect(new URL("/account/login", request.url));
  }

  // Add CSP header to fix blocked Drei/Three.js texture & model requests
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://raw.githubusercontent.com https://unpkg.com; worker-src 'self' blob:;"
  );

  // ... rest of your admin redirect logic ...

  return response;
}


export const config = {
  matcher: ["/admin/:path*"],
};
