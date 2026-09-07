import { NextRequest, NextResponse } from "next/server";
import { requireAdminMutation } from "../../../lib/security";
import { generateProfileReadme, readmeSettings } from "../../../lib/readme";
import { readJson } from "../../../lib/store";

export const runtime = "nodejs";

/** GET /api/readme — admin-only: preview current generated README. */
export async function GET(raw: NextRequest) {
  const admin = await requireAdminMutation(raw);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const signature = await readJson<string>("readme:last-signature");
  return NextResponse.json({
    ok: true,
    mode: readmeSettings.mode,
    approvalRequired: readmeSettings.approvalRequired,
    content: generateProfileReadme(),
    lastApprovedSignature: signature,
  });
}

/** POST /api/readme — admin-only: regenerate (and optionally approve → usable). */
export async function POST(raw: NextRequest) {
  const admin = await requireAdminMutation(raw);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const content = generateProfileReadme();
  const { writeJson } = await import("../../../lib/store");
  await writeJson("readme:last-signature", content);

  return NextResponse.json({
    ok: true,
    content,
    approved: false,
    note:
      "Generated. Review the preview, then copy to github/profile-readme.md. Auto-publish stays manual until AUTO_UPDATE_README=true.",
  });
}