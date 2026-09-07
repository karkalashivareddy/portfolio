import type { CodingPlatform, CodingAggregate } from "../lib/types";

// Fallback snapshot captured during the 2026-09-06 audit.
// The live sync layer refreshes these values via the Codolio public API
// (lib/codolio.ts). These numbers are NEVER shown as "live" — freshness is
// always derived from the sync engine.
export const codingPlatformsFallback: CodingPlatform[] = [
  {
    platform: "CodeChef",
    handle: "shivareddy_27",
    verified: true,
    solvedTotal: 1943,
    rating: 1455,
    maxRating: 1455,
    dsaRating: 1707,
    contests: 36,
    badges: [
      "Problem Solver — Diamond (1000+ problems)",
      "Daily Streak — Diamond (100 days)",
      "Code Enthusiast — Silver",
      "Contest Contender — Silver",
    ],
    url: "https://www.codechef.com/users/shivareddy_27",
    color: "#7c5749",
  },
  {
    platform: "LeetCode",
    handle: "KarkalaShivaReddy",
    verified: true,
    solvedTotal: 264,
    easy: 179,
    medium: 71,
    hard: 14,
    rating: 1475,
    maxRating: 1500,
    contests: 14,
    maxStreak: 91,
    languages: ["Java"],
    badges: ["Annual Badge ×2"],
    url: "https://leetcode.com/u/KarkalaShivaReddy/",
    color: "#f5b759",
  },
  {
    platform: "GeeksforGeeks",
    handle: "shiva0327",
    verified: true,
    solvedTotal: 225,
    easy: 89,
    medium: 51,
    hard: 2,
    maxStreak: 85,
    url: "https://www.geeksforgeeks.org/user/shiva0327/",
    color: "#34d399",
  },
  {
    platform: "HackerRank",
    handle: "karkalashivared1",
    verified: true,
    solvedTotal: 68,
    badges: ["Problem Solving", "Java", "SQL"],
    certificates: ["Java (Basic)", "CSS (Basic)"],
    url: "https://www.hackerrank.com/profile/karkalashivared1",
    color: "#22c3a6",
  },
  {
    platform: "Codeforces",
    handle: "shiva_reddy_27",
    verified: true,
    solvedTotal: 31,
    maxStreak: 28,
    url: "https://codeforces.com/profile/shiva_reddy_27",
    color: "#d08770",
  },
];

export const codingAggregate: CodingAggregate = {
  totalSolved: 2531,
  platforms: 5,
  contests: 50, // 50 = 36 CodeChef rated + 14 LeetCode rated (fallback matches the live aggregate method: sum of per-platform rated-contest counts)
  maxStreak: 91,
  source: "Codolio",
  asOf: "2026-09-06",
};

// Verified CodeChef rating progression (Starters 202→254), used for the
// rating curve chart. Sourced from the Codolio public profile during audit.
export const codechefRatingHistory: { contest: string; rating: number; date: string }[] = [
  { contest: "Starters 202", rating: 623, date: "Sep 2025" },
  { contest: "Starters 211", rating: 966, date: "Nov 2025" },
  { contest: "Starters 216", rating: 1108, date: "Dec 2025" },
  { contest: "Starters 224", rating: 1178, date: "Feb 2026" },
  { contest: "Starters 227", rating: 1335, date: "Feb 2026" },
  { contest: "Starters 229", rating: 1368, date: "Mar 2026" },
  { contest: "Starters 236", rating: 1400, date: "Apr 2026" },
  { contest: "Starters 245", rating: 1397, date: "Jun 2026" },
  { contest: "Starters 246", rating: 1436, date: "Jun 2026" },
  { contest: "Starters 249", rating: 1437, date: "Jul 2026" },
  { contest: "Starters 253", rating: 1439, date: "Aug 2026" },
  { contest: "Starters 254", rating: 1455, date: "Aug 2026" },
];

export const codingPlatformsUrl = "https://codolio.com/profile/2520030105";