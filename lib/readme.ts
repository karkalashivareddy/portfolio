import { profile, socials, verifiedNumbers } from "../data/profile";
import { featuredProjects } from "../data/projects";
import { skillCategories } from "../data/skills";
import { codingAggregate } from "../data/coding";
import { config } from "./config";

/**
 * Generates the professional GitHub profile README from the verified data
 * layer. Output is deterministic so previews and approvals are reproducible.
 *
 * Safety: this only returns markdown text. Publishing to GitHub is a
 * separate, explicitly-approved step (see /docs/roadmap Phase 5 and
 * AUTO_UPDATE_README env — default manual mode).
 */
export function generateProfileReadme(): string {
  const projLines = featuredProjects
    .map((p) => {
      const gh = p.github ? ` — [repo](${p.github})` : "";
      const note = p.statusNote ? `\n  > ${p.statusNote}` : "";
      return `- **${p.title}** — ${p.tagline}${gh}${note}`;
    })
    .join("\n");

  const skillLines = skillCategories
    .filter((c) => c.title !== "Currently learning")
    .map((c) => {
      const names = c.items.map((i) => i.name).join(", ");
      return `- **${c.title}** — ${names}`;
    })
    .join("\n");

  return [
    `# Hi, I'm ${profile.displayName}`,
    "",
    `${profile.headline}`,
    "",
    `B.Tech Computer Science at ${profile.university} (class of ${profile.graduationYear}). I work primarily in **Java** and **C**, and I'm building toward professional backend and systems engineering.`,
    "",
    "## Current focus",
    "",
    ...profile.current.map((c) => `- ${c}`),
    "",
    "## Featured projects",
    "",
    projLines,
    "",
    "## Technical stack",
    "",
    skillLines,
    "",
    "## Verified coding track record",
    "",
    `- **${verifiedNumbers.problemsSolved.toLocaleString()}** problems solved across ${verifiedNumbers.platforms} platforms (${codingAggregate.platforms} connected) — verified via Codolio`,
    `- CodeChef **2★**, rating **1455** (DSA **1707**) with ${codingAggregate.contests}+ rated contests`,
    `- LeetCode **264** solved (179 easy · 71 medium · 14 hard), max rating **1500**`,
    `- Longest active streak **${verifiedNumbers.codingStreakDays} days**`,
    "",
    "## Coding profiles",
    "",
    `- GitHub — [github.com/${socials.github.handle}](https://github.com/${socials.github.handle})`,
    `- Codolio — [profile/2520030105](https://codolio.com/profile/2520030105)`,
    `- CodeChef — [shivareddy_27](https://www.codechef.com/users/shivareddy_27)`,
    `- LeetCode — [KarkalaShivaReddy](https://leetcode.com/u/KarkalaShivaReddy/)`,
    `- LinkedIn — [Shiva Reddy Karkala](https://www.linkedin.com/in/${socials.linkedin.handle}/)`,
    "",
    "## Beyond the work",
    "",
    profile.goals.map((g) => `- Learning: ${g}`).join("\n"),
    "",
    "---",
    "",
    "All project and coding claims above are traceable to public repositories and my public Codolio profile — no fabricated metrics.",
  ].join("\n");
}

export const readmeSettings = {
  autoUpdate: config.readme.autoUpdate,
  approvalRequired: config.readme.approvalRequired,
  mode: config.readme.autoUpdate ? "auto" : "manual",
} as const;