import type { SkillCategory } from "../lib/types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    note: "Primary working languages — exercised daily on platforms and in builds",
    color: "#7aa2ff",
    items: [
      { name: "Java", note: "Primary language — LeetCode, DSA-2 projects" },
      { name: "C", note: "Systems coursework, shells & /proc tooling" },
      { name: "JavaScript", note: "Full-stack builds, React apps" },
      { name: "Python", note: "Scripting, generation tooling" },
      { name: "SQL", note: "MySQL schemas, HackerRank SQL" },
    ],
  },
  {
    title: "Frontend",
    note: "Live in the PharmaStock portal, dashboards and this portfolio",
    color: "#22d3ee",
    items: [
      { name: "React", note: "17-page inventory portal" },
      { name: "Vite", note: "Build tooling for PharmaStock" },
      { name: "Recharts", note: "Analytics dashboards" },
      { name: "Tailwind CSS", note: "This portfolio" },
      { name: "HTML / CSS3", note: "Coursework + vanilla clients" },
    ],
  },
  {
    title: "Backend & Systems",
    note: "REST backends, realtime events and POSIX systems work",
    color: "#34d399",
    items: [
      { name: "Node.js / Express", note: "REST + realtime backends" },
      { name: "REST API design", note: "Hospital beds API (implemented)" },
      { name: "Linux / POSIX", note: "fork, exec, wait, signals" },
      { name: "/proc filesystem", note: "Process inspection" },
    ],
  },
  {
    title: "Databases",
    note: "Modeled in the hospital beds schema and PharmaStock data layer",
    color: "#38bdf8",
    items: [
      { name: "MySQL", note: "hospital_beds schema, indexed + ENUM" },
      { name: "MongoDB / Mongoose", note: "Documented target for PharmaStock backend" },
      { name: "Data modeling", note: "Batches, transactions, expiry" },
    ],
  },
  {
    title: "Tools",
    note: "The daily toolchain behind every commit",
    color: "#f5b759",
    items: [
      { name: "Git / GitHub", note: "Versioning + publishing" },
      { name: "VS Code", note: "Primary editor" },
      { name: "Postman", note: "API testing" },
      { name: "MongoDB Compass", note: "Database tooling" },
      { name: "npm", note: "Package management" },
    ],
  },
  {
    title: "Currently learning",
    note: "On the engineering roadmap — learning in public",
    color: "#ff7a6b",
    items: [
      { name: "Spring Boot", note: "Used in ForgeSense backend" },
      { name: "Docker", note: "Containers & dev environments" },
      { name: "System design", note: "Scaling patterns" },
      { name: "Cloud", note: "AWS / deployment fundamentals" },
      { name: "Distributed systems", note: "Consistency, reliability" },
    ],
  },
];

export const codingSkillsNote =
  "Backing signal: 2,613 accepted solutions across CodeChef, LeetCode, GFG, HackerRank and Codeforces — every number links to its live source in the Coding section.";
