import type { Metadata } from "next";
import GitHubArchive from "../../components/github/GitHubArchive";
import { getGithubSnapshot } from "../../lib/github";

export const metadata: Metadata = { title: "GitHub engineering archive", description: "Inspect Karkala Shiva Reddy's public repositories, languages and recent engineering work.", alternates: { canonical: "/github" }, openGraph: { title: "GitHub engineering archive — Karkala Shiva Reddy", description: "Inspect the public repositories behind the portfolio.", type: "website" }, twitter: { card: "summary_large_image", title: "GitHub engineering archive — Karkala Shiva Reddy", description: "Inspect the public repositories behind the portfolio." } };

/**
 * Rendered per request, so the freshness label describes this request rather
 * than the moment the build ran.
 */
export const dynamic = "force-dynamic";

/**
 * Synchronized server-side, then rendered.
 *
 * `getGithubSnapshot` does not reject: it returns API data when GitHub answers,
 * the last cached copy when a later request fails, and a dated committed
 * snapshot as a last resort. Each case carries its own `meta`, so the component
 * can label the data honestly instead of needing an error branch that would only
 * ever show a spinner or a dead end.
 */
export default async function GitHubPage() {
  const snapshot = await getGithubSnapshot();
  return (
    <div className="world-route-page world-route-github-page">
      <div className="world-shell">
        <GitHubArchive snapshot={snapshot} />
      </div>
    </div>
  );
}