# Repository Audit — karkalashivareddy

> **Superseded in part, 2026-10-06.** Two entries below were stale when written and
> are corrected here rather than deleted, so the record of what was believed and
> when stays visible.
>
> * **CAPS (Command Argument Passing System) is fully implemented.** It was
>   described here as a "documentation-only" abstract. It is a C11/POSIX process
>   execution observatory: a compiled engine runs fork/execvp/waitpid, a Fastify
>   gateway samples the tracked child from `/proc`, and a React console renders
>   the persisted event stream. Verified by 260 C assertions under gcc and again
>   under ASan/UBSan, 450 gateway tests, 247 frontend tests, a browser smoke
>   suite, and 12 CI jobs. It samples one tracked child and does not discover
>   descendants; it is not a sandbox.
> * **PharmaStock's backend is implemented and tested**, not a "future Express/Mongo
>   backend" boundary. It uses MongoDB replica-set transactions, FEFO allocation,
>   and server-side RBAC, covered by 25 backend tests including rollback suites
>   and a 24-check browser E2E suite.
>
> The corrections below have been applied to the text as well, so this document
> reads correctly on its own.

The live portfolio is limited to projects with traceable repositories or clearly labeled academic scope.

## PharmaStock — Medicine Stock Management

React/Vite client with an Express/Mongoose API. Medicine, supplier and batch management, purchase, sales, refund and adjustment records, role-based access, expiry/low-stock monitoring and Recharts analytics. Stock movements run inside MongoDB replica-set transactions, sales allocate by FEFO, and the audit trail is written in the same transaction. Academic course project; local only, with demo authentication and no deployment.

## ForgeSense Industrial Intelligence

Spring Boot and FastAPI industrial-operations platform with a digital twin,
synthetic telemetry, Kafka/Redis/PostgreSQL, STOMP/WebSocket transport, and
scikit-learn assessments. The repository documents its synthetic-data boundary
explicitly: the reported metrics are held-out synthetic-data metrics and do not
establish real-world industrial predictive validity.

## LogInsight Analyzer

Full-stack Java/React algorithm laboratory with executable string, dynamic-
programming, graph/flow, approximation, randomized, and parallel engines,
trace playback, benchmarks, and 878 backend plus 55 frontend tests. Runtime data
is in memory.

## Command Argument Passing System

A C11/POSIX process execution observatory (CAPS). A compiled engine executes an
allowlisted command through the real fork/execvp/waitpid lifecycle with no shell
and no second lexer; the gateway samples `/proc` for the tracked child, validates
and persists the event stream to SQLite, and streams it to a React console over
SSE with read-only replay. Process identity is PID plus kernel start time.

## Hospital Bed Management System

Express + MySQL REST API with React and vanilla clients, bed availability and occupancy views, and indexed relational tables. Academic scope; kept as a supporting full-stack project.

## DSA-2 Projects

Java console exercises covering AVL insertion with rotations, an ArrayList-based
warehouse price-range scan, and Prim's minimum spanning tree over an adjacency
matrix.

## FWD

Frontend Web Development coursework with HTML/CSS/JavaScript labs and Java exercises. Included with an explicit coursework label rather than presented as a product.

## De-prioritized repositories

The timetable generator remains a script and the mixed OSSP repository is a
coursework collection. LogInsight is treated as a public algorithm laboratory
rather than an empty scaffold.

## Audit rule

Every project claim on the site must be traceable to repository contents, the public coding profile, or a labeled academic source. No production deployment, user count, client, award, or fabricated metric is inferred.
