import type { CodingAggregate, CodingPlatform, CodingSnapshot } from "./types";
import { config } from "./config";
import { readJson, writeJson, nowIso, freshnessFor, ageMs } from "./store";
import { readFixture } from "./fixtures";
import {
  codingPlatformsFallback,
  codingAggregate,
  codingProfileViewsFallback,
} from "../data/coding";

export type CodolioSnapshot = CodingSnapshot;

const CACHE_KEY = `codolio:${config.codolio.userKey}`;

let inflight: Promise<CodolioSnapshot> | null = null;

interface RawCodolio {
  status: { success: boolean; code: number; message: string };
  data: {
    profileName: string;
    profileViews: number;
    firstName: string;
    secondName: string;
    platformProfiles: {
      platformProfiles: Array<{
        platform: string;
        isVerified?: boolean;
        userStats: {
          stars?: number;
          currentRating?: number;
          maxRating?: number;
          dsaRating?: number;
          maxDsaRating?: number;
          handle?: string;
          languageList?: string[];
        };
        badgeStats?: { badgeList: Array<{ name: string }> | null };
        totalQuestionStats?: {
          totalQuestionCounts?: number;
          easyQuestionCounts?: number;
          mediumQuestionCounts?: number;
          hardQuestionCounts?: number;
          basicQuestionCounts?: number;
        };
        contestActivityStats?: { contestActivityList?: unknown[] };
        dailyActivityStatsResponse?: { maxStreak?: number | null };
        certificateStats?: { certificates?: Array<{ name: string }> };
      }>;
    };
  };
}

function platformUrl(platform: string, handle: string): string {
  const map: Record<string, string> = {
    codechef: `https://www.codechef.com/users/${handle}`,
    leetcode: `https://leetcode.com/u/${handle}/`,
    geeksforgeeks: `https://www.geeksforgeeks.org/user/${handle}/`,
    hackerrank: `https://www.hackerrank.com/profile/${handle}`,
    codeforces: `https://codeforces.com/profile/${handle}`,
  };
  return map[platform] || `https://codolio.com/profile/${config.codolio.userKey}`;
}

function platformColor(platform: string): string {
  const colors: Record<string, string> = {
    codechef: "#7c5749",
    leetcode: "#f5b759",
    geeksforgeeks: "#34d399",
    hackerrank: "#22c3a6",
    codeforces: "#d08770",
  };
  return colors[platform] || "#5b8def";
}

function normalize(raw: RawCodolio): CodolioSnapshot {
  const fetchedAt = nowIso();
  const list = raw.data?.platformProfiles?.platformProfiles ?? [];
  const platforms: CodingPlatform[] = list
    .filter((p) => p.userStats?.handle)
    .map((p) => {
      const qs = p.totalQuestionStats;
      return {
        platform: p.platform,
        handle: p.userStats.handle!,
        verified: Boolean(p.isVerified),
        solvedTotal: qs?.totalQuestionCounts,
        easy: qs?.easyQuestionCounts ?? undefined,
        medium: qs?.mediumQuestionCounts ?? undefined,
        hard: qs?.hardQuestionCounts ?? undefined,
        rating: p.userStats.currentRating ?? undefined,
        maxRating: p.userStats.maxRating ?? undefined,
        // Both are reported. The previous build kept only `dsaRating`, which
        // meant a peak DSA rating (1738) could never be distinguished from the
        // current one (1494).
        dsaRating: p.userStats.dsaRating ?? undefined,
        maxDsaRating: p.userStats.maxDsaRating ?? undefined,
        stars: p.userStats.stars ?? undefined,
        contests: p.contestActivityStats?.contestActivityList?.length,
        maxStreak: p.dailyActivityStatsResponse?.maxStreak ?? undefined,
        badges: p.badgeStats?.badgeList?.length
          ? p.badgeStats.badgeList.map((b) => b.name)
          : undefined,
        certificates: p.certificateStats?.certificates?.map((c) => c.name),
        languages: p.userStats.languageList ?? undefined,
        url: platformUrl(p.platform, p.userStats.handle!),
        color: platformColor(p.platform),
      };
    });

  const totalSolved = platforms.reduce((acc, p) => acc + (p.solvedTotal ?? 0), 0);
  const contests = platforms.reduce((acc, p) => acc + (p.contests ?? 0), 0);
  const maxStreak = platforms.reduce((acc, p) => Math.max(acc, p.maxStreak ?? 0), 0);

  const aggregate: CodingAggregate = {
    totalSolved,
    platforms: platforms.length || 1,
    contests,
    maxStreak,
    source: "Codolio",
    asOf: fetchedAt.slice(0, 10),
  };

  return {
    platforms,
    aggregate,
    profileViews: raw.data?.profileViews ?? 0,
    meta: {
      fetchedAt,
      lastSuccessfulSync: fetchedAt,
      lastFailedSync: null,
      status: "live",
      origin: "api",
    },
  };
}

/**
 * Degraded state: the API is unreachable and there is no cached copy.
 *
 * The committed snapshot is returned with its real synchronization date and
 * `origin: "snapshot"`, so the UI can say "Verified snapshot · 6 Oct" instead of
 * implying either live data or a total absence of data.
 */
function fallbackSnapshot(error: string | null): CodolioSnapshot {
  const at = `${codingAggregate.asOf}T00:00:00.000Z`;
  return {
    platforms: codingPlatformsFallback,
    aggregate: codingAggregate,
    profileViews: codingProfileViewsFallback,
    meta: {
      fetchedAt: at,
      lastSuccessfulSync: at,
      lastFailedSync: nowIso(),
      status: "very-stale",
      origin: "snapshot",
      error,
    },
  };
}

function staleFrom(cached: CodolioSnapshot, error: string): CodolioSnapshot {
  const age = ageMs(cached.meta.fetchedAt);
  return {
    ...cached,
    meta: {
      fetchedAt: cached.meta.fetchedAt,
      lastSuccessfulSync: cached.meta.lastSuccessfulSync,
      lastFailedSync: nowIso(),
      status: freshnessFor(age, config.codolio.ttlMs),
      origin: cached.meta.origin ?? "api",
      error,
    },
  };
}

export async function getCodolioSnapshot(forceSync = false): Promise<CodolioSnapshot> {
  // Test-only seam, inactive unless PORTFOLIO_TEST_FIXTURES=1 (see lib/fixtures).
  const fixture = await readFixture<CodolioSnapshot>("codolio", config.codolio.ttlMs);
  if (fixture) return fixture;

  const cached = await readJson<CodolioSnapshot>(CACHE_KEY);
  const age = ageMs(cached?.meta?.fetchedAt);

  if (!forceSync && cached && age !== null && age < config.codolio.ttlMs) {
    // `asOf` is preserved rather than refreshed to today. It records when these
    // figures were read from the API; stamping it with the current date on every
    // cache hit would claim a measurement that never happened.
    return {
      ...cached,
      meta: { ...cached.meta, status: freshnessFor(age, config.codolio.ttlMs) },
    };
  }

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch(
        `https://api.codolio.com/profile?userKey=${encodeURIComponent(config.codolio.userKey)}`,
        { headers: { Accept: "application/json" }, next: { revalidate: 900 } }
      );
      if (!res.ok) throw new Error(`Codolio API returned ${res.status}`);
      const raw = (await res.json()) as RawCodolio;
      if (!raw.status?.success) throw new Error("Codolio API: unsuccessful status");
      const fresh = normalize(raw);
      await writeJson(CACHE_KEY, fresh);
      return fresh;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Codolio unavailable";
      if (cached?.meta?.fetchedAt) return staleFrom(cached, message);
      return fallbackSnapshot(message);
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export async function forceCodolioSync(): Promise<CodolioSnapshot> {
  return getCodolioSnapshot(true);
}