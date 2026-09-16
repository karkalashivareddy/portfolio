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
analytics (Recharts) · alerts (expiry / low stock) · CSS-animated accents`,
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
      "This repository currently contains the project abstract for a planned Operating Systems & System Programming utility. It documents a fork/exec/wait design for passing command arguments from a parent process to a child.",
      "The implementation source, build files, and executable are not currently published in this repository, so the design is intentionally presented as planned work rather than a completed systems project.",
    ],
    architecture: `planned design
   │
   ├─ parent parses a command and argv
   ├─ fork() creates a child process
   ├─ child calls an exec-family function
   └─ parent waits and reports the child status`,
    stack: [
      { category: "Planned language", items: ["C"] },
      { category: "OS / POSIX concepts", items: ["fork()", "exec()", "wait()"] },
    ],
    features: [
      "Project abstract and problem statement",
      "Planned command and argument transfer design",
      "Planned child-process creation and synchronization flow",
    ],
    engineeringDecisions: [
      "The documented design separates parsing, child execution, and parent synchronization so each process responsibility is explicit.",
      "Implementation details are left unclaimed until source code is published.",
    ],
    challenges: [
      "Turning the abstract into a reproducible C/Linux implementation with build and run instructions.",
    ],
    tradeoffs: [
      "The repository is currently documentation-only, so runtime behavior and error handling remain unverified.",
    ],
    lessons: [
      "A clear process-lifecycle design is a useful starting point, but the implementation must exist before runtime claims are made.",
    ],
    status: "academic",
    related: ["pharmastock-medicine-stock-management"],
  },
};
