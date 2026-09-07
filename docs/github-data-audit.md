# GitHub Data Audit

_Read-only audit via unauthenticated GitHub REST API + local `gh` — 2026-09-06. Accurately reflects the account at audit time; the site treats it as live data (sync-on-read, 15 min TTL)._

## Account summary

| Field | Value |
| --- | --- |
| Username | `karkalashivareddy` |
| Display name | *(none set)* |
| Bio | *(none set)* |
| Location | *(none set)* |
| Followers / Following | 0 / 0 |
| Public repos | 9 |
| Starred | 0 |
| Pinned repos | none |
| Profile README | none (edit-profile README not present) |

## Public repositories (as listed on the account)

| Repo | Visibility | Notes |
| --- | --- | --- |
| DataBase-System-and-Distributed-Backend-Development | public | Contains PharmaStock frontend (React/Vite) under `Project/` |
| DSA2-Projects | public | Java: AVL, B-Tree, Graph exercises |
| Linux-Process-Monitoring-and-Control-System | public | Mostly docs/README; C source kept locally |
| Command-Argument-Passing-System | public | Sparse — C source local only |
| hospital-bed-dashboard | public | Express + MySQL + React |
| FWD | public | Frontend taskwork (C rank) |
| university-time-table-generator | public | C rank |
| fraud-detection-risk-intelligence | public | Sparse scaffold (D rank) |

> Note: `Linux-Process-Monitoring-and-Control-System` and `Command-Argument-Passing-System` expose only a small fraction of their local source. From the **public GitHub data alone** the account currently shows:
>
> - **0** followers, **0** stars, no pinned projects, no profile README, and no bio.
>
> The portfolio therefore must **not** claim stars/followers/reputation on GitHub. It presents GitHub as an honest "workspace, still building public presence" section — with personal highlights drawn from the **local** audit (docs/repository-audit.md). This is the accurate, non-inflated narrative.

## Funding of stats on the site

- GitHub section stats (repos, `Public repos`, latest push, top languages by repo) are served from `lib/github.ts` → live API with fallback snapshot.
- The featured-project cards use **local verified project data** (`data/projects.ts`), including local-only repos that are not yet on GitHub, clearly labeled with their hosting status.
- Sync meta (freshness: `LIVE / SYNCED / STALE / UNAVAILABLE`, `Synced X ago`) is derived from `Lib config TTL`s and rendered by `components/ui/SyncStatus.tsx`.

## Rate limit

- Unauthenticated GitHub API: 60 req/hr per IP. Mitigated via memory+disk cache (`data-store/`) with 15-min TTL and request coalescing. Optional `GITHUB_TOKEN` in env raises this to 5,000/hr.
