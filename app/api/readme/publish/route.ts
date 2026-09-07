import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdminMutation } from "../../../../lib/security";
import { generateProfileReadme } from "../../../../lib/readme";
import { config } from "../../../../lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/readme/publish
 * Writes the approved generation to github/profile-readme.md.
 *
 * This is an explicit owner-initiated action: AUTO_UPDATE_README stays off and
 * nothing ever auto-pushes. Publishing the file to GitHub is done by the owner
 * via a normal commit.
 */
export async function POST(raw: NextRequest) {
  const admin = await requireAdminMutation(raw);
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const content = generateProfileReadme();
  const target = path.join(process.cwd(), "github", "profile-readme.md");
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, "utf-8");
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `could not write file: ${String(err)}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    writtenTo: "github/profile-readme.md",
    autoUpdate: config.readme.autoUpdate,
    note: "File written locally. Commit and push to GitHub to apply.",
  });
}