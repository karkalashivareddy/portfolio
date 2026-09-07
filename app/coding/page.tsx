import type { Metadata } from "next";
import { codechefRatingHistory } from "../../data/coding";
import CodingRouteLive from "../../components/coding/CodingRouteLive";

export const metadata: Metadata = { title: "Coding", description: "Competitive programming record across CodeChef, LeetCode, GeeksforGeeks, HackerRank and Codeforces.", alternates: { canonical: "/coding" } };

export default function CodingPage() {
  const points = codechefRatingHistory.map((item, index) => `${(index / (codechefRatingHistory.length - 1)) * 100},${100 - ((item.rating - 600) / 900) * 78 - 8}`).join(" ");
  return <main className="world-route-page world-route-coding-page"><div className="world-shell"><CodingRouteLive points={points} /></div></main>;
}
