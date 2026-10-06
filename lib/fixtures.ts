import { promises as fs } from "fs";
import path from "path";
import { ageMs, freshnessFor } from "./store";
import type { SyncMeta } from "./types";

/**
 * Deterministic snapshot seam for the end-to-end suite.
 *
 * The coding and GitHub routes are server components: their data is read while
 * the request is being served, so a browser-level `page.route()` stub cannot
 * reach it. Writing the on-disk cache is not enough either, because both loaders
 * deliberately re-fetch once a cached copy is older than its TTL — which is the
 * exact branch the freshness tests need to observe.
 *
 * With `PORTFOLIO_TEST_FIXTURES=1` the loaders read `<dir>/<name>.json` instead
 * of calling the network. The freshness label is still *computed* from the
 * timestamp inside that file by the same `freshnessFor` used in production, so
 * these tests exercise the real presentation logic rather than a hard-coded
 * label, and they do not depend on a third party being reachable or on the
 * unauthenticated GitHub rate limit.
 *
 * Activation is opt-in through the environment variable alone; a normal
 * deployment never sets it. Documented in README.md and .env.example.
 */
const ENABLED = process.env.PORTFOLIO_TEST_FIXTURES === "1";
const DIR = process.env.PORTFOLIO_FIXTURE_DIR || path.join(process.cwd(), "e2e", ".state");

export function fixturesEnabled(): boolean {
  return ENABLED;
}

/**
 * Read a fixture snapshot and re-derive its freshness state.
 *
 * The file supplies the payload plus the moment it was "synchronized"; the
 * status shown in the UI is always recomputed here from that moment and the
 * source TTL, so a fixture can never claim to be fresher than it is.
 */
export async function readFixture<T extends { meta: SyncMeta }>(
  name: string,
  ttlMs: number
): Promise<T | null> {
  if (!ENABLED) return null;
  try {
    const raw = await fs.readFile(path.join(DIR, `${name}.json`), "utf-8");
    const parsed = JSON.parse(raw) as T;
    const timestamp = parsed.meta.fetchedAt ?? parsed.meta.lastSuccessfulSync ?? null;
    return {
      ...parsed,
      meta: {
        ...parsed.meta,
        status: freshnessFor(ageMs(timestamp), ttlMs),
      },
    };
  } catch {
    // No fixture for this source: the loader falls through to its normal path.
    return null;
  }
}