import { NextResponse } from "next/server";
import { getCodolioSnapshot } from "../../../lib/codolio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getCodolioSnapshot();
  return NextResponse.json({
    source: "codolio",
    key: snapshot.meta.status === "unavailable" ? null : snapshot.aggregate.source,
    platforms: snapshot.platforms,
    aggregate: snapshot.aggregate,
    profileViews: snapshot.profileViews,
    meta: snapshot.meta,
  });
}