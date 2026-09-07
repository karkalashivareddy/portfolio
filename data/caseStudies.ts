import type { CaseStudy } from "../lib/types";

export const caseStudies: Record<string, CaseStudy> = {
  "pharmastock-medicine-stock-management": {
    slug: "pharmastock-medicine-stock-management",
    overview: [
      "PharmaStock is a pharmaceutical inventory portal built for a Database Systems & Distributed Backend course at KL University (with Paripalli Navadeep). It centralizes medicine, supplier, batch, purchase and sales data into a dashboard that surfaces low-stock, near-expiry and sales analytics.",
      "Engineering-wise the notable decision is the service layer: every data function is async and returns promises with simulated latency, so the UI gets real loading/empty/error states today and can be pointed at a real Express + MongoDB backend later without touching components.",
    ],
    architecture: `React SPA (17 pages, RBAC)
  │
service layer (data/api.js)
  ├── today: demo-data adapters (src/data/*) with latency simulation
  └── contract: VITE_API_URL pointing at Express + Mongo (JWT + bcrypt)
  │
analytics (Recharts) · alerts (expiry / low stock) · three.js accents`,
    stack: [
      { category: "Frontend", items: ["React 18", "Vite", "Recharts", "lucide-react", "react-router-dom", "CSS3"] },
      { category: "Data layer", items: ["Adapter + demo data", "REST contract", "Debounced search", "validators"] },
      { category: "Target backend", items: ["Node.js", "Express", "MongoDB / Mongoose", "JWT", "bcrypt"] },
    ],
    features: [
      "Medicine, supplier, batch and transaction management",
      "Batch-wise stock tracking with purchase/sales recording",
      "Low-stock identification + near-expiry monitoring",
      "Role-based access (admin / manager / pharmacist-style flows)",
      "Analytics dashboard (KPIs, sales trend, category donut, stock health)",
      "Common UI kit: search, pagination, filters, empty/loading states, toasts, confirm dialogs",
      "Settings + theme context and persistence hooks",
    ],
    engineeringDecisions: [
      "Built the frontend against a data-adapter contract rather than wiring components to a specific backend — the API can be swapped in without UI changes.",
      "Simulated latency so loading/empty/error states are real, tested UX — not afterthoughts.",
      "Separated common UI primitives (Button/Modal/Toast/EmptyState) from feature components for consistent product design.",
      "Analytics computed from derived data (stock health, expiry timeline) rather than hardcoded numbers.",
    ],
    challenges: [
      "Modeling expiry and batch stock without production backend constraints — encoded in the data layer contracts.",
      "Keeping a 17-page app coherent under one design-token system (CSS variables, responsive breakpoints).",
    ],
    tradeoffs: [
      "Demo-data-first means no real multi-user safety yet; auth is a documented contract ready for the JWT backend.",
    ],
    lessons: [
      "Service-layer contracts are the cheapest way to defer a backend without blocking product work.",
      "Designing RBAC and analytics up front forced a cleaner domain model (batches, transactions, expiry).",
    ],
    status: "academic",
    related: ["hospital-bed-management-system"],
  },

  "command-argument-passing-system": {
    slug: "command-argument-passing-system",
    overview: [
      "Systems coursework from the Operating Systems & System Programming course. The core program is a C REPL that forks a child, hands it the user's command plus arguments, executes it, and reports the exit status — demonstrating the full process lifecycle.",
      "Companion work deepens the topic: a mini-shell with raw terminal input and signal handling, a fork/exec demo pair, and /proc/<pid>/stat|status readers that show live process state.",
    ],
    architecture: `parent (REPL)
   │  parse argv
   ├─ fork()
   ├─ child: execvp(cmd, argv)   ── or _exit(127)
   └─ parent: waitpid() → WIFEXITED / WIFSIGNALED

mini-shell
   ├─ raw terminal (termios: ICANON/ECHO off)
   ├─ built-ins (pwd, echo, clear, exit) + external cmd via fork+exec
   └─ SIGINT/SIGTERM handler → restore terminal, clean exit`,
    stack: [
      { category: "Language", items: ["C"] },
      { category: "OS / POSIX", items: ["fork()", "execvp()", "waitpid()", "exit()"] },
      { category: "Inspection", items: ["/proc/<pid>/stat", "/proc/<pid>/status"] },
      { category: "Terminal", items: ["termios", "signals", "Makefile"] },
    ],
    features: [
      "Command + argument parsing with tokenization",
      "Child process creation and argv transfer to the new program",
      "Program execution via execvp with graceful command-not-found handling",
      "Parent/child synchronization via waitpid with exit/signal reporting",
      "Mini-shell: raw keyboard input, backspace handling, built-in commands",
      "Process state reporting from /proc (PID, state, PPID, name)",
    ],
    engineeringDecisions: [
      "Used waitpid over wait to get precise per-child exit/signal reporting.",
      "argc errors surfaced via stderr with strerror(errno) — not silent failures.",
      "Terminal restored on every exit path in the mini-shell (signal + normal) to avoid corrupting the user's TTY.",
    ],
    challenges: [
      "Getting raw-mode input handling right (termios, SIGINT) without leaving the terminal broken.",
      "Parsing /proc field positions correctly (pid, comm with parentheses = quoting trap).",
    ],
    tradeoffs: [
      "Single-command sequential execution by design — the point is lifecycle clarity, not a full shell.",
    ],
    lessons: [
      "Processes are cheap to create but synchronization and error propagation decide correctness.",
      "Writing small systems tooling (even a mini-shell) is the fastest way to read system calls with confidence.",
    ],
    status: "publishing-soon",
    related: ["pharmastock-medicine-stock-management"],
  },
};