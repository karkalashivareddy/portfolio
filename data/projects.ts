import type { Project } from "../lib/types";

export type { ProjectClass } from "../lib/types";

/**
 * Project order is deliberate and matches the GitHub profile: CAPS, ForgeSense,
 * LogInsight, PharmaStock. Those four are the flagship work; everything after
 * them is coursework kept for breadth.
 *
 * Every description here is written against the repository as it actually is.
 * In particular CAPS is a complete, tested C engine (not an abstract or a plan)
 * and PharmaStock ships a working Express/MongoDB backend (not a service layer
 * awaiting one). Both were previously described the other way round, which
 * understated the work and, for CAPS, described a repository that exists as
 * documentation-only.
 */
export const projects: Project[] = [
  {
    slug: "command-argument-passing-system",
    title: "CAPS — Command Argument Passing System",
    tagline: "Linux process execution and observability",
    type: "Backend/Systems",
    rank: "S",
    class: "flagship",
    featured: true,
    kind: "case-study",
    status: "academic",
    summary:
      "A C11/POSIX process execution observatory. An allowlisted command runs through a real fork/execvp/waitpid lifecycle in a compiled C engine; a Fastify gateway samples the tracked child from /proc, persists a validated event stream to SQLite, and a React console renders it live and in replay.",
    problem:
      "Command execution hides almost everything interesting. You see an exit code, but not whether exec succeeded, what argv the program actually received, whether the PID was still the same process, or what its RSS and CPU counters did during the run.",
    solution:
      "Structured argv is validated once and passed to the engine with shell: false, so there is no shell and no second lexer to disagree with the engine. Process identity is PID plus kernel start time at every layer, so a recycled PID cannot be mistaken for the original child.",
    stack: [
      "C11 / POSIX",
      "Linux /proc",
      "Fastify",
      "TypeScript",
      "SQLite",
      "Server-Sent Events",
      "React",
      "Vite",
    ],
    github: "https://github.com/karkalashivareddy/Command-Argument-Passing-System",
    statusNote:
      "Sampling follows one tracked child by design; descendants are not discovered. It is not a sandbox and not a production security boundary. Verified by 260 C assertions across 16 shell suites under gcc and again under ASan/UBSan, 450 gateway tests, 247 frontend tests, and a browser smoke suite against the production build.",
    accent: "#34d399",
    tags: ["C", "POSIX", "Systems", "Observability", "Security"],
  },
  {
    slug: "forgesense-industrial-intelligence",
    title: "ForgeSense Industrial Intelligence",
    tagline: "Synthetic industrial digital twin and operations platform",
    type: "Full-Stack",
    rank: "S",
    class: "flagship",
    featured: true,
    kind: "card",
    status: "published",
    summary:
      "A multi-service industrial operations platform. A telemetry simulator feeds a Spring Boot backend and a FastAPI/scikit-learn inference service, producing fleet state, anomaly and failure-risk assessments, alerts, maintenance workflows, scenario injection, and a Three.js digital twin.",
    problem:
      "Wiring telemetry ingestion, model inference, operational workflows, and an operator interface together is the actual engineering problem; the interesting part is doing it with data whose provenance is completely known.",
    solution:
      "Because every sample comes from a simulator in the same repository, each reported number is traceable to its generator. The README states the validity boundary plainly: held-out synthetic metrics do not establish real-world industrial predictive validity, and the system controls no physical equipment.",
    stack: [
      "Java / Spring Boot",
      "Python / FastAPI",
      "scikit-learn",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "STOMP / WebSocket",
      "Three.js",
      "Docker Compose",
    ],
    github: "https://github.com/karkalashivareddy/forgesense-industrial-intelligence",
    statusNote:
      "Telemetry is synthetic and the ML metrics (anomaly AUC 0.8859, failure-risk AUC 0.9978, RUL RMSE 27.18 steps) are held-out synthetic-data metrics regenerated from the committed simulator, not real-plant results. RUL is measured in simulator degradation steps, not hours. Verified by 61 backend, 98 frontend, and 8 ML tests.",
    accent: "#f5b759",
    tags: ["Java", "Python", "ML", "Kafka", "Docker"],
  },
  {
    slug: "loginsight-analyzer",
    title: "LogInsight Analyzer",
    tagline: "DSA-driven log analytics with algorithm traces",
    type: "Algorithms",
    rank: "A",
    class: "flagship",
    featured: true,
    kind: "card",
    status: "academic",
    summary:
      "A DSA-3 course platform that makes algorithm behaviour inspectable. Java/Spring Boot engines implement string search, dynamic programming, graph and flow, approximation, randomized, and parallel algorithms over a log dataset, with selected engines emitting step traces, plus incident detection, topology views, and replay in a React/TypeScript front end.",
    problem:
      "An algorithm that returns the right answer still teaches nothing on its own; you cannot see which structure it used or where the work happened.",
    solution:
      "Engines execute against real input data and the interesting ones record a trace, so the interface can replay the decision steps instead of only the result. The catalogue distinguishes entries that drive a product panel from those that are merely reachable engines.",
    stack: [
      "Java",
      "Spring Boot",
      "React",
      "TypeScript",
      "Vite",
      "Server-Sent Events",
      "JUnit",
    ],
    github: "https://github.com/karkalashivareddy/KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer",
    statusNote:
      "A 42-entry catalogue (36 reachable, 35 dispatch keys, 13 trace-instrumented) whose published counts are pinned by a test. Dataset replay and the generated simulation are separate paths, and neither ingests external live telemetry. State is in-memory. Verified by 878 backend tests and 55 frontend tests.",
    accent: "#a78bfa",
    tags: ["Java", "DSA", "Algorithms", "Spring Boot"],
  },
  {
    slug: "pharmastock-medicine-stock-management",
    title: "PharmaStock — Medicine Stock Management",
    tagline: "Batch-aware inventory with replica-set transactions",
    type: "Full-Stack",
    rank: "A",
    class: "flagship",
    featured: true,
    kind: "case-study",
    status: "academic",
    summary:
      "A medicine inventory system whose stock movements are transactional. The Express/Mongoose API writes stock changes inside MongoDB replica-set transactions, allocates sales by FEFO across batches, enforces role checks server-side, and records an audit trail; a React/Vite client provides inventory, purchasing, sales, expiry, and reporting workflows.",
    problem:
      "Stock can change from a purchase, a sale, a refund, or an adjustment. If those writes are not transactional, batch quantities and the ledger can disagree, and an audit trail built from the same inconsistent state is worthless.",
    solution:
      "Every stock mutation runs in a transaction with a rollback path that is tested by injecting a failure mid-operation, and the suite asserts that a rejected write leaves no inventory change and no audit row.",
    stack: [
      "React",
      "Vite",
      "Node.js",
      "Express",
      "MongoDB / Mongoose",
      "JWT / RBAC",
    ],
    github: "https://github.com/karkalashivareddy/DataBase-System-and-Distributed-Backend-Development",
    statusNote:
      "Academic course project (Database Systems and Distributed Backend). The backend is implemented and tested, not a placeholder awaiting one; it is a local system with no deployment and no production users. Verified by 25 backend tests including replica-set transaction and rollback suites, plus a 24-check browser E2E suite.",
    accent: "#5b8def",
    tags: ["React", "MongoDB", "Transactions", "RBAC"],
  },
  {
    slug: "hospital-bed-management-system",
    title: "Hospital Bed Management System",
    tagline:
      "Full-stack bed availability & occupancy tracker over Express and MySQL.",
    type: "Full-Stack",
    rank: "B",
    class: "supporting",
    featured: false,
    kind: "card",
    status: "academic",
    summary:
      "RESTful bed management API (MySQL) with two clients: a vanilla HTML/CSS/JS dashboard and a React app with bed cards and filtering.",
    problem:
      "Hospitals waste time tracking bed status manually; staff need a live availability view.",
    solution:
      "A CRUD API (GET/POST/PUT/DELETE /api/beds) over indexed MySQL tables, with a simple responsive UI.",
    stack: [
      "Node.js",
      "Express",
      "MySQL",
      "React",
      "HTML/CSS/JS",
      "REST",
    ],
    github: "https://github.com/karkalashivareddy/hospital-bed-dashboard",
    tags: ["Node.js", "Express", "MySQL", "React", "REST"],
  },
  {
    slug: "dsa2-java-projects",
    title: "DSA-2 Projects — Java",
    tagline:
      "AVL insertion, a warehouse price-range scan, and Prim's minimum spanning tree in Java.",
    type: "Algorithms",
    rank: "B",
    class: "supporting",
    featured: false,
    kind: "card",
    status: "academic",
    summary:
      "Three console exercises: AVL insertion with rotations, a warehouse range query over ArrayList data, and Prim's algorithm over an adjacency matrix.",
    problem:
      "Practice balanced-tree updates, range filtering, and minimum-spanning-tree construction.",
    solution:
      "Each module keeps its data model and traversal logic small enough to compile and run independently.",
    stack: ["Java", "AVL Tree", "ArrayList range scan", "Prim's MST"],
    github: "https://github.com/karkalashivareddy/DSA2-Projects",
    tags: ["Java", "DSA", "Trees", "Graphs"],
  },
  {
    slug: "fwd-coursework",
    title: "FWD — Frontend Web Development coursework",
    tagline: "HTML, CSS, JavaScript and Java coursework collected as small, traceable builds.",
    type: "Academic",
    rank: "C",
    class: "supporting",
    featured: false,
    kind: "card",
    status: "academic",
    summary: "A coursework repository containing frontend labs and Java exercises from the Frontend Web Development track.",
    problem: "Practice the fundamentals of browser interfaces and small programming exercises.",
    solution: "A set of focused labs that make the learning progression visible instead of presenting one inflated product claim.",
    stack: ["HTML", "CSS", "JavaScript", "Java"],
    github: "https://github.com/karkalashivareddy/FWD",
    statusNote: "Coursework repository — scope kept intentionally clear.",
    accent: "#f5b759",
    tags: ["HTML", "CSS", "JavaScript", "Coursework"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const secondaryProjects = projects.filter((p) => !p.featured);

export const CLASS_META: Record<
  import("../lib/types").ProjectClass,
  { label: string; color: string; description: string }
> = {
  flagship: {
    label: "FLAGSHIP",
    color: "#f5b759",
    description: "Best build — deepest engineering, strongest story, full case study.",
  },
  strong: {
    label: "STRONG",
    color: "#5b8def",
    description: "Systems work with real architecture and detailed case studies.",
  },
  supporting: {
    label: "SUPPORTING",
    color: "#a9b0bb",
    description: "Honest scope — proves breadth and coursework depth.",
  },
  experimental: {
    label: "EXPERIMENTAL",
    color: "#c084fc",
    description: "Exploration — clearly labeled, no claims made.",
  },
  archived: {
    label: "ARCHIVED",
    color: "#6b7280",
    description: "Kept for history, no longer maintained.",
  },
};

// Repositories kept as a secondary list. The four flagship projects above are
// deliberately absent: ForgeSense and LogInsight used to appear here with a
// one-line note, which buried two of the strongest repositories in the footer
// of the data file rather than presenting them as first-class work.
export const additionalProjects = [
  {
    name: "Creaters_Shell_OSSP",
    scope: "COURSEWORK",
    language: "C / Linux",
    note: "Operating Systems and System Programming coursework: a mini shell plus process, signal, IPC, and file exercises. A collection of exercises, not a production shell.",
    url: "https://github.com/karkalashivareddy/Creaters_Shell_OSSP",
  },
  {
    name: "university-time-table-generator",
    scope: "SCRIPT",
    language: "Python",
    note: "Academic timetable generator with conflict checks and an optional validator. It is a heuristic generator, not an optimal solver.",
    url: "https://github.com/karkalashivareddy/university-time-table-generator",
  },
] as const;
