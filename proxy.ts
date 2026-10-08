import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes config
// 1. Routes strictly requiring "admin" role
const ADMIN_ROUTES = ["/dashboard"];

// 2. Protected user routes (require login: any authenticated user/admin)
const PROTECTED_ROUTES = ["/profile", "/orders", "/settings"];

// 3. Auth routes that logged-in users should not visit
const AUTH_ROUTES = ["/auth"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  // Check if current path starts with any admin route
  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Check if current path starts with any protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Check if current path is auth route (e.g. /auth)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // If already authenticated and visits /auth, redirect to dashboard or home based on role
  if (isAuthRoute && isAuthenticated) {
    const redirectUrl = role === "admin" ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // If trying to access admin route:
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      // User is authenticated but NOT admin -> redirect to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If trying to access protected user route:
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, svg, icons
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

