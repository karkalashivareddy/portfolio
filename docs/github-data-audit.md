# GitHub Data Audit

> **Corrected 2026-10-06.** The `Portfolio` row below previously listed the Vercel
> URL. That deployment is behind Vercel single sign-on (a direct request returned
> `HTTP 302` to `vercel.com/sso-api`), so it is not publicly reachable and is no
> longer advertised. The systems-programming line also described the CAPS project
> as "documentation-only"; it is implemented and tested.

Updated 2026-09-16. The portfolio reads GitHub metadata live with a cached
fallback; this document records the current public-account boundary without
manufacturing social proof.

## Account summary

| Field | Current value |
|---|---|
| Username | `karkalashivareddy` |
| Display name | Karkala Shiva Reddy |
| Public repositories | 11 |
| Followers / following | 0 / 0 |
| Stars / forks | 0 / 0 |
| Profile README | Present in `karkalashivareddy/karkalashivareddy` |
| Portfolio source | https://github.com/karkalashivareddy/portfolio (no public deployment) |

## Public repository groups

- Industrial intelligence: `forgesense-industrial-intelligence`
- Algorithm laboratory: `KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer`
- Portfolio application: `portfolio`
- Database/full-stack coursework: PharmaStock and `hospital-bed-dashboard`
- Systems programming: `Creaters_Shell_OSSP`, and the implemented C11/POSIX
  process-execution observatory in `Command-Argument-Passing-System` (CAPS)
- Algorithms/coursework: `DSA2-Projects`, `university-time-table-generator`, and
  `FWD`
- Profile: `karkalashivareddy`

## Data rules

- GitHub stars, forks, followers, and contribution counts are shown exactly as
  GitHub reports them.
- Project claims come from repository source and are labeled academic,
  experimental, or portfolio scope where appropriate.
- Coding-profile figures are read live from the platform APIs via the Codolio
  profile rather than stored in this repository; they are not used as a substitute
  for project evidence.
- The GitHub API has a rate limit, so the site uses a short-lived cache and an
  offline snapshot when the upstream request is unavailable.
