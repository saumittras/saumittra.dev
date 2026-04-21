import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define routes that require authentication
  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/admin/login";

  const token = request.cookies.get("admin_token")?.value;

  if (isAdminRoute && !isLoginRoute && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
