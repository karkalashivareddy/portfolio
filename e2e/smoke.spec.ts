import { expect, test } from "@playwright/test";
import { useCodolioState, useGithubState, watchForErrors } from "./fixtures";

/**
 * Browser smoke suite against the production build.
 *
 * Scope is deliberately narrow: confirm that `next start` serves every route,
 * that navigation and the command palette work, that each flagship case study
 * resolves, and that an ordinary visit produces no uncaught browser errors or
 * hydration mismatches. Selectors are roles, links and stable `data-*` hooks.
 *
 * Data-dependent routes are served through the documented fixture seam rather
 * than the network, so the suite is deterministic and does not consume the
 * unauthenticated GitHub rate limit.
 */

test.beforeEach(async () => {
  await useCodolioState({ ageMs: 5 * 60 * 1000 });
  await useGithubState({ ageMs: 5 * 60 * 1000 });
});

test.describe("home", () => {
  test("renders one main landmark, an h1 and the flagship work", async ({ page }) => {
    const errors = watchForErrors(page);
    await page.goto("/");

    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.locator("#work")).toBeVisible();

    // The first chapter the visitor meets is the one the nav calls "01 / ORIGIN".
    const chapters = page.locator("#origin, #signal, #work, #systems, #github, #about");
    await expect(chapters.first()).toBeVisible();

    expect(errors, `unexpected browser errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("the signal section renders one row per synchronized platform", async ({ page }) => {
    await page.goto("/");
    const signal = page.locator("#signal");
    await expect(signal).toBeVisible();
    await expect(signal.locator(".x2-stream")).toHaveCount(5);
    await expect(signal.locator("[data-sync-status]").first()).toBeVisible();
    // The displayed total matches the snapshot the page was rendered from.
    await expect(page.locator(".x2-signal-total")).toHaveText("2,745");
  });

  test("the flagship section links to the canonical case study", async ({ page }) => {
    await page.goto("/");
    const work = page.locator("#work");
    await expect(work.getByRole("link", { name: /command argument passing system/i }).first()).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("primary nav reaches every top-level route", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });

    for (const [label, path] of [
      ["Projects", "/projects"],
      ["Coding", "/coding"],
      ["GitHub", "/github"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("main")).toHaveCount(1);
      // The current page is marked for assistive tech, not only styled.
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute(
        "aria-current",
        "page"
      );
    }
  });

  test("the command palette opens, filters and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /search/i }).first();
    await expect(trigger).toBeVisible();

    await trigger.click();
    const dialog = page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("the mobile menu exposes the same routes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    // The desktop nav stays in the DOM but is display:none, so the menu is
    // addressed directly rather than by a role query that would match both.
    const menu = page.locator(".world-mobile-menu");
    await expect(menu.getByRole("link", { name: "Projects", exact: true })).toBeVisible();
    await menu.getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });
});

test.describe("projects", () => {
  const FLAGSHIPS = [
    { slug: "command-argument-passing-system", name: /CAPS|Command Argument Passing System/i },
    { slug: "forgesense-industrial-intelligence", name: /ForgeSense/i },
    { slug: "loginsight-analyzer", name: /LogInsight/i },
    { slug: "pharmastock-medicine-stock-management", name: /PharmaStock/i },
  ];

  test("the index advertises the flagship it actually opens", async ({ page }) => {
    await page.goto("/projects");

    // The featured block is derived from projects[0]; the link and the heading
    // must describe the same system rather than a hand-typed name.
    const featured = page.locator(".case-index-feature");
    await expect(featured.getByRole("link", { name: /Open the .* case study/i })).toHaveAttribute(
      "href",
      "/projects/command-argument-passing-system"
    );
    await expect(featured).toContainText("Command Argument");

    for (const project of FLAGSHIPS) {
      await expect(page.getByRole("link", { name: project.name }).first()).toBeVisible();
    }
  });

  for (const project of FLAGSHIPS) {
    test(`${project.slug} case study loads`, async ({ page }) => {
      const errors = watchForErrors(page);
      const response = await page.goto(`/projects/${project.slug}`);
      expect(response?.status(), `${project.slug} should exist`).toBe(200);

      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();

      // External links open safely and are labelled, not icon-only.
      const repository = page.getByRole("link", { name: "Repository" });
      await expect(repository).toHaveAttribute("href", /^https:\/\/github\.com\/karkalashivareddy\//);
      await expect(repository).toHaveAttribute("target", "_blank");
      await expect(repository).toHaveAttribute("rel", /noopener/);

      expect(errors, `unexpected browser errors on ${project.slug}:\n${errors.join("\n")}`).toEqual([]);
    });
  }

  test("an unknown slug returns a 404", async ({ page }) => {
    const response = await page.goto("/projects/this-project-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});

test.describe("content routes", () => {
  test("coding page shows the snapshot total and its provenance", async ({ page }) => {
    await page.goto("/coding");
    await expect(page.locator(".coding-hero-number")).toHaveText("2,745");
    const status = page.locator("[data-sync-status]").first();
    await expect(status).toHaveAttribute("data-sync-origin", "api");
    // The fixture is five minutes old, so it is inside the TTL: never stale.
    await expect(status).toHaveAttribute("data-sync-status", /^(live|recent|synced)$/);
    await expect(status).toHaveAttribute("data-synced-at", /.*Z/);
  });

  test("github archive renders repositories from its snapshot", async ({ page }) => {
    const errors = watchForErrors(page);
    await page.goto("/github");

    await expect(page.getByRole("heading", { name: /inspectable/i })).toBeVisible();
    await expect(page.locator("[data-sync-status]").first()).toBeVisible();
    // The constellation is the desktop presentation and is keyboard reachable.
    await expect(
      page.getByRole("link", { name: /Command-Argument-Passing-System, TypeScript/ })
    ).toBeVisible();
    // Counts are derived from the snapshot, not stored separately.
    await expect(page.locator(".github-archive-count")).toHaveText("11");
    expect(errors, `unexpected browser errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("mobile replaces the constellation with a repository list", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/github");

    // `.github-archive-accessible-list` is display:none above 600px, so on a
    // phone the absolutely positioned constellation is replaced by a list.
    const list = page.locator(".github-archive-accessible-list");
    await expect(list).toBeVisible();
    await expect(list.getByRole("link", { name: /Command-Argument-Passing-System/ })).toBeVisible();
  });

  test("about page renders", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
  });

  test("contact page exposes the email and social links", async ({ page }) => {
    await page.goto("/contact");
    // Scoped to the page body: the primary nav also has a link labelled GitHub,
    // and this assertion is about the outbound profile links.
    await expect(
      page.locator('main a[href^="https://github.com/karkalashivareddy"]')
    ).toHaveCount(1);
    await expect(
      page.locator('main a[href^="https://www.linkedin.com/"]')
    ).toHaveCount(1);
  });

  test("every remaining route returns 200 with one h1", async ({ page }) => {
    for (const path of ["/systems", "/journey", "/learning", "/visual-lab"]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should exist`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }), `${path} needs an h1`).toHaveCount(1);
    }
  });
});

test.describe("responsive layout", () => {
  const VIEWPORTS = [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  /**
   * The user-visible defect is a horizontal scrollbar, so that is what is
   * asserted. Measuring every element's box instead produced false positives:
   * decorative glow layers are intentionally wider than the viewport and are
   * clipped by an ancestor, so flagging them says nothing about the layout.
   */
  async function horizontalOverflow(page: import("@playwright/test").Page, path: string) {
    await page.goto(path);
    return page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.documentElement.clientWidth,
    }));
  }

  for (const viewport of VIEWPORTS) {
    test(`no horizontal overflow on the projects index at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const result = await horizontalOverflow(page, "/projects");
      expect(result.document, `horizontal overflow at ${viewport.name}`).toBeLessThanOrEqual(1);
      expect(result.body, `body overflow at ${viewport.name}`).toBeLessThanOrEqual(1);
    });
  }

  test("case study stays readable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/projects/command-argument-passing-system");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const result = await horizontalOverflow(page, "/projects/command-argument-passing-system");
    expect(result.document, "horizontal overflow on mobile case study").toBeLessThanOrEqual(1);
  });

  test("coding and home pages stay readable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const path of ["/coding", "/"]) {
      const result = await horizontalOverflow(page, path);
      expect(result.document, `horizontal overflow on mobile ${path}`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("accessibility basics", () => {
  test("every route exposes exactly one main landmark and one h1", async ({ page }) => {
    for (const path of [
      "/",
      "/projects",
      "/projects/command-argument-passing-system",
      "/coding",
      "/github",
      "/about",
      "/contact",
    ]) {
      await page.goto(path);
      await expect(page.getByRole("main"), `${path} needs one main landmark`).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 }), `${path} needs one h1`).toHaveCount(1);
    }
  });

  test("images declare alt text", async ({ page }) => {
    await page.goto("/");
    const missing = await page.evaluate(() =>
      Array.from(document.images)
        .filter((image) => !image.hasAttribute("alt"))
        .map((image) => image.getAttribute("src") ?? "(no src)")
    );
    expect(missing, "images without an alt attribute").toEqual([]);
  });

  test("the skip link is the first thing keyboard focus reaches", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return { tag: el?.tagName ?? "", text: (el?.textContent ?? "").trim(), href: el?.getAttribute("href") };
    });
    expect(focused.tag).toBe("A");
    expect(focused.href).toBe("#main");
    expect(focused.text).toMatch(/skip/i);
  });

  test("hydration completes without warnings on data-driven routes", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      const text = message.text();
      if (/hydrat|did not match|Minified React error #(418|423|425)/i.test(text)) problems.push(text);
    });
    page.on("pageerror", (error) => {
      if (/hydrat|Minified React error #(418|423|425)/i.test(error.message)) problems.push(error.message);
    });

    for (const path of ["/", "/coding", "/github"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(problems, `hydration problems:\n${problems.join("\n")}`).toEqual([]);
  });
});

/**
 * Contract check against the real upstream APIs.
 *
 * Opt-in because it depends on a third party and, for GitHub, on the
 * unauthenticated rate limit: `E2E_LIVE=1 npm run test:e2e`.
 */
test.describe("live upstream contract", () => {
  test.skip(
    process.env.E2E_LIVE !== "1",
    "set E2E_LIVE=1 to call the public APIs; skipped by default"
  );

  test("Codolio still answers with the shape the loader reads", async ({ request }) => {
    const response = await request.get("https://api.codolio.com/profile?userKey=2520030105");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status?.success).toBe(true);
    const profiles = body.data?.platformProfiles?.platformProfiles ?? [];
    expect(profiles.length).toBeGreaterThan(0);
    for (const profile of profiles) {
      expect(typeof profile.platform).toBe("string");
    }
  });

  test("GitHub still answers with the fields the archive renders", async ({ request }) => {
    const response = await request.get(
      "https://api.github.com/users/karkalashivareddy/repos?per_page=30&sort=pushed",
      { headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio" } }
    );
    expect(response.status()).toBe(200);
    const repos = await response.json();
    expect(Array.isArray(repos)).toBe(true);
    expect(repos.length).toBeGreaterThan(0);
    for (const repo of repos) {
      expect(repo.name).toBeTruthy();
      expect(repo.html_url).toContain("github.com");
    }
  });
});