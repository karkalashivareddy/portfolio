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
      "Project abstract for a planned C/Linux fork-exec argument-passing utility.",
    type: "Academic",
    rank: "C",
    class: "supporting",
    featured: false,
    kind: "card",
    status: "academic",
    summary:
      "The repository currently contains the project abstract and design scope; implementation source is not yet present.",
    problem:
      "Document a process-management design for passing command arguments from a parent process to a child process.",
    solution:
      "The abstract specifies a future fork/exec/wait-based command runner; implementation remains future work.",
    stack: ["C (planned)", "Linux / POSIX concepts", "fork / exec / wait design"],
    github:
      "https://github.com/karkalashivareddy/Command-Argument-Passing-System",
    statusNote:
      "Documentation-only repository; source and executable are not currently published.",
    accent: "#34d399",
    tags: ["C", "Linux", "OS", "Processes"],
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

export const additionalProjects = [
  {
    name: "forgesense-industrial-intelligence",
    scope: "FLAGSHIP",
    language: "Java / Python",
    note: "Industrial operations platform with Spring Boot, FastAPI ML, Kafka, Redis, PostgreSQL, WebSockets, and Three.js.",
    url: "https://github.com/karkalashivareddy/forgesense-industrial-intelligence",
  },
  {
    name: "university-time-table-generator",
    scope: "SCRIPT",
    language: "Python",
    note: "Academic timetable generator — README updated to match real scope.",
    url: "https://github.com/karkalashivareddy/university-time-table-generator",
  },
  {
    name: "KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer",
    scope: "ALGORITHM LAB",
    language: "Java / TypeScript",
    note: "Full-stack log analytics lab with executable algorithm modules.",
    url: "https://github.com/karkalashivareddy/KLH_CSE_2026-27_DSA-3_S3_T17_Loginsight-Analyzer",
  },
] as const;
