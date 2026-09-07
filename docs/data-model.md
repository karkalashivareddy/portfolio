# Data Model

Typed contracts for all portfolio content. Every numeric value includes `source` for audibility.

## `Profile`
```ts
{
  name: "Karkala Shiva Reddy";
  displayName: "Shiva Reddy";
  role: "Computer Science Engineer";
  headline: "Computer Science Engineer building reliable software across algorithms, backend systems and full-stack applications.";
  university: "KL University";
  universityLong: "Koneru Lakshmaiah Education Foundation";
  degree: "B.Tech â€” Computer Science";
  graduationYear: 2029;
  location: "India";
  current: string[];        // java, dsa, backend, databases, systems, full-stack
  goals: string[];          // spring boot, docker, distributed systems, cloud (labelled goals)
  avatarUrl: string;        // github avatar
}
```

## `Project`
```ts
{
  slug: string;              // "pharmastock-medicine-stock-management"
  title: string;
  tagline: string;           // one-line value proposition
  type: "Full-Stack" | "Backend/Systems" | "Product/Frontend" | "Academic";
  rank: "S" | "A" | "B";
  featured: boolean;
  status: "published" | "publishing-soon" | "local-demo";
  summary: string;
  problem: string;
  solution: string;
  stack: string[];           // verified from inspect
  architecture?: string;     // short textual diagram
  engineeringDecisions: string[];
  challenges: string[];
  results?: string[];        // only verified
  learning: string[];
  github?: string;
  demo?: string;             // only when real
  disclaimer?: string;       // honest status label when lacking demo
  screenshots?: { src: string; alt: string }[];
}
```
Verified fields only; `results` omitted where no evidence exists. See `data/projects.ts`.

## `Skill`
```ts
{
  category: "Languages" | "Frontend" | "Backend & Systems" | "Databases" | "Tools" | "Currently Learning";
  items: { name: string; note?: string; evidence?: string }[];
}
```

## `CodingPlatform` (source: Codolio public API)
```ts
{
  platform: "CodeChef" | "LeetCode" | "GeeksforGeeks" | "HackerRank" | "Codeforces";
  handle: string;
  verified: boolean;
  solvedTotal?: number;
  easy?: number; medium?: number; hard?: number;
  rating?: number; maxRating?: number;
  dsaRating?: number;
  contests?: number;
  maxStreak?: number;
  badges?: string[];
  certificates?: string[];
  languages?: string[];
  url: string;
}
```

## `CodingAggregate`
```ts
{ totalSolved: number; platforms: number; contests: number; maxStreak: number; source: "Codolio"; asOf: string }
```
(â‰ˆ2,531 problems; 5 platforms; 36+ contests; 91d streak; aggregate sourced to Codolio.)

## `Socials`
```ts
{
  github: { url; handle };
  linkedin: { url; handle };
  codolio: { url; key: "2520030105" };
  email?: string;            // null â†’ no mailto (placeholder only)
}
```

## `TimelineEntry`
```ts
{
  date: string;              // "2026-08"
  title: string;
  detail: string;
  kind: "education" | "project" | "learning" | "milestone";
  source?: string;
}
```
Only verified dates/happenings (see content-strategy Â§2).

## Veracity rules enforced in code
- `source` renders on every stat.
- "Currently learning" items are visually distinct from claimed skills.
- Omitted fields typed `undefined` â€” UI renders `â€”` not fake numbers.
- Sub-aggregates (e.g., "Java problems on LeetCode") derived only from data actually present.
