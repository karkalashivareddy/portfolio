/**
 * Honest per-project flow stages, derived from each system's documented
 * architecture (see docs/technical-architecture.md and the case studies).
 * Every label is a component the project actually uses/describes — nothing
 * fabricated.
 */
export const projectFlows: Record<string, string[]> = {
  "pharmastock-medicine-stock-management": [
    "Auth",
    "API",
    "Medicines",
    "Purchase",
    "Sales",
    "Analytics",
  ],
  "command-argument-passing-system": [
    "Parent",
    "fork",
    "child",
    "execvp",
    "waitpid",
  ],
  "hospital-bed-management-system": [
    "Frontend",
    "REST",
    "Express",
    "MySQL",
  ],
  "dsa2-java-projects": ["AVL", "B+ Tree", "Graphs", "BFS/DFS", "Prim/Kruskal"],
};