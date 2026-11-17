import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Handle shorthand aliases /login and /signup
  if (pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  if (pathname === "/signup") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signup";
    return NextResponse.redirect(url);
  }

  const secret =
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "ezsygram-local-dev-secret-replace-in-env"
      : undefined);

  const token = await getToken({
    req,
    secret,
  });

  const isAuthenticated = Boolean(token?.id);
  const isAuthPage =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/signup");

  // If already authenticated and trying to access login/signup, redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect /dashboard and /onboarding
  if (!isAuthenticated && (pathname.startsWith("/dashboard") || pathname === "/onboarding")) {
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding",
    "/auth/login",
    "/auth/signup",
    "/login",
    "/signup",
  ],
};

