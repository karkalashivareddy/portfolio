import type { Project } from "../lib/types";

export type { ProjectClass } from "../lib/types";

export const projects: Project[] = [
  {
    slug: "pharmastock-medicine-stock-management",
    title: "PharmaStock — Medicine Stock Management",
    tagline:
      "Pharmaceutical inventory with batch tracking, expiry/low-stock intelligence and analytics.",
    type: "Product/Frontend",
    rank: "S",
    class: "flagship",
    featured: true,
    kind: "case-study",
    status: "academic",
    summary:
      "A 17-page React portal for pharmaceutical inventory: medicine/supplier/batch management, purchase & sales records, role-based access, near-expiry and low-stock monitoring, and a Recharts analytics dashboard — built on a service layer engineered to swap demo data for a real Express/Mongo backend.",
    problem:
      "Pharmacy staff need live visibility of stock, expiring batches and low-stock items to avoid shortages and wasted medicines.",
    solution:
      "A centralized inventory product with batch-wise tracking, transactional records, role-based dashboards and analytics.",
    stack: [
      "React",
      "Vite",
      "Recharts",
      "lucide-react",
      "react-router-dom",
      "CSS3",
      "Node.js",
      "Express",
      "MongoDB / Mongoose",
      "JWT",
    ],
    github:
      "https://github.com/karkalashivareddy/DataBase-System-and-Distributed-Backend-Development",
    statusNote:
      "Academic project (Database Systems & Distributed Backend course). Frontend ships runnable on demo data; the API service layer is ready for the Express/Mongo backend.",
    accent: "#5b8def",
    tags: ["React", "Vite", "Recharts", "Full-stack", "Databases"],
  },
  {
    slug: "command-argument-passing-system",
    title: "Command Argument Passing System",
    tagline:
      "C-level exploration of process creation, argument passing and Linux process states.",
    type: "Backend/Systems",
    rank: "A",
    class: "strong",
    featured: true,
    kind: "case-study",
    status: "publishing-soon",
    summary:
      "A Linux/UNIX command-line project demonstrating fork, execvp, wait and argv transfer, plus a mini-shell in raw terminal mode and /proc-based process state inspection.",
    problem:
      "How does a parent process hand a command plus its arguments to a new child process, run it, and synchronize?",
    solution:
      "A REPL that parses input, forks children, transfers argv, executes via execvp, reports exit status, and — in companion work — reads live process state from /proc and handles raw terminal input.",
    stack: [
      "C",
      "Linux / POSIX",
      "fork / execvp / waitpid",
      "/proc filesystem",
      "signals",
      "termios",
    ],
    github:
      "https://github.com/karkalashivareddy/Command-Argument-Passing-System",
    statusNote:
      "Source + screenshots being published to the repo (docs are up). Systems coursework from KL University — Operating Systems & System Programming.",
    accent: "#34d399",
    tags: ["C", "Linux", "OS", "Processes", "Signals"],
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
      "AVL tree, B+ tree and graph/MST implementations in my primary language.",
    type: "Algorithms",
    rank: "B",
    class: "supporting",
    featured: false,
    kind: "card",
    status: "academic",
    summary:
      "Three Java projects: an AVL-based library system, a B+ tree warehouse index, and graph traversal + minimum spanning tree traffic optimization.",
    problem:
      "Show how balanced trees and graph algorithms solve realistic indexing, range-query and routing problems.",
    solution:
      "Console implementations of AVL rotations, B+ tree range queries, and BFS/DFS/Prim/Kruskal with complexity documentation.",
    stack: ["Java", "AVL Tree", "B+ Tree", "Graphs", "Minimum Spanning Tree"],
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

export const additionalProjects = [
  {
    name: "university-time-table-generator",
    scope: "SCRIPT",
    language: "Python",
    note: "Academic timetable generator — README updated to match real scope.",
    url: "https://github.com/karkalashivareddy/university-time-table-generator",
  },
  {
    name: "fraud-detection-risk-intelligence",
    scope: "SCAFFOLD",
    language: "Python",
    note: "Abstract + empty modules only — placeholder until real work lands.",
    url: "https://github.com/karkalashivareddy/fraud-detection-risk-intelligence",
  },
  {
    name: "KLH CSE DSA-3 — Loginsight Analyzer",
    scope: "PRIVATE",
    language: null,
    note: "Private until real work lands — currently empty.",
    url: null,
  },
] as const;
