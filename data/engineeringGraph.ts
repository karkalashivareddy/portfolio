export type GraphLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type GraphNode = {
  id: string;
  label: string;
  sub: string;
  x: number; // 0..1 (viewBox 0..640)
  y: number;
  color: string;
  links: GraphLink[];
};

export type GraphEdge = {
  source: string;
  target: string;
  faint?: boolean;
};

/**
 * The engineering graph — a real, verifiable map of the work.
 * Six canonical engineering domains (DSA / SYSTEMS / BACKEND / DATABASES /
 * FULL STACK / CLOUD), every node linking to a project or a live data source.
 * No fabrication: colors come from the domain accent ramp, claims are limited
 * to what the docs and repos actually support.
 */
export const engineeringGraph = {
  nodes: [
    {
      id: "me",
      label: "Karkala Shiva Reddy",
      sub: "Computer Science Engineer",
      x: 0.5,
      y: 0.5,
      color: "#7aa2ff",
      links: [
        { label: "View projects", href: "/projects" },
        { label: "Coding record", href: "/coding" },
        { label: "GitHub", href: "/github" },
      ],
    },
    {
      id: "dsa",
      label: "DSA",
      sub: "AVL · B+ tree · graphs · MST",
      x: 0.5,
      y: 0.12,
      color: "#22d3ee",
      links: [
        { label: "DSA-2 Projects (Java)", href: "/projects/dsa2-java-projects" },
        { label: "2,531 problems solved", href: "/coding" },
      ],
    },
    {
      id: "systems",
      label: "SYSTEMS",
      sub: "C · fork · exec · signals",
      x: 0.18,
      y: 0.3,
      color: "#a78bfa",
      links: [
        { label: "Command Argument Passing System", href: "/projects/command-argument-passing-system" },
        {
          label: "Creaters_Shell_OSSP (GitHub)",
          href: "https://github.com/karkalashivareddy/Creaters_Shell_OSSP",
          external: true,
        },
      ],
    },
    {
      id: "backend",
      label: "BACKEND",
      sub: "Node · Express · REST",
      x: 0.82,
      y: 0.3,
      color: "#34d399",
      links: [
        { label: "PharmaStock", href: "/projects/pharmastock-medicine-stock-management" },
        { label: "Hospital Bed API", href: "/projects/hospital-bed-management-system" },
      ],
    },
    {
      id: "databases",
      label: "DATABASES",
      sub: "MySQL · MongoDB · models",
      x: 0.18,
      y: 0.72,
      color: "#f5b759",
      links: [
        { label: "PharmaStock", href: "/projects/pharmastock-medicine-stock-management" },
        { label: "Hospital Bed Management", href: "/projects/hospital-bed-management-system" },
      ],
    },
    {
      id: "fullstack",
      label: "FULL STACK",
      sub: "React · REST · this portfolio",
      x: 0.82,
      y: 0.72,
      color: "#e879f9",
      links: [
        { label: "PharmaStock (React)", href: "/projects/pharmastock-medicine-stock-management" },
        { label: "This portfolio", href: "/" },
      ],
    },
    {
      id: "cloud",
      label: "CLOUD",
      sub: "Next.js · Vercel target",
      x: 0.5,
      y: 0.9,
      color: "#5b8def",
      links: [
        { label: "Deployment notes", href: "/github" },
        { label: "Live wiring on GitHub page", href: "/github" },
      ],
    },
  ] as GraphNode[],

  edges: [
    { source: "me", target: "dsa" },
    { source: "me", target: "systems" },
    { source: "me", target: "backend" },
    { source: "me", target: "databases" },
    { source: "me", target: "fullstack" },
    { source: "me", target: "cloud" },
    { source: "systems", target: "backend", faint: true },
    { source: "backend", target: "databases", faint: true },
    { source: "fullstack", target: "backend", faint: true },
    { source: "cloud", target: "fullstack", faint: true },
  ] as GraphEdge[],
};