import type { CodingPlatform, CodingAggregate } from "../lib/types";

// Fallback snapshot captured during the 2026-09-16 audit.
// The live sync layer refreshes these values via the Codolio public API
// (lib/codolio.ts). These numbers are NEVER shown as "live" — freshness is
// always derived from the sync engine.
export const codingPlatformsFallback: CodingPlatform[] = [
  {
    platform: "CodeChef",
    handle: "shivareddy_27",
    verified: true,
    solvedTotal: 1976,
    rating: 1474,
    maxRating: 1474,
    dsaRating: 1737,
    contests: 37,
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
    solvedTotal: 276,
    easy: 185,
    medium: 76,
    hard: 15,
    rating: 1510,
    maxRating: 1510,
    contests: 15,
    maxStreak: 100,
    languages: ["Java"],
    badges: ["Annual Badge ×2"],
    url: "https://leetcode.com/u/KarkalaShivaReddy/",
    color: "#f5b759",
  },
  {
    platform: "GeeksforGeeks",
    handle: "shiva0327",
    verified: true,
    solvedTotal: 246,
    easy: 90,
    medium: 58,
    hard: 2,
    maxStreak: 94,
    url: "https://www.geeksforgeeks.org/user/shiva0327/",
    color: "#34d399",
  },
  {
    platform: "HackerRank",
    handle: "karkalashivared1",
    verified: true,
    solvedTotal: 75,
    badges: ["Problem Solving", "Java", "SQL"],
    certificates: ["Java (Basic)", "CSS (Basic)"],
    url: "https://www.hackerrank.com/profile/karkalashivared1",
    color: "#22c3a6",
  },
  {
    platform: "Codeforces",
    handle: "shiva_reddy_27",
    verified: true,
    solvedTotal: 40,
    maxStreak: 37,
    url: "https://codeforces.com/profile/shiva_reddy_27",
    color: "#d08770",
  },
];

export const codingAggregate: CodingAggregate = {
  totalSolved: 2613,
  platforms: 5,
  contests: 52, // 52 = 37 CodeChef rated + 15 LeetCode rated (fallback matches the live aggregate method: sum of per-platform rated-contest counts)
  maxStreak: 100,
  source: "Codolio",
  asOf: "2026-09-16",
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
