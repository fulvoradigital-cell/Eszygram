import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const isAuthenticated = Boolean(token);
  const hasCompletedOnboarding = Boolean(token?.onboardingCompleted);

  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/signup");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isOnboardingRoute = pathname.startsWith("/onboarding");

  // 1. Unauthenticated users trying to access protected areas
  if (!isAuthenticated && (isDashboardRoute || isOnboardingRoute)) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users trying to access auth pages (login/signup)
  if (isAuthenticated && isAuthRoute) {
    if (!hasCompletedOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. Authenticated user who hasn't finished onboarding trying to access /dashboard
  if (isAuthenticated && !hasCompletedOnboarding && isDashboardRoute) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // 4. Authenticated user who has already completed onboarding trying to re-visit /onboarding
  if (isAuthenticated && hasCompletedOnboarding && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/auth/login",
    "/auth/signup",
  ],
};

