import WorldHome from "../components/world/WorldHome";
import { getCodolioSnapshot } from "../lib/codolio";

/**
 * Rendered per request.
 *
 * This route was prerendered at build time, so the "Synchronized" timestamp in
 * the static HTML was the moment of the build — on a static/serverless host that
 * label could describe data hours old, and the fixture seam used by the e2e
 * suite had no effect at all. The loader caches for its TTL, so re-rendering per
 * request costs one upstream call per TTL window, not one per visit.
 */
export const dynamic = "force-dynamic";

/**
 * Synchronized server-side, then rendered.
 *
 * The home page previously hardcoded its coding numbers in two places
 * (`data/profile.ts` and a literal list inside `SignalScene`). Both were stale,
 * and both disagreed with each other. The snapshot is now read once here and
 * passed down as props, so the hero, the signal section and the proof strip all
 * render the same synchronized figures with the same timestamp.
 */
export default async function HomePage() {
  const snapshot = await getCodolioSnapshot();
  return <WorldHome snapshot={snapshot} />;
}