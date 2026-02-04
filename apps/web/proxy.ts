import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signout") ||
    pathname.startsWith("/auth/error");

  const isUserDashboard = pathname.startsWith("/user-dashboard");

  // Redirect authenticated users from homepage to dApp
  if (req.auth && pathname === "/") {
    return NextResponse.redirect(new URL("/dapp", req.url));
  }

  // Protect dApp dashboard routes (individual dApp dashboards)
  const isDappDashboard =
    pathname.startsWith("/dapp/") && pathname.includes("/dashboard");
  const isProtectedRoute = isUserDashboard || isDappDashboard;

  if (isProtectedRoute && !req.auth) {
    return NextResponse.redirect(new URL("/dapp", req.url));
  }

  if (isAuthPage && req.auth) {
    return NextResponse.redirect(new URL("/dapp", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
