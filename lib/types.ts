// Shared types for the portfolio data layer + live system.

export type Rank = "S" | "A" | "B" | "C" | "D";
export type ProjectClass = "flagship" | "strong" | "supporting" | "experimental" | "archived";
export type ProjectStatus = "published" | "publishing-soon" | "local-demo" | "academic";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  type: "Full-Stack" | "Backend/Systems" | "Product/Frontend" | "Algorithms" | "Academic";
  rank: Rank;
  class: ProjectClass;
  featured: boolean;
  kind: "case-study" | "card";
  status: ProjectStatus;
  summary: string;
  problem: string;
  solution: string;
  stack: string[];
  github?: string;
  demo?: string;
  statusNote?: string;
  accent?: string; // hex for card accent
  tags: string[];
}

export interface CaseStudy {
  slug: string;
  overview: string[];
  architecture?: string;
  stack?: { category: string; items: string[] }[];
  features: string[];
  engineeringDecisions: string[];
  challenges: string[];
  tradeoffs?: string[];
  lessons: string[];
  status: ProjectStatus;
  related: string[];
}

export interface SkillCategory {
  title: string;
  note: string;
  color: string;
  items: { name: string; note: string }[];
}

export interface CodingPlatform {
  platform: string;
  handle: string;
  verified: boolean;
  solvedTotal?: number;
  easy?: number;
  medium?: number;
  hard?: number;
  rating?: number;
  maxRating?: number;
  dsaRating?: number;
  /** Peak DSA rating. Distinct from `dsaRating`, which is the current value. */
  maxDsaRating?: number;
  contests?: number;
  maxStreak?: number;
  stars?: number;
  badges?: string[];
  certificates?: string[];
  languages?: string[];
  url: string;
  color: string;
}

export interface CodingAggregate {
  totalSolved: number;
  platforms: number;
  contests: number;
  maxStreak: number;
  source: string;
  /**
   * ISO date (YYYY-MM-DD) on which this snapshot was synchronized from the
   * upstream API. Not the date the underlying data describes.
   */
  asOf: string;
}

/**
 * Everything needed to render coding metrics, and nothing else.
 *
 * Declared here rather than reusing the loader's own return type so that the
 * shape crossing the server/client boundary is explicit and JSON-safe. A
 * server component reads this and hands it to client components as props,
 * which removes the client-side fetch entirely: no waterfall, no second request,
 * and no flash of stale numbers before the real ones arrive.
 */
export interface CodingSnapshot {
  platforms: CodingPlatform[];
  aggregate: CodingAggregate;
  profileViews: number;
  meta: SyncMeta;
}

export interface TimelineEntry {
  date: string;
  title: string;
  detail: string;
  kind: "education" | "project" | "learning" | "milestone";
  source?: string;
}

export interface Socials {
  github: { handle: string; url: string };
  linkedin: { handle: string; url: string };
  codolio: { handle: string; key: string; url: string };
  email: string | null;
}

// ---- Live system types ----

/**
 * Freshness of an externally synchronized value.
 *
 * The vocabulary is deliberately explicit because the whole point is that a
 * reader can tell synchronized data from static profile data. Note that
 * `live` does not mean "pushed continuously" — it means "re-fetched within the
 * last minute of this request". The deployment is a serverless/static host, so
 * nothing is pushed in the background; see docs/deployment.md.
 */
export type Freshness =
  /** Fetched within the last minute of this request. */
  | "live"
  /** Fetched within the configured TTL. */
  | "recent"
  /** Fetched within 2x the TTL. */
  | "synced"
  /** Older than 2x the TTL but a successful snapshot is still being shown. */
  | "stale"
  /** Older than 7 days. */
  | "very-stale"
  /** No successful sync has ever happened in this process. */
  | "unavailable";

export interface SyncMeta {
  /** ISO timestamp of the snapshot currently being displayed. */
  fetchedAt: string | null;
  /** ISO timestamp of the most recent successful upstream fetch. */
  lastSuccessfulSync: string | null;
  /** ISO timestamp of the most recent failed upstream fetch. */
  lastFailedSync: string | null;
  status: Freshness;
  /** Human-readable reason, set when a fetch failed. Never user-supplied. */
  error?: string | null;
  /** Where the displayed values came from: an API, or the committed snapshot. */
  origin?: "api" | "snapshot";
}

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updated_at: string;
  private: boolean;
}

export interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GithubSnapshot {
  profile: GithubProfile;
  repos: GithubRepo[];
  meta: SyncMeta;
}

/** Aggregate counters derived from a repository list, not stored separately. */
export interface GithubCounts {
  stars: number;
  forks: number;
  languages: Record<string, number>;
}

export interface AnalyticsTotals {
  views: number;
  uniqueVisitors: number;
  sessions: number;
  viewsToday: number;
}

export interface SyncStatusInfo {
  key: string;
  label: string;
  lastSuccessfulSync: string | null;
  lastFailedSync: string | null;
  nextScheduledIn: number | null;
  records: number;
  healthy: boolean;
}