import type { Metadata } from "next";
import GitHubArchive from "../../components/github/GitHubArchive";

export const metadata: Metadata = { title: "GitHub engineering archive", description: "Inspect Karkala Shiva Reddy's public repositories, languages and recent engineering work.", alternates: { canonical: "/github" }, openGraph: { title: "GitHub engineering archive · Karkala Shiva Reddy", description: "Inspect the public repositories behind the portfolio.", type: "website" }, twitter: { card: "summary_large_image", title: "GitHub engineering archive · Karkala Shiva Reddy", description: "Inspect the public repositories behind the portfolio." } };

export default function GitHubPage() {
  return <main className="world-route-page world-route-github-page"><div className="world-shell"><GitHubArchive /></div></main>;
}
