import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "../../../../lib/security";
import { computeSummary } from "../../../../lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(raw: NextRequest) {
  const admin = await requireAdminMutation(raw);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const summary = await computeSummary();
  return NextResponse.json(summary);
}

export async function POST(raw: NextRequest) {
  const admin = await requireAdminMutation(raw);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const { writeJson } = await import("../../../../lib/store");
  let body: { action?: string } = {};
  try {
    body = (await raw.json()) as { action?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (body.action === "reset-summary") {
    await writeJson("analytics:summary", null);
    return NextResponse.json({ ok: true, note: "summary cache cleared" });
  }
  if (body.action === "delete-events") {
    await writeJson("analytics:events", []);
    await writeJson("analytics:summary", null);
    return NextResponse.json({ ok: true, note: "events deleted" });
  }
  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}