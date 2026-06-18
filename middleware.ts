import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthed   = request.cookies.get("crm_auth")?.value === "true";
  const isLogin    = request.nextUrl.pathname === "/login";

  // Unauthenticated → always send to login
  if (!isAuthed && !isLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already authed and hitting login → send to dashboard
  if (isAuthed && isLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|logo\\.png|.*\\.svg).*)"],
};
