import { expect, test } from "@playwright/test";
import { RECORDED_CODOLIO, useCodolioState, watchForErrors } from "./fixtures";

/**
 * Freshness presentation.
 *
 * The coding route is a server component, so these cases publish a fixture
 * snapshot through the documented `PORTFOLIO_TEST_FIXTURES` seam and then assert
 * on what the page says about it. The label itself is still computed by
 * `freshnessFor` from the timestamp in the fixture — the tests never assert a
 * string the component could have hard-coded, they assert that synchronized,
 * stale and snapshot data are each described differently.
 *
 * The Codolio TTL is 60 minutes (CODOLIO_TTL_MS), which sets the boundaries:
 *   5 min   -> live
 *   40 min  -> recent
 *   3 hours -> synced
 *   3 days  -> stale
 *   12 days -> very-stale
 */

test.describe("coding freshness states", () => {
  test("a snapshot read moments ago is labelled live", async ({ page }) => {
    await useCodolioState({ ageMs: 20 * 1000 });
    await page.goto("/coding");

    const status = page.locator("[data-sync-status]").first();
    await expect(status).toHaveAttribute("data-sync-status", "live");
    await expect(status).toHaveAttribute("data-sync-origin", "api");
    await expect(status).toContainText("Synchronized");
    await expect(status).not.toContainText("verified snapshot");
    // The absolute timestamp is always present, so the claim stays checkable.
    await expect(status).toHaveAttribute("data-synced-at", /.*Z/);

    // The aggregate shown next to it comes from the same snapshot.
    await expect(page.locator(".coding-hero-number")).toHaveText(
      RECORDED_CODOLIO.aggregate.totalSolved.toLocaleString("en-US")
    );
  });

  test("a snapshot inside the TTL is labelled synchronized, not live", async ({ page }) => {
    await useCodolioState({ ageMs: 5 * 60 * 1000 });
    await page.goto("/coding");

    const status = page.locator("[data-sync-status]").first();
    // Five minutes is inside the 60-minute Codolio TTL but past the one-minute
    // "live" window, so the UI may say synchronized but not live.
    await expect(status).toHaveAttribute("data-sync-status", "recent");
    await expect(status).toContainText("Synchronized");
    await expect(status).toContainText(/\b\d+ mins? ago\b/);
  });

  test("relative time is derived from the timestamp, never hard-coded", async ({ page }) => {
    await useCodolioState({ ageMs: 3 * 60 * 60 * 1000 });
    await page.goto("/coding");

    const status = page.locator("[data-sync-status]").first();
    // Three hours old, so the label must read in hours.
    await expect(status).toContainText(/\b\d+ hrs? ago\b/);
    await expect(status).not.toContainText("just now");
  });

  test("data older than twice the TTL is labelled stale and keeps its values", async ({ page }) => {
    await useCodolioState({ ageMs: 3 * 24 * 60 * 60 * 1000, error: "Codolio API returned 503" });
    await page.goto("/coding");

    const status = page.locator("[data-sync-status]").first();
    await expect(status).toHaveAttribute("data-sync-status", "stale");
    await expect(status).toContainText("Stale");
    await expect(status).toContainText(/\b\d+ days? ago\b/);
    // Degraded data is still shown rather than blanked out.
    await expect(page.locator(".coding-hero-number")).toHaveText("2,745");
  });

  test("the committed snapshot is reported as verified, never as synchronized", async ({ page }) => {
    await useCodolioState({
      ageMs: 12 * 24 * 60 * 60 * 1000,
      origin: "snapshot",
      error: "Codolio API unavailable",
    });
    await page.goto("/coding");

    const status = page.locator("[data-sync-status]").first();
    await expect(status).toHaveAttribute("data-sync-status", "very-stale");
    await expect(status).toHaveAttribute("data-sync-origin", "snapshot");
    await expect(status).toContainText("verified snapshot");
    await expect(status).not.toContainText("Synchronized");
  });

  test("the page states which moment it was measured on", async ({ page }) => {
    await useCodolioState({ ageMs: 20 * 60 * 1000 });
    await page.goto("/coding");

    // The hero exposes the aggregate as an accessible value, not just a number.
    await expect(page.locator(".coding-hero-number")).toHaveAttribute(
      "aria-label",
      "2,745 problems solved"
    );
    const status = page.locator("[data-sync-status]").first();
    const stamped = await status.getAttribute("data-synced-at");
    expect(stamped).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    await expect(status).toHaveAttribute("title", /Last verified .* UTC/);
  });

  test("platform rows render from the snapshot with no browser errors", async ({ page }) => {
    await useCodolioState({ ageMs: 5 * 60 * 1000 });
    const errors = watchForErrors(page);
    await page.goto("/coding");

    await expect(page.getByRole("heading", { name: /CodeChef/i }).first()).toBeVisible();
    // Difficulty bars only exist where the platform reports a breakdown.
    await expect(page.locator(".coding-difficulty").first()).toBeVisible();
    // Every platform in the snapshot is represented.
    for (const platform of RECORDED_CODOLIO.platforms) {
      await expect(page.getByText(platform.platform).first()).toBeVisible();
    }
    expect(errors, `unexpected browser errors:\n${errors.join("\n")}`).toEqual([]);
  });
});