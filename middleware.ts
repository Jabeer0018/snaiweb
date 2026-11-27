import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sanitizeCallbackUrl } from "@/auth.config";

const PUBLIC_PATHS = ["/login", "/privacy", "/terms"];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/diagrams") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isLoggedIn = Boolean(req.auth?.user);

  if (isPublic) {
    if (isLoggedIn && pathname === "/login") {
      const target = sanitizeCallbackUrl(
        req.nextUrl.searchParams.get("callbackUrl")
      );
      return NextResponse.redirect(new URL(target, req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    const intended = sanitizeCallbackUrl(`${pathname}${search}`);
    if (intended !== "/") {
      loginUrl.searchParams.set("callbackUrl", intended);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
