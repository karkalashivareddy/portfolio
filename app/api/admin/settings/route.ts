import { NextRequest, NextResponse } from "next/server";
import { config } from "../../../../lib/config";
import { isAdminRequest } from "../../../../lib/security";

export const runtime = "nodejs";

/** GET /api/admin/settings — admin-only. Reflects runtime configuration (no secrets). */
export async function GET(raw: NextRequest) {
  const admin = await isAdminRequest(raw.headers);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    github: { username: config.github.username, ttlMs: config.github.ttlMs },
    codolio: { userKey: config.codolio.userKey, ttlMs: config.codolio.ttlMs },
    analytics: { enabled: config.analytics.enabled },
    readme: {
      autoUpdate: config.readme.autoUpdate,
      approvalRequired: config.readme.approvalRequired,
    },
    sync: {
      githubIntervalMs: config.sync.githubIntervalMs,
      codolioIntervalMs: config.sync.codolioIntervalMs,
    },
    adminConfigured: config.admin.token.length > 0,
  });
}