import type { SkillCategory } from "../lib/types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    note: "Java and C are the primary working languages",
    color: "#7aa2ff",
    items: [
      { name: "Java", note: "DSA engines, Spring Boot services" },
      { name: "C", note: "CAPS process engine, POSIX exercises" },
      { name: "TypeScript", note: "Typed gateways and React apps" },
      { name: "JavaScript", note: "Express API, client code" },
      { name: "Python", note: "FastAPI ML service, simulators, tooling" },
      { name: "SQL", note: "MongoDB aggregation, MySQL schemas" },
    ],
  },
  {
    title: "Frontend",
    note: "React front ends, including the CAPS observatory console and this portfolio",
    color: "#22d3ee",
    items: [
      { name: "React", note: "Observatory console, operations console, inventory portal" },
      { name: "Vite", note: "Build tooling across three projects" },
      { name: "Next.js", note: "This portfolio" },
      { name: "Recharts", note: "Inventory analytics dashboards" },
      { name: "Tailwind CSS", note: "Design systems" },
      { name: "Three.js", note: "ForgeSense digital twin" },
    ],
  },
  {
    title: "Backend & Systems",
    note: "Services, event transport, and POSIX systems work",
    color: "#34d399",
    items: [
      { name: "Spring Boot", note: "ForgeSense API and LogInsight engines" },
      { name: "Node.js / Express", note: "PharmaStock API with role checks" },
      { name: "Fastify", note: "CAPS gateway" },
      { name: "FastAPI", note: "ForgeSense ML inference service" },
      { name: "REST API design", note: "Versioned routes, Zod validation" },
      { name: "Server-Sent Events", note: "CAPS event stream, LogInsight traces" },
      { name: "STOMP / WebSocket", note: "ForgeSense authenticated telemetry stream" },
      { name: "Linux / POSIX", note: "fork, execvp, waitpid, signals, /proc" },
    ],
  },
  {
    title: "Data & messaging",
    note: "Stores chosen per problem, not by default",
    color: "#38bdf8",
    items: [
      { name: "MongoDB / Mongoose", note: "Replica-set transactions, FEFO allocation" },
      { name: "PostgreSQL", note: "ForgeSense operational store" },
      { name: "Redis", note: "Cache and session layer" },
      { name: "Kafka", note: "Telemetry event flow" },
      { name: "SQLite", note: "CAPS canonical event store" },
      { name: "MySQL", note: "Hospital bed dashboard schema" },
      { name: "scikit-learn", note: "Anomaly scoring, failure risk, RUL" },
    ],
  },
  {
    title: "Testing & delivery",
    note: "Each project gates itself in CI",
    color: "#22c3ee",
    items: [
      { name: "JUnit / Maven verify", note: "LogInsight backend suite" },
      { name: "Vitest / Testing Library", note: "CAPS gateway and console suites" },
      { name: "Node test runner", note: "PharmaStock backend suite" },
      { name: "pytest", note: "ForgeSense ML suite" },
      { name: "Playwright", note: "Browser E2E for PharmaStock and ForgeSense" },
      { name: "ASan / UBSan", note: "CAPS C suites under sanitizers" },
      { name: "Docker Compose", note: "Service topology for ForgeSense" },
      { name: "GitHub Actions / CodeQL", note: "CI, dependency audit, static analysis" },
    ],
  },
  {
    title: "Tools",
    note: "The daily toolchain behind every commit",
    color: "#f5b759",
    items: [
      { name: "Git / GitHub", note: "Versioning, review, CI" },
      { name: "VS Code", note: "Primary editor" },
      { name: "Postman", note: "API testing" },
      { name: "MongoDB Compass", note: "Database tooling" },
      { name: "npm / Maven", note: "Package and build management" },
    ],
  },
  {
    title: "Currently learning",
    note: "Genuinely in progress, not yet used in a project",
    color: "#ff7a6b",
    items: [
      { name: "Distributed systems", note: "Consistency, replication, failure modes" },
      { name: "System design", note: "Scaling patterns and capacity thinking" },
      { name: "Cloud", note: "Deployment fundamentals" },
    ],
  },
];

/**
 * Backing-signal note for the Coding section.
 *
 * It deliberately names no totals. The counts live on the Codolio profile, which
 * reads them from the platform APIs; a number copied into a data module is a
 * number that silently goes stale, and this repository previously held four
 * different CodeChef ratings and two different problem totals for the same
 * account.
 */
export const codingSkillsNote =
  "Per-platform problem counts, contest ratings, and streaks are read live from the platform APIs on my Codolio profile rather than copied here, so the figures shown are current instead of frozen at a past snapshot.";
