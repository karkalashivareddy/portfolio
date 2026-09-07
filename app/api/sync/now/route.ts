import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "../../../../lib/security";
import { forceGithubSync } from "../../../../lib/github";
import { forceCodolioSync } from "../../../../lib/codolio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/sync/now?source=github|codolio|all — admin-only manual sync. */
export async function POST(raw: NextRequest) {
  const admin = await requireAdminMutation(raw);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const source = raw.nextUrl.searchParams.get("source") ?? "all";
  const tasks: Record<string, Promise<unknown>> = {};
  if (source === "github" || source === "all") tasks.github = forceGithubSync();
  if (source === "codolio" || source === "all") tasks.codolio = forceCodolioSync();

  const results = await Promise.allSettled(Object.entries(tasks).map(([k, p]) => p.then((v) => [k, v])));
  const outcome: Record<string, { ok: boolean; status?: string; error?: string }> = {};
  for (const r of results) {
    if (r.status === "fulfilled") {
      const [k, v] = r.value as [string, { meta: { status: string } }];
      outcome[k] = { ok: true, status: v.meta.status };
    } else {
      outcome[(r.reason as { _key?: string })._key ?? "unknown"] = { ok: false, error: String(r.reason) };
    }
  }

  return NextResponse.json({ ok: true, synced: new Date().toISOString(), outcome });
}