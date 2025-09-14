import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const token = cookies().get("mz_session")?.value ?? null;
  if (token) {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
    } catch {}
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mz_session", "", { path: "/", httpOnly: true, maxAge: 0 });
  return res;
}
