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
      "Implemented AVL insertion with rotations, a warehouse price-range scan, and Prim's minimum spanning tree in Java.",
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
    title: "OS/Systems coursework documented",
    detail:
      "Published the command-argument project abstract; the companion OSSP repository contains the C mini-shell, signal, /proc, FIFO, and process exercises.",
    kind: "learning",
    source: "Command-Argument-Passing-System + Creaters_Shell_OSSP repos",
  },
  {
    date: "Ongoing",
    title: "Competitive programming campaign",
    detail:
      "37+ CodeChef rated contests (rating 623 → 1474), 15 LeetCode contests, 100-day streaks — synced from Codolio.",
    kind: "milestone",
    source: "Codolio profile",
  },
];
