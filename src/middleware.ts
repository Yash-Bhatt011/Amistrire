import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  // If credentials aren't configured, don't lock the owner out — but this
  // means /admin is only protected by the in-app login. Set these two env
  // vars on your host before going live.
  if (!user || !pass) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const encoded = authHeader.split(" ")[1] ?? "";
    const decoded = Buffer.from(encoded, "base64").toString();
    const [suppliedUser, suppliedPass] = decoded.split(":");
    if (suppliedUser === user && suppliedPass === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Amistrié Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
