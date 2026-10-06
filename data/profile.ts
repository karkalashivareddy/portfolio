import { codingAggregate, codingPlatformsFallback } from "./coding";

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
 * Coding totals, derived — never hand-written.
 *
 * This object used to be a second, independently-edited copy of the same facts
 * that live in `data/coding.ts`, and the two drifted: the copy here said 2,613
 * problems / 36 contests / 100 days while the other said different numbers, and
 * neither matched the platforms. Two constants for one fact is how a page ends
 * up confidently wrong.
 *
 * It is now computed from the committed snapshot, so there is exactly one place
 * to refresh. `isFallbackSnapshot` and `asOf` travel with it so any consumer can
 * label the figures with the date they were actually verified.
 *
 * Prefer passing a synchronized `CodingSnapshot` from a server component; this
 * exists for components that cannot receive one.
 */
export const verifiedNumbers = {
  problemsSolved: codingAggregate.totalSolved,
  platforms: codingAggregate.platforms,
  codechefContests:
    codingPlatformsFallback.find((platform) => platform.platform === "CodeChef")?.contests ?? 0,
  codingStreakDays: codingAggregate.maxStreak,
  source: codingAggregate.source,
  asOf: codingAggregate.asOf,
  isFallbackSnapshot: true,
} as const;
