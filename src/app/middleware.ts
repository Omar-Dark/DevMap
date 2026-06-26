import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_ROUTE = "/admin";

const PUBLIC_ROUTES = ["/", "/auth", "/quiz", "/roadmap", "/project"];

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  // allow public routes
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/roadmap/") ||
    pathname.startsWith("/project/")
  ) {
    return NextResponse.next();
  }

  // redirect unauthenticated users
  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const isAdmin = payload?.isAdmin;

    // protect admin routes
    if (pathname.startsWith(ADMIN_ROUTE) && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // prevent logged in users from auth page
    if (pathname === "/auth") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
