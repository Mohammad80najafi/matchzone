import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (url.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("mz_session")?.value ?? null;
    if (!token) {
      const loginUrl = new URL("/login", url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}
