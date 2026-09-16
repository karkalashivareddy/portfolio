import type { GithubProfile, GithubRepo, GithubSnapshot, SyncMeta } from "./types";
import { config } from "./config";
import { readJson, writeJson, nowIso, freshnessFor, ageMs } from "./store";

/**
 * Fallback snapshot captured during the 2026-09-16 audit (see /docs
 * profile-audit.md, repository-audit.md). Used ONLY when GitHub is unreachable
 * and the cache is empty — the UI marks it "unavailable/snapshot", never live.
 */
const PROFILE_FALLBACK: GithubProfile = {
  login: "karkalashivareddy",
  name: "Karkala Shiva Reddy",
  bio: "CSE student building algorithms, backend systems, databases, and applied ML projects.",
  avatar_url: "https://avatars.githubusercontent.com/u/247306745?v=4",
  public_repos: 11,
  followers: 0,
  following: 0,
  created_at: "2025-12-02T05:43:49Z",
  html_url: "https://github.com/karkalashivareddy",
};

const REPOS_FALLBACK: GithubRepo[] = [
  { name: "forgesense-industrial-intelligence", description: "Industrial operations intelligence platform with Spring Boot, digital twins, FastAPI ML, Kafka, Redis, PostgreSQL, WebSockets, and Three.js.", html_url: "https://github.com/karkalashivareddy/forgesense-industrial-intelligence", language: "Java", stars: 0, forks: 0, topics: ["docker", "fastapi", "java", "kafka", "machine-learning", "postgresql", "python", "redis", "spring-boot", "threejs", "websockets"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer", description: "Full-stack log intelligence laboratory combining Spring Boot, React, and executable string, dynamic-programming, graph/flow, randomized, approximation, and parallel algorithms.", html_url: "https://github.com/karkalashivareddy/KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer", language: "Java", stars: 0, forks: 0, topics: ["algorithms", "benchmarking", "data-structures", "java", "log-analysis", "react", "spring-boot", "typescript"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "portfolio", description: "Next.js portfolio application for Karkala Shiva Reddy with typed project data, interactive UI, motion, and a client-side Three.js scene.", html_url: "https://github.com/karkalashivareddy/portfolio", language: "TypeScript", stars: 0, forks: 0, topics: ["nextjs", "portfolio", "react", "tailwindcss", "threejs", "typescript"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "DataBase-System-and-Distributed-Backend-Development", description: "PharmaStock coursework repository with a React/Vite medicine inventory interface, Express/Mongoose backend foundation, and database systems practicals.", html_url: "https://github.com/karkalashivareddy/DataBase-System-and-Distributed-Backend-Development", language: "JavaScript", stars: 0, forks: 0, topics: ["database", "express", "inventory-management", "javascript", "mongodb", "mongoose", "nodejs", "react"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "hospital-bed-dashboard", description: "Hospital bed dashboard with an Express/MySQL API, admission, discharge, and transfer workflows, plus browser and React frontends.", html_url: "https://github.com/karkalashivareddy/hospital-bed-dashboard", language: "JavaScript", stars: 0, forks: 0, topics: ["dashboard", "express", "healthcare", "javascript", "mysql", "nodejs"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "Creaters_Shell_OSSP", description: "Linux systems-programming collection with a C mini shell, process, signal, /proc, FIFO, and file-descriptor exercises.", html_url: "https://github.com/karkalashivareddy/Creaters_Shell_OSSP", language: "C", stars: 0, forks: 0, topics: ["c", "ipc", "linux", "operating-systems", "processes", "signals", "systems-programming"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "Command-Argument-Passing-System", description: "Project abstract for a planned C/Linux fork-exec argument-passing and process-synchronization utility; implementation source is not yet in the repository.", html_url: "https://github.com/karkalashivareddy/Command-Argument-Passing-System", language: "C", stars: 0, forks: 0, topics: ["c", "linux", "operating-systems", "process-management", "systems-programming"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "university-time-table-generator", description: "Python heuristic university timetable generator with room, faculty, batch, and credit-load constraints.", html_url: "https://github.com/karkalashivareddy/university-time-table-generator", language: "Python", stars: 0, forks: 0, topics: ["algorithms", "constraint-satisfaction", "python", "scheduling"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "DSA2-Projects", description: "Java DSA exercises covering AVL insertion, a warehouse range-scan demo, and Prim's minimum spanning tree.", html_url: "https://github.com/karkalashivareddy/DSA2-Projects", language: "Java", stars: 0, forks: 0, topics: ["algorithms", "avl-tree", "data-structures", "java", "minimum-spanning-tree"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "FWD", description: "Front-end development coursework with HTML/CSS/JavaScript exercises and web/Java student gate-pass implementations.", html_url: "https://github.com/karkalashivareddy/FWD", language: "HTML", stars: 0, forks: 0, topics: ["css", "frontend", "html", "java", "javascript", "web-development"], updated_at: "2026-09-16T00:00:00Z", private: false },
  { name: "karkalashivareddy", description: "Professional profile for Karkala Shiva Reddy, a CSE student building algorithms, systems, backend, database, and applied ML projects.", html_url: "https://github.com/karkalashivareddy/karkalashivareddy", language: "Markdown", stars: 0, forks: 0, topics: [], updated_at: "2026-09-16T00:00:00Z", private: false },
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
