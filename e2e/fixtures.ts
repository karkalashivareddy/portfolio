import { promises as fs } from "fs";
import path from "path";
import type { CodingSnapshot, GithubSnapshot, SyncMeta } from "../lib/types";
import type { Page } from "@playwright/test";

/**
 * Recorded upstream payloads for the end-to-end suite.
 *
 * The figures are the real ones returned by the two public APIs this project
 * reads, captured on 2026-10-06 — they are recorded responses, not invented
 * numbers, which is why the assertions can pin exact values and still be
 * deterministic. Nothing here is scraped and no test contacts a third party.
 *
 * The payloads are typed against `lib/types`, so if the loader's shape changes
 * the suite fails to compile instead of silently testing a stale contract.
 */
export const RECORDED_CODOLIO: CodingSnapshot = {
  platforms: [
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
      badges: ["Problem Solver - Diamond Badge", "Daily Streak - Diamond Badge"],
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
      badges: ["Problem Solving", "Java"],
      certificates: ["Java (Basic)"],
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
  ],
  aggregate: {
    totalSolved: 2745,
    platforms: 5,
    contests: 61,
    maxStreak: 119,
    source: "Codolio",
    asOf: "2026-10-06",
  },
  profileViews: 35,
  meta: {
    fetchedAt: "2026-10-06T09:20:59.472Z",
    lastSuccessfulSync: "2026-10-06T09:20:59.472Z",
    lastFailedSync: null,
    status: "recent",
    origin: "api",
  },
};

export const RECORDED_GITHUB: GithubSnapshot = {
  profile: {
    login: "karkalashivareddy",
    name: "Karkala Shiva Reddy",
    bio: "CSE student building algorithms, backend systems, databases, and applied ML projects.",
    avatar_url: "https://avatars.githubusercontent.com/u/247306745?v=4",
    public_repos: 11,
    followers: 0,
    following: 0,
    created_at: "2025-12-02T05:43:49Z",
    html_url: "https://github.com/karkalashivareddy",
  },
  repos: [
    {
      name: "Command-Argument-Passing-System",
      description:
        "CAPS 2.0 - a Linux process execution and observability platform with controlled POSIX execution, real procfs/sysfs telemetry, pipeline evidence, replay, and analytics.",
      html_url: "https://github.com/karkalashivareddy/Command-Argument-Passing-System",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      topics: ["c", "linux", "posix", "procfs"],
      updated_at: "2026-10-06T09:00:28Z",
      private: false,
    },
    {
      name: "forgesense-industrial-intelligence",
      description: "Industrial asset-health and failure-risk console on synthetic telemetry.",
      html_url: "https://github.com/karkalashivareddy/forgesense-industrial-intelligence",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      topics: ["docker", "kafka", "scikit-learn"],
      updated_at: "2026-10-06T09:34:35Z",
      private: false,
    },
    {
      name: "KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer",
      description:
        "Full-stack log intelligence laboratory combining Spring Boot, React, and executable algorithms.",
      html_url: "https://github.com/karkalashivareddy/KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer",
      language: "Java",
      stars: 0,
      forks: 0,
      topics: ["algorithms", "java"],
      updated_at: "2026-10-06T09:53:05Z",
      private: false,
    },
  ],
  meta: {
    fetchedAt: "2026-10-06T09:30:00.000Z",
    lastSuccessfulSync: "2026-10-06T09:30:00.000Z",
    lastFailedSync: null,
    status: "recent",
    origin: "api",
  },
};

/**
 * Directory the running server reads fixtures from.
 *
 * `playwright.config.ts` starts `next start` with `PORTFOLIO_TEST_FIXTURES=1`
 * and `PORTFOLIO_FIXTURE_DIR` pointing here, so `lib/fixtures.ts` hands these
 * payloads to the loaders instead of the network. The file is rewritten per
 * test; the suite runs with a single worker so one test cannot read another
 * test's state.
 */
export const STATE_DIR = path.join(process.cwd(), "e2e", ".state");

function isoAgo(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

async function writeState(name: string, snapshot: { meta: SyncMeta }): Promise<void> {
  await fs.mkdir(STATE_DIR, { recursive: true });
  await fs.writeFile(path.join(STATE_DIR, `${name}.json`), JSON.stringify(snapshot, null, 2), "utf8");
}

export interface StateOptions {
  /** Age of the displayed snapshot, which is what determines the freshness label. */
  ageMs: number;
  /** Where the displayed values came from. */
  origin?: SyncMeta["origin"];
  /** Present when a fetch failed, matching the loaders' degraded states. */
  error?: string | null;
}

/** Publish a synchronized Codolio snapshot with a chosen age. */
export async function useCodolioState(options: StateOptions): Promise<void> {
  const syncedAt = isoAgo(options.ageMs);
  await writeState("codolio", {
    ...RECORDED_CODOLIO,
    meta: {
      fetchedAt: syncedAt,
      lastSuccessfulSync: syncedAt,
      lastFailedSync: options.error ? new Date().toISOString() : null,
      status: "recent",
      origin: options.origin ?? "api",
      error: options.error ?? null,
    },
  });
}

/** Publish a synchronized GitHub snapshot with a chosen age. */
export async function useGithubState(options: StateOptions): Promise<void> {
  const syncedAt = isoAgo(options.ageMs);
  await writeState("github", {
    ...RECORDED_GITHUB,
    meta: {
      fetchedAt: syncedAt,
      lastSuccessfulSync: syncedAt,
      lastFailedSync: options.error ? new Date().toISOString() : null,
      status: "recent",
      origin: options.origin ?? "api",
      error: options.error ?? null,
    },
  });
}

/**
 * Collect console errors, page errors and failed requests so a test can assert
 * that an ordinary navigation produced none. Aborted navigations are ignored.
 */
export function watchForErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "";
    if (failure.includes("ERR_ABORTED")) return;
    errors.push(`requestfailed: ${request.url()} ${failure}`);
  });
  return errors;
}