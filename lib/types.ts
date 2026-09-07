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
  contests?: number;
  maxStreak?: number;
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
  asOf: string;
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

export type Freshness =
  | "live"
  | "recent"
  | "synced"
  | "stale"
  | "unavailable";

export interface SyncMeta {
  fetchedAt: string | null; // ISO
  lastSuccessfulSync: string | null;
  lastFailedSync: string | null;
  status: Freshness;
  error?: string | null;
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