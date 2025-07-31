import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/unauthorized"];

const PROTECTED_PATHS: Record<string, string> = {
  "/products": "MANAGE_PRODUCTS",
  "/checkout": "MANAGE_CHECKOUTS",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const permissionsJson = request.cookies.get("permissions")?.value;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const requiredPermission = Object.entries(PROTECTED_PATHS).find(([key]) =>
    pathname.startsWith(key)
  )?.[1];

  // Redirect to login if not authenticated and route is protected
  if (!isPublic && !token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but lacking required permission for the route
  if (requiredPermission && permissionsJson) {
    try {
      const permissions = JSON.parse(permissionsJson) as string[];
      if (!permissions.includes(requiredPermission)) {
        const unauthorizedUrl = request.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
      }
    } catch (e: unknown) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      console.error(e);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|assets|static|favicon.ico).*)"],
};
