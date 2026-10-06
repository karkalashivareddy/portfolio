import { profile, socials } from "../data/profile";
import { featuredProjects } from "../data/projects";
import { skillCategories } from "../data/skills";
import { config } from "./config";

/**
 * Generates the professional GitHub profile README from the verified data
 * layer. Output is deterministic so previews and approvals are reproducible.
 *
 * On metrics: this generator deliberately emits **no** problem counts, contest
 * ratings, or streaks. Those were previously hardcoded here and, because they
 * came from a dated snapshot, the file disagreed with itself — one copy said
 * 2,531 problems and 91 days, another 2,613 and 100, and four different CodeChef
 * ratings appeared across the repository. A number that is copied rather than
 * read is a number that will be wrong. Point readers at Codolio, which reads
 * from the platform APIs, instead.
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
    "## Coding practice",
    "",
    "My per-platform problem counts, contest ratings, and streaks are deliberately **not**",
    "reproduced here. Those figures change constantly, and a README that copies them goes",
    "stale without anyone noticing. The live numbers are on my Codolio profile, which reads",
    "from the platform APIs rather than from a stored copy:",
    "",
    `- Codolio — [profile/2520030105](https://codolio.com/profile/2520030105)`,
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
    "Project descriptions above are written against the repositories as they are. Where a",
    "project has a real boundary — synthetic data, no deployment, a single sampled process —",
    "that boundary is stated in the project entry rather than left for a reader to discover.",
    "Generated from `lib/readme.ts`; edit the data modules, not this file.",
  ].join("\n");
}

export const readmeSettings = {
  autoUpdate: config.readme.autoUpdate,
  approvalRequired: config.readme.approvalRequired,
  mode: config.readme.autoUpdate ? "auto" : "manual",
} as const;