import { NextRequest, NextResponse } from "next/server";
import { config } from "../../../../lib/config";
import { verifyWebhook } from "../../../../lib/security";
import { deleteJson } from "../../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/github
 * Receives GitHub webhooks (push, repository, starred…).
 * Signature-verified via x-hub-signature-256 + GITHUB_WEBHOOK_SECRET.
 * On a valid push we invalidate the GitHub cache so the next read is live.
 */
export async function POST(raw: NextRequest) {
  if (!config.webhook.githubSecret) {
    return NextResponse.json({ ok: false, error: "webhook not configured" }, { status: 503 });
  }

  const signature = raw.headers.get("x-hub-signature-256") ?? raw.headers.get("x-hub-signature");
  const event = raw.headers.get("x-github-event") ?? "unknown";
  const payload = await raw.text();

  if (!verifyWebhook(config.webhook.githubSecret, signature, payload)) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  if (event === "ping") {
    return NextResponse.json({ ok: true, event });
  }

  // Push events to the public account invalidate the GitHub snapshot cache.
  await deleteJson(`github:${config.github.username}`);

  return NextResponse.json({ ok: true, event, invalidated: "github" });
}