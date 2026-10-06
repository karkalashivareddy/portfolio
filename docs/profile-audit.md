# Profile Audit — Karkala Shiva Reddy

> **Corrected 2026-10-06.** Two evidence boundaries below were wrong when written:
> CAPS was described as documentation-only and PharmaStock's backend as
> unimplemented. Both are implemented and tested; the corrected text is in place,
> and this note records what changed and why.
>
> Also: the `Portfolio` row previously listed the Vercel URL. That deployment is
> behind Vercel single sign-on (a direct request on 2026-10-06 returned
> `HTTP 302` to `vercel.com/sso-api`), so it is not publicly reachable and is no
> longer advertised as a live site.

Updated 2026-09-16. This is a public-facing profile audit. It intentionally
omits academic roll numbers, teammate identifiers, and other administrative
details that do not help a technical visitor evaluate the work.

## Identity

| Field | Current value |
|---|---|
| Name | Karkala Shiva Reddy |
| Preferred display | Shiva Reddy |
| Role | B.Tech Computer Science Engineering student |
| University | Koneru Lakshmaiah Education Foundation / KL University |
| Expected graduation | 2029 |
| Location | India |
| GitHub | `karkalashivareddy` |
| Portfolio source | https://github.com/karkalashivareddy/portfolio (no public deployment) |

## Public repositories

The account currently owns 11 public repositories: 10 engineering/coursework
repositories plus the profile README repository. The strongest engineering
signals are ForgeSense, LogInsight Analyzer, Portfolio, PharmaStock, Hospital
Bed Dashboard, the OSSP collection, and DSA2 Projects.

Repository descriptions and topics are maintained through GitHub metadata. The
profile pins a complementary set covering industrial intelligence, algorithms,
full-stack work, databases, and systems programming.

## Evidence boundaries

- ForgeSense uses synthetic telemetry and scikit-learn assessment paths; it is
  not presented as a production industrial deployment, and its reported metrics
  are labeled as held-out synthetic-data metrics.
- LogInsight is an executable algorithm laboratory with in-memory runtime data;
  it is not presented as a production log platform.
- PharmaStock ships an implemented Express/Mongoose API using MongoDB
  replica-set transactions, with server-side RBAC and an audit trail. It is
  presented as a local course project with demo authentication, not as a
  deployed pharmacy system.
- CAPS is an implemented C11/POSIX process execution observatory. It is
  presented as sampling one tracked child, with no descendant discovery, and not
  as a sandbox or a production security boundary. The OSSP repository contains
  the published C systems exercises.
- Coding-profile figures are not reproduced as static numbers; the site points at
  the Codolio profile, which reads them from the platform APIs.
- No stars, users, traffic, benchmark, accuracy, or production metrics are
  claimed without a current source.

## Maintenance rule

Project claims should be traceable to the repository source, tests, GitHub
metadata, or a clearly labeled academic source. When implementation and plans
diverge, the public profile should describe the implementation and label plans
as future work.
