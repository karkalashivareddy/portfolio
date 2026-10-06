import type { CaseStudy } from "../lib/types";

export const caseStudies: Record<string, CaseStudy> = {
  "pharmastock-medicine-stock-management": {
    slug: "pharmastock-medicine-stock-management",
    overview: [
      "PharmaStock is a pharmaceutical inventory portal built for a Database Systems & Distributed Backend course at KL University (with Paripalli Navadeep). It centralizes medicine, supplier, batch, purchase and sales data into a dashboard that surfaces low-stock, near-expiry and sales analytics.",
      "The engineering centre of the project is that stock can change from a purchase, a sale, a refund, or an adjustment. Each of those runs inside a MongoDB replica-set transaction, and the rollback path is tested by injecting a failure mid-operation rather than asserted on paper.",
    ],
    architecture: `React/Vite client (17 pages, role-gated)
  │  Bearer JWT
  ▼
Express API — validation, server-side RBAC
  │
  ▼
services → Mongoose → MongoDB replica set
  ├── purchase / sale / refund / adjustment  (transactions)
  ├── FEFO batch allocation on sale
  └── audit log written inside the same transaction
  │
  ▼
analytics · reports · alerts (expiry / low stock)`,
    stack: [
      { category: "Frontend", items: ["React 18", "Vite", "Recharts", "lucide-react", "react-router-dom", "CSS3"] },
      { category: "API", items: ["Node.js", "Express", "JWT auth", "server-side role checks"] },
      { category: "Data", items: ["MongoDB replica set", "Mongoose sessions", "transactions", "FEFO allocation", "audit trail"] },
    ],
    features: [
      "Medicine, supplier, batch and transaction management",
      "Stock movements inside MongoDB replica-set transactions, with a verified rollback path",
      "FEFO sale allocation across batches, with expiry-aware refusal of expired stock",
      "Refunds that return units to the batches they were originally allocated from",
      "Low-stock identification + near-expiry monitoring",
      "Role-based access enforced at the API, not only in the UI",
      "Analytics dashboard (KPIs, sales trend, category donut, stock health)",
      "Common UI kit: search, pagination, filters, empty/loading states, toasts, confirm dialogs",
    ],
    engineeringDecisions: [
      "Direct batch quantity and cost writes are refused over HTTP, so quantity can only change through a ledger operation and the audit trail has a single origin.",
      "A batch cannot be reassigned away from its recorded ledger, which keeps historical allocation explainable after a refund.",
      "Role checks live in the API. Hiding a control in the client is not authorization.",
    ],
    challenges: [
      "Proving a rollback actually rolls back. The suite injects a failure after a batch mutation and asserts that neither the sale nor the inventory change survives, and that no audit row is written.",
      "A suite-parallelism race that was real: an audit-count assertion originally compared counts across the whole database and was disturbed by a sibling suite. It is now scoped to its own request signature.",
    ],
    tradeoffs: [
      "Demo authentication and local storage; it is a course project with no deployment and no production users.",
      "Transactions require a MongoDB replica set, so the project cannot run against a standalone mongod.",
    ],
    lessons: [
      "An audit log is only worth something if it is written in the same transaction as the change it describes.",
      "FEFO is a small rule with a large blast radius; encoding it once in the allocation path is cheaper than checking expiry at every call site.",
    ],
    status: "academic",
    related: ["hospital-bed-management-system"],
  },

  "command-argument-passing-system": {
    slug: "command-argument-passing-system",
    overview: [
      "CAPS is a Linux process execution observatory built for an Operating Systems & System Programming course. An allowlisted command runs through a real C11/POSIX lifecycle — fork, execvp, waitpid — in a compiled engine, and the resulting evidence is recorded so it can be inspected later.",
      "The interesting constraint is that the gateway never touches a shell and never re-implements the engine's lexer. Command and arguments travel as a structured argv array to an absolute path the gateway has already verified, so there is exactly one parser and it is the engine's.",
    ],
    architecture: `browser (React)
  │  POST /api/sessions  {command, args[]}
  ▼
Fastify gateway — allowlist, argv validation, workspace policy
  │  spawn(shell:false)  argv[0] = verified absolute path
  ▼
caps engine (C11/POSIX)
  ├── parser.c      argv + redirection, one lexer for the whole system
  ├── process.c     fork() → execvp() → waitpid()
  └── monitor.c     one JSON object per line on stderr
  │
  ▼  /proc/<pid>/{stat,status,io} sampled by the gateway
SQLite event store ──► validateEventStream (14 invariants) ──► SSE ──► React`,
    stack: [
      { category: "Engine", items: ["C11", "POSIX fork/execvp/waitpid", "sigaction", "openat + O_NOFOLLOW", "Linux /proc"] },
      { category: "Gateway", items: ["Node.js", "TypeScript", "Fastify", "Zod", "node:sqlite"] },
      { category: "Transport", items: ["REST", "Server-Sent Events", "event replay"] },
      { category: "Frontend", items: ["React", "TypeScript", "Vite", "2D graph + 3D Process Space"] },
    ],
    features: [
      "Real process execution through a compiled C engine, not a simulation of one",
      "Structured argv end to end: no shell, no globbing, no interpolation",
      "Process identity from PID plus kernel start time at every layer, so a recycled PID cannot be mistaken for the original child",
      "Every displayed metric classified OBSERVED, DERIVED, or UNAVAILABLE with the reason, so a missing value is never rendered as a zero",
      "Fourteen checked event-stream invariants enforced on replay, export, and the Markdown report",
      "Race-free SSE that replays from a persisted sequence on reconnect",
      "Flight-recorder replay that is reconstruction, not re-execution: it never forks, execs, or writes",
      "Bounded first-party workload laboratory used by the test suite",
    ],
    engineeringDecisions: [
      "Only the C engine parses a command line. The browser and the gateway both call it, because two lexers always eventually disagree about one quoting case, and always in the unsafe direction.",
      "Executable allowlist resolves once to a verified absolute path, so execvp cannot re-resolve a name against PATH behind the gateway's back.",
      "Redirection targets are re-verified at the moment of open with O_NOFOLLOW plus a regular-file check, closing the symlink-swap window between validation and open.",
      "Refusing to kill is treated as the safe failure: an un-killed workload leaks a process, a wrong kill destroys an unrelated one.",
    ],
    challenges: [
      "Making a sampling race impossible to observe — an early version asserted that live kernel counters hold still, which passed on an idle machine and failed under load.",
      "Distinguishing observed from derived from unavailable values so the UI cannot quietly show a fabricated zero.",
      "Keeping the event stream canonical: one store, contiguous sequence, checked invariants, and no path that can publish an event replay would not return.",
    ],
    tradeoffs: [
      "Sampling follows the one child CAPS reported. Its own descendants are not discovered, sampled, or drawn, so it is not a process-tree monitor.",
      "A confined workspace is not a privilege boundary: there are no namespaces, seccomp, or cgroups, and the gateway refuses to bind to a non-loopback address unless remote mode is explicitly enabled with a token.",
      "There is no pixel-diff suite. The browser tests assert behaviour rather than pixels, and the README says so instead of implying visual coverage.",
    ],
    lessons: [
      "Identity is not a PID. Pairing the PID with the kernel start time is what makes signal delivery and telemetry safe against PID reuse.",
      "A measurement you did not take should be UNVAILABLE with a reason, not a zero. That one rule removes most of the ways an observability tool lies.",
      "Tests that depend on host load will fail in CI. Measuring a delta over an interval, or asserting a static bound, is the difference between a check and a coin flip.",
    ],
    status: "academic",
    related: ["forgesense-industrial-intelligence", "loginsight-analyzer"],
  },
};
