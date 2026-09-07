import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "../../../../lib/security";
import { hasAdminToken } from "../../../../lib/config";

export const runtime = "nodejs";

export async function GET(raw: NextRequest) {
  const authed = await isAdminRequest(raw.headers);
  return NextResponse.json({
    ok: true,
    authed,
    configured: hasAdminToken(),
  });
}