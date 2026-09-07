import { NextResponse } from "next/server";
import { config } from "../../../../lib/config";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(config.admin.cookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: config.admin.cookieSecure,
    path: "/",
    maxAge: 0,
  });
  return res;
}