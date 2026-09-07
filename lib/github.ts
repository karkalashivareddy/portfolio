import type { GithubProfile, GithubRepo, GithubSnapshot, SyncMeta } from "./types";
import { config } from "./config";
import { readJson, writeJson, nowIso, freshnessFor, ageMs } from "./store";

/**
 * Fallback snapshot captured during the 2026-09-06 audit (see /docs
 * profile-audit.md, repository-audit.md). Used ONLY when GitHub is unreachable
 * and the cache is empty — the UI marks it "unavailable/snapshot", never live.
 */
const PROFILE_FALLBACK: GithubProfile = {
  login: "karkalashivareddy",
  name: null,
  bio: null,
  avatar_url: "https://avatars.githubusercontent.com/u/247306745?v=4",
  public_repos: 9,
  followers: 0,
  following: 0,
  created_at: "2025-12-02T05:43:49Z",
  html_url: "https://github.com/karkalashivareddy",
};

const REPOS_FALLBACK: GithubRepo[] = [
  { name: "DataBase-System-and-Distributed-Backend-Development", description: "Database Systems & Distributed Backend coursework: PharmaStock inventory portal (React + service layer) + DB practicals", html_url: "https://github.com/karkalashivareddy/DataBase-System-and-Distributed-Backend-Development", language: "JavaScript", stars: 0, forks: 0, topics: [], updated_at: "2026-08-29T00:00:00Z", private: false },
  { name: "Command-Argument-Passing-System", description: "Linux-based process monitoring and control system using C, Linux/POSIX system calls, /proc, and signals", html_url: "https://github.com/karkalashivareddy/Command-Argument-Passing-System", language: "C", stars: 0, forks: 0, topics: ["c", "linux", "operating-systems"], updated_at: "2026-08-28T00:00:00Z", private: false },
  { name: "Creaters_Shell_OSSP", description: "OSSP practicals & skills in C: fork/exec/signals/termios mini-shell and process inspection", html_url: "https://github.com/karkalashivareddy/Creaters_Shell_OSSP", language: "C", stars: 0, forks: 0, topics: ["c", "linux"], updated_at: "2026-08-27T00:00:00Z", private: false },
  { name: "hospital-bed-dashboard", description: "Hospital Bed Management System — Express + MySQL REST API with React and vanilla clients", html_url: "https://github.com/karkalashivareddy/hospital-bed-dashboard", language: "JavaScript", stars: 0, forks: 0, topics: ["express", "mysql", "react"], updated_at: "2026-06-20T00:00:00Z", private: false },
  { name: "university-time-table-generator", description: "University timetable generation tooling with constraint validation (Python)", html_url: "https://github.com/karkalashivareddy/university-time-table-generator", language: "Python", stars: 0, forks: 0, topics: [], updated_at: "2026-06-09T00:00:00Z", private: false },
  { name: "DSA2-Projects", description: "DSA-2 Mini Projects — AVL tree, B+ tree and graph/MST implementations in Java", html_url: "https://github.com/karkalashivareddy/DSA2-Projects", language: "Java", stars: 0, forks: 0, topics: ["java", "data-structures", "algorithms"], updated_at: "2026-05-28T00:00:00Z", private: false },
  { name: "FWD", description: "Frontend Web Development coursework (HTML/CSS/JS labs + Java projects)", html_url: "https://github.com/karkalashivareddy/FWD", language: "HTML", stars: 0, forks: 0, topics: [], updated_at: "2026-03-12T00:00:00Z", private: false },
];

const CACHE_KEY = `github:${config.github.username}`;

const EMPTY_META: SyncMeta = {
  fetchedAt: null,
  lastSuccessfulSync: null,
  lastFailedSync: null,
  status: "unavailable",
};

let inflight: Promise<GithubSnapshot> | null = null;

type RawRepo = Partial<GithubRepo> & {
  stargazers_count?: number;
  forks_count?: number;
};

function metaFor(sync: {
  fetchedAt: string;
  lastSuccessfulSync: string | null;
  lastFailedSync?: string | null;
  error?: string | null;
}): SyncMeta {
  const ttl = config.github.ttlMs;
  const age = ageMs(sync.fetchedAt);
  return {
    fetchedAt: sync.fetchedAt,
    lastSuccessfulSync: sync.lastSuccessfulSync,
    lastFailedSync: sync.lastFailedSync ?? null,
    error: sync.error ?? null,
    status: freshnessFor(age, ttl),
  };
}

async function fetchFromApi(): Promise<GithubSnapshot> {
  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${config.github.username}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio" },
      next: { revalidate: 900 },
    }),
    fetch(
      `https://api.github.com/users/${config.github.username}/repos?per_page=${config.github.perPage}&sort=pushed`,
      { headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio" }, next: { revalidate: 900 } }
    ),
  ]);
  if (!userRes.ok || !repoRes.ok) {
    throw new Error(`GitHub API returned ${userRes.status} / ${repoRes.status}`);
  }
  const profile = (await userRes.json()) as GithubProfile;
  const repos = (await repoRes.json()) as RawRepo[];
  return {
    profile,
    repos: repos.map(
      (r) =>
        ({
          name: r.name ?? r.html_url ?? "unnamed",
          description: r.description ?? null,
          html_url: r.html_url ?? `https://github.com/${config.github.username}`,
          language: r.language ?? null,
          stars: r.stargazers_count ?? r.stars ?? 0,
          forks: r.forks_count ?? r.forks ?? 0,
          topics: r.topics ?? [],
          updated_at: r.updated_at ?? new Date().toISOString(),
          private: Boolean(r.private),
        }) as GithubRepo
    ),
    meta: metaFor({ fetchedAt: nowIso(), lastSuccessfulSync: nowIso() }),
  };
}

function fallbackSnapshot(error: string | null): GithubSnapshot {
  return {
    profile: PROFILE_FALLBACK,
    repos: REPOS_FALLBACK,
    meta: { ...EMPTY_META, status: "unavailable", error },
  };
}

export async function getGithubSnapshot(forceSync = false): Promise<GithubSnapshot> {
  const cached = await readJson<GithubSnapshot>(CACHE_KEY);
  const age = ageMs(cached?.meta?.fetchedAt);

  if (!forceSync && cached && age !== null && age < config.github.ttlMs) {
    return { ...cached, meta: metaFor({ fetchedAt: cached.meta.fetchedAt!, lastSuccessfulSync: cached.meta.lastSuccessfulSync! }) };
  }

  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const fresh = await fetchFromApi();
      await writeJson(CACHE_KEY, fresh);
      return fresh;
    } catch (err) {
      const message = err instanceof Error ? err.message : "GitHub API unavailable";
      if (cached?.meta?.fetchedAt) {
        return {
          ...cached,
          meta: metaFor({
            fetchedAt: cached.meta.fetchedAt,
            lastSuccessfulSync: cached.meta.lastSuccessfulSync,
            lastFailedSync: nowIso(),
            error: message,
          }),
        };
      }
      return fallbackSnapshot(message);
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export async function forceGithubSync(): Promise<GithubSnapshot> {
  return getGithubSnapshot(true);
}

export async function clearGithubCache(): Promise<void> {
  await writeJson(CACHE_KEY, null);
}