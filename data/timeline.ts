import type { TimelineEntry } from "../lib/types";

// Only real events with traceable dates (details in /docs).
export const timeline: TimelineEntry[] = [
  {
    date: "2025-12",
    title: "GitHub account created",
    detail:
      "Started publishing engineering work publicly under karkalashivareddy.",
    kind: "milestone",
    source: "GitHub API",
  },
  {
    date: "2026-02 → 03",
    title: "First full systems build in Java",
    detail:
      "Built a student GatePass management system (HashMap + Queue + file persistence) alongside web-coursework labs.",
    kind: "project",
    source: "FWD repository (Java project)",
  },
  {
    date: "2026-04 → 06",
    title: "Hospital Bed Management System",
    detail:
      "First complete full-stack project: Express + MySQL REST API with indexed schema, plus React and vanilla clients. Ran against a local hospital_beds database.",
    kind: "project",
    source: "hospital-bed-dashboard repository",
  },
  {
    date: "2026-05",
    title: "DSA-2 Java projects",
    detail:
      "Implemented AVL tree, B+ tree and graph/MST (BFS, DFS, Prim, Kruskal) console projects in Java.",
    kind: "project",
    source: "DSA2-Projects repository",
  },
  {
    date: "2026-05 → 06",
    title: "University timetable generator",
    detail:
      "Python constraint/scheduling tooling with validation modules — exploring constraint-satisfaction approaches.",
    kind: "learning",
    source: "university-time-table-generator repository",
  },
  {
    date: "2026-08",
    title: "PharmaStock completed (Review-2)",
    detail:
      "17-page medicine stock management & analytics portal delivered for the Database Systems course.",
    kind: "project",
    source: "DataBase-System… repository (Review-2)",
  },
  {
    date: "2026-08",
    title: "OS/Systems coursework complete",
    detail:
      "Command Argument Passing System + mini-shell + /proc inspection in C; diamonds and streaks logged on coding platforms.",
    kind: "learning",
    source: "Command-Argument-Passing-System + Creaters_Shell_OSSP repos",
  },
  {
    date: "Ongoing",
    title: "Competitive programming campaign",
    detail:
      "36+ CodeChef rated contests (rating 623 → 1455), 14 LeetCode contests, 91-day streaks — synced from Codolio.",
    kind: "milestone",
    source: "Codolio profile",
  },
];