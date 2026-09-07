import { NextRequest, NextResponse } from "next/server";
import { config, hasAdminToken } from "../../../../lib/config";
import { createAdminSession, verifySecret } from "../../../../lib/security";
import { checkLoginRateLimit, clientIp, resetLoginRateLimit } from "../../../../lib/rate-limit";

export const runtime = "nodejs";

export async function POST(raw: NextRequest) {
  if (!hasAdminToken()) {
    return NextResponse.json({ ok: false, error: "admin not configured" }, { status: 503 });
  }

  const ip = clientIp(raw);
  const limit = checkLoginRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "too many attempts", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } }
    );
  }

  let body: { token?: string } = {};
  try {
    body = (await raw.json()) as { token?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (typeof body.token !== "string" || !verifySecret(body.token)) {
    return NextResponse.json({ ok: false, error: "invalid token" }, { status: 401 });
  }

  const session = createAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "admin not configured" }, { status: 503 });
  }
  resetLoginRateLimit(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(config.admin.cookieName, session, {
    httpOnly: true,
    sameSite: "strict",
    secure: config.admin.cookieSecure,
    path: "/",
    maxAge: config.admin.cookieMaxAge,
  });
  return res;
}