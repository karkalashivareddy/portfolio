# Data Source Map

_Where every displayed number comes from, how fresh it is, and how a visitor can verify it. Governs the "no fabricated data" rule site-wide._

## Legend

| Freshness | Meaning |
| --- | --- |
| `LIVE` | Fetched within the last TTL window (fetched < 15 min for GitHub, < 60 min for Codolio) |
| `RECENT` | Fetched â‰¤ 24 h ago |
| `SYNCED` | Fetched > 24 h ago (still valid, older snapshot) |
| `STALE` | Older than TTL and used as best-effort display, marked downgraded |
| `UNAVAILABLE` | External source unreachable/error â€” showing an offline snapshot, always labeled |

## Sources

### 1. Codolio (primary for coding stats)
- **Endpoint:** `GET https://api.codolio.com/profile?userKey=2520030105`
- **Auth:** none (public endpoint).
- **TTL:** 60 min (`CODOLIO_TTL_MS`). Cache key `codolio:2520030105` in `data-store/`.
- **Fields used:** aggregate problems solved, per-platform breakdown, CodeChef rating history, streak, contests, badges.
- **Verifiable by visitor:** https://codolio.com/profile/2520030105

### 2. GitHub REST API (repo activity)
- **Endpoint:** `GET https://api.github.com/users/{GITHUB_USERNAME}` + `/repos`.
- **Auth:** none in production default (optional `GITHUB_TOKEN`).
- **TTL:** 15 min (`GITHUB_TTL_MS`). Cache key `github:username` in `data-store/`.
- **Fields used:** public repo count, repo metadata, pushed_at, languages, forks.

### 3. Local verified project data (featured projects, case studies)
- **Source:** local repositories inspected under `C:\Users\karka\` (docs/repository-audit.md) + `data/profile.ts`, `data/projects.ts`, `data/caseStudies.ts`, `data/skills.ts`, `data/timeline.ts`.
- **Nature:** human-verified, committed as content, edited by owner only.
- **Freshness:** n/a (deliberately "frozen" between owner reviews).

### 4. Analytics (portfolio visits)
- **Source:** our own `/api/analytics` ingest â†’ `data-store/analytics/events.jsonl`.
- **Privacy:** aggregate/anonymized; visitor = random client id; no IP logging, no cookies (localStorage self-issued id only), country only via platform-provided request header, referrer reduced to origin.
- **Exposure:** public GET exposes totals + last event only. Full (paths, devices, countries, outbound) is admin-only.

### 5. LinkedIn
- **Source:** none. LinkedIn blocks programmatic access (HTTP 999). Only a **link** â€” no claims, counts, or history are sourced from it.

## Numbers that must never be invented

- Internships, jobs, companies worked at.
- GitHub stars, followers, total commits.
- "X students taught", "X rated by users", any product-level metric.
- Percentage improvements without a recorded baseline.

## Display rule

Any number rendered next to a `source:` label can be traced to one of the four sources above. Sections without a verifiable source use descriptive, honest copy instead of numbers.

## DIY verification path for visitors

1. Coding stats â†’ open Codolio profile (linked).
2. Repo list â†’ open GitHub account (linked).
3. Project claims â†’ repo links or contact email (link-local repos note as such).