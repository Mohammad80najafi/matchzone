import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json() as { token?: string };
  if (!body.token || body.token.length < 16) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mz_session", body.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
