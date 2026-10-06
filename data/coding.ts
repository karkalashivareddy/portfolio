import type { CodingPlatform, CodingAggregate } from "../lib/types";

/**
 * Committed snapshot of the Codolio profile, synchronized 2026-10-06.
 *
 * WHAT THIS IS FOR
 * ----------------
 * This is a fallback, not the source of truth. `lib/codolio.ts` reads the public
 * Codolio API on every request (cached for `CODOLIO_TTL_MS`); this file is only
 * used when that fetch fails and no cached copy exists, so the page still
 * renders something truthful instead of an empty state.
 *
 * It is also committed on purpose: it is what makes the site readable with no
 * network at all, and what the Playwright suite asserts against.
 *
 * WHY IT IS EXPLICIT ABOUT ITS DATE
 * ---------------------------------
 * Every number here was stale at some point. This repository previously carried
 * four different CodeChef ratings (1455 / 1474 / 1707 / 1737) and two different
 * totals (2,531 / 2,613) because snapshots were edited by hand and never
 * re-synchronized. The UI labels this data "Verified snapshot" and prints this
 * date, so a reader is never told a month-old figure is current.
 *
 * TO REFRESH
 * -----------
 *   curl "https://api.codolio.com/profile?userKey=2520030105"
 *
 * Replace the fields below with the response and update `SNAPSHOT_DATE`.
 */
export const SNAPSHOT_DATE = "2026-10-06";

export const codingPlatformsFallback: CodingPlatform[] = [
  {
    platform: "CodeChef",
    handle: "shivareddy_27",
    verified: true,
    solvedTotal: 2034,
    rating: 1528,
    maxRating: 1528,
    dsaRating: 1494,
    maxDsaRating: 1738,
    contests: 40,
    stars: 2,
    badges: [
      "Problem Solver - Diamond Badge",
      "Daily Streak - Diamond Badge",
      "Code Enthusiast - Silver Badge",
      "Contest Contender - Silver Badge",
    ],
    url: "https://www.codechef.com/users/shivareddy_27",
    color: "#7c5749",
  },
  {
    platform: "LeetCode",
    handle: "KarkalaShivaReddy",
    verified: true,
    solvedTotal: 295,
    easy: 192,
    medium: 87,
    hard: 16,
    rating: 1524,
    maxRating: 1550,
    contests: 19,
    maxStreak: 119,
    languages: ["Java"],
    badges: ["Annual Badge"],
    url: "https://leetcode.com/u/KarkalaShivaReddy/",
    color: "#f5b759",
  },
  {
    platform: "GeeksforGeeks",
    handle: "shiva0327",
    verified: true,
    solvedTotal: 279,
    easy: 91,
    medium: 62,
    hard: 3,
    maxStreak: 106,
    url: "https://www.geeksforgeeks.org/user/shiva0327/",
    color: "#34d399",
  },
  {
    platform: "HackerRank",
    handle: "karkalashivared1",
    verified: true,
    solvedTotal: 79,
    contests: 1,
    badges: ["Problem Solving", "Java", "Sql", "C"],
    certificates: ["Java (Basic)", "CSS (Basic)"],
    url: "https://www.hackerrank.com/karkalashivared1",
    color: "#22c3a6",
  },
  {
    platform: "Codeforces",
    handle: "shiva_reddy_27",
    verified: true,
    solvedTotal: 58,
    contests: 0,
    maxStreak: 56,
    url: "https://codeforces.com/profile/shiva_reddy_27",
    color: "#d08770",
  },
];

/**
 * Totals are the sum of the per-platform values above, matching how
 * `lib/codolio.ts` aggregates a live response. 2034 + 295 + 279 + 79 + 58 =
 * 2745 solved; 40 + 19 + 1 + 1 + 0 = 61 rated contests; longest streak 119.
 */
export const codingAggregate: CodingAggregate = {
  totalSolved: 2745,
  platforms: 5,
  contests: 61,
  maxStreak: 119,
  source: "Codolio",
  asOf: SNAPSHOT_DATE,
};

/**
 * CodeChef rating history, Starters 202 -> 254.
 *
 * This is a genuinely historical series and is labelled as such in the UI. The
 * final recorded point is 1455 (Starters 254, Aug 2026); the live API reports a
 * current rating of 1528, so the curve and the headline number differ on purpose
 * — the curve is contest history, the headline is where the rating stands now.
 */
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

/** Last contest recorded in `codechefRatingHistory`. */
export const CODECHEF_HISTORY_LAST = codechefRatingHistory[codechefRatingHistory.length - 1];

export const codingPlatformsUrl = "https://codolio.com/profile/2520030105";

/**
 * Profile view count as reported by the Codolio API. Kept because it is the one
 * figure here that is purely about this portfolio rather than about practice.
 */
export const codingProfileViewsFallback = 35;
