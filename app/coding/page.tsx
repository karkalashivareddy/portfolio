import type { Metadata } from "next";
import { codechefRatingHistory } from "../../data/coding";
import CodingRouteLive from "../../components/coding/CodingRouteLive";
import { getCodolioSnapshot } from "../../lib/codolio";

export const metadata: Metadata = { title: "Coding", description: "Competitive programming record across CodeChef, LeetCode, GeeksforGeeks, HackerRank and Codeforces.", alternates: { canonical: "/coding" } };

/**
 * Rendered per request, for the same reason as the home page: a prerendered
 * HTML file freezes the freshness label at build time, which is exactly the
 * claim this route must not make.
 */
export const dynamic = "force-dynamic";

/**
 * Synchronized server-side, then rendered.
 *
 * This used to be a client component that painted the committed snapshot
 * immediately and then fetched `/api/codolio` in an effect. That produced two
 * wrong behaviours: every visitor saw stale numbers first, and each visit cost
 * an extra round trip that duplicated work the server had to do anyway.
 *
 * Reading the snapshot here means the numbers in the initial HTML are the real
 * ones, the freshness timestamp is present without JavaScript, and the browser
 * makes no request for this data at all.
 */
export default async function CodingPage() {
  const snapshot = await getCodolioSnapshot();
  const points = codechefRatingHistory
    .map((item, index) => `${(index / (codechefRatingHistory.length - 1)) * 100},${100 - ((item.rating - 600) / 900) * 78 - 8}`)
    .join(" ");
  return (
    <div className="world-route-page world-route-coding-page">
      <div className="world-shell">
        <CodingRouteLive points={points} snapshot={snapshot} />
      </div>
    </div>
  );
}