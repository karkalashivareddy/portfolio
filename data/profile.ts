export const profile = {
  name: "Karkala Shiva Reddy",
  displayName: "Shiva Reddy",
  role: "Computer Science Engineer",
  headline:
    "Computer Science Engineer building reliable software across algorithms, backend systems and full-stack applications.",
  shortBio:
    "B.Tech Computer Science student at KL University working in Java and C across competitive programming, systems programming and full-stack product builds. Publishing my engineering work as I grow from academic projects toward production-grade software.",
  university: "KL University",
  universityLong: "Koneru Lakshmaiah Education Foundation",
  degree: "B.Tech — Computer Science",
  branch: "Computer Science",
  graduationYear: 2029,
  location: "India",
  current: [
    "Java & DSA",
    "C / Linux systems",
    "Backend engineering",
    "Databases",
    "Full-stack web",
  ],
  goals: [
    "Spring Boot",
    "Docker",
    "Distributed systems",
    "System design",
    "Cloud",
  ],
  avatarUrl:
    "https://avatars.githubusercontent.com/u/247306745?v=4",
  pronouns: null,
} as const;

export const socials: import("../lib/types").Socials = {
  github: {
    handle: "karkalashivareddy",
    url: "https://github.com/karkalashivareddy",
  },
  linkedin: {
    handle: "shiva-reddy-karkala-1a66b4397",
    url: "https://www.linkedin.com/in/shiva-reddy-karkala-1a66b4397/",
  },
  codolio: {
    handle: "2520030105",
    key: "2520030105",
    url: "https://codolio.com/profile/2520030105",
  },
  email: "karkalashivareddy@gmail.com",
};

/**
 * A dated fallback snapshot of coding-practice totals, used only when the live
 * Codolio sync has not run.
 *
 * These are **not** treated as verified facts. They are a September 2026
 * snapshot, they already disagreed with an older copy of the profile README that
 * claimed 2,531 problems and a 91-day streak, and nothing keeps them in step
 * with the platforms. Nothing in the generated profile README prints them.
 * Prefer the live aggregate from `data/coding.ts` / `lib/codolio.ts`.
 */
export const verifiedNumbers = {
  problemsSolved: 2613,
  platforms: 5,
  codechefContests: 36,
  codingStreakDays: 100,
  source: "Codolio",
  asOf: "2026-09-16",
  isFallbackSnapshot: true,
} as const;
