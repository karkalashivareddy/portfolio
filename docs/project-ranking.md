# Project Ranking & Flagship Selection

The portfolio prioritizes honest, public engineering work over inflated project count.

## Flagship / full case studies

Ordered to match the GitHub profile and `data/projects.ts`.

1. **CAPS — Command Argument Passing System**
   - C11/POSIX process execution observatory: a compiled engine runs fork/execvp/waitpid against a verified absolute path, a Fastify gateway samples the tracked child from `/proc`, and a React console renders the persisted event stream live and in replay.
   - Status: academic course project, fully implemented. Verified by 260 C assertions across 16 shell suites under gcc and again under ASan/UBSan, 450 gateway tests, 247 frontend tests, a browser smoke suite, and 12 CI jobs. Boundaries: samples one tracked child and does not discover descendants; not a sandbox; loopback security boundary only.
2. **ForgeSense Industrial Intelligence**
   - Spring Boot + FastAPI/scikit-learn industrial operations platform with synthetic telemetry, digital-twin state, Kafka eventing, STOMP/WebSocket transport, and ML assessments.
   - Status: published multi-service project with explicit synthetic-data limits. Verified by 61 backend, 98 frontend, and 8 ML tests. Boundaries: telemetry is simulator-generated, metrics are held-out synthetic-data metrics, and RUL is in degradation steps rather than hours.
3. **LogInsight Analyzer**
   - Full-stack algorithm laboratory with executable string, dynamic-programming, graph/flow, approximation, randomized, and parallel engines plus trace playback.
   - Status: academic (DSA-3) project; runtime data is in memory. Verified by 878 backend tests and 55 frontend tests. Boundaries: dataset replay and generated simulation are separate paths and neither is external live telemetry.
4. **PharmaStock — Medicine Stock Management**
   - Express/Mongoose inventory API using MongoDB replica-set transactions, FEFO sale allocation, server-side RBAC, and an audit trail, with a React/Vite client for inventory, purchasing, sales, expiry, and reporting.
   - Status: academic course project, backend implemented and tested. Verified by 25 backend tests including rollback suites, plus a 24-check browser E2E suite. Boundaries: demo authentication, local only, no deployment and no production users; transactions require a replica set.

## Case studies vs cards

Two of the four flagship projects carry a full case study (`CAPS`, `PharmaStock`) and two are cards
(`ForgeSense`, `LogInsight`). A card is not a lesser claim: it carries the same verified figures and the
same stated boundary, in less depth. The split is presentational, not a ranking of worth.

## Supporting projects

| Project | Scope | Stack |
|---|---|---|
| Hospital Bed Management System | CRUD bed availability and occupancy tracker | Node, Express, MySQL, React |
| DSA-2 Projects | AVL insertion, range scan and Prim's MST | Java |
| FWD | Frontend Web Development coursework | HTML, CSS, JavaScript, Java |

## De-prioritized repositories

- `university-time-table-generator` — kept as a concise heuristic scheduling script.
- `Creaters_Shell_OSSP` — systems coursework collection with the published mini-shell, process, signal, `/proc`, FIFO, and file-descriptor exercises.

Case-study labels stay tied to the actual repository and current publication status. No demo, metric, client, or production claim is implied without evidence.
