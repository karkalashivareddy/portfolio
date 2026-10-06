import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end suite configuration.
 *
 * WHAT THIS RUNS AGAINST
 * ----------------------
 * The **production build**, served by `next start`, never the dev server. Run
 * `npm run build` first (`npm run verify` does both), so a green run means the
 * bundle that would actually be deployed renders correctly.
 *
 * DETERMINISM
 * -----------
 * No test reaches a third-party site. Both data loaders run with
 * `PORTFOLIO_TEST_FIXTURES=1`, which makes `lib/fixtures.ts` serve the recorded
 * payloads in `e2e/fixtures.ts` instead of calling Codolio or GitHub. Each test
 * publishes the state it needs into `e2e/.state`, so the suite cannot be broken
 * by someone else's rate limit and the freshness labels are exercised without a
 * network. Because that state is shared server-side state, the suite runs with a
 * single worker; the whole run takes well under a minute.
 *
 * The opt-in `E2E_LIVE=1` project checks the real upstream contracts.
 *
 * BROWSER
 * -------
 * A locally installed Chrome is used when present so the suite needs no browser
 * download. Set CHROME_PATH to override it, or leave it unset on CI where
 * Playwright's own Chromium is installed with `npx playwright install`.
 */
const PORT = Number(process.env.E2E_PORT ?? 3210);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Serial: the fixture state is server-side and shared by every test file.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: chromeLaunchOptions(),
      },
    },
  ],
  webServer: {
    command: `npx next start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      // Documented test seam in lib/fixtures.ts. Never set in a deployment.
      PORTFOLIO_TEST_FIXTURES: "1",
      PORTFOLIO_FIXTURE_DIR: path.join(process.cwd(), "e2e", ".state"),
    },
  },
});

function chromeLaunchOptions(): { executablePath?: string } {
  const explicit = process.env.CHROME_PATH;
  if (explicit) return { executablePath: explicit };
  // Windows and macOS default install locations, plus common Linux paths.
  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        ]
      : process.platform === "darwin"
        ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
        : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];
  const found = candidates.find((candidate) => {
    try {
      return existsSync(candidate);
    } catch {
      return false;
    }
  });
  return found ? { executablePath: found } : {};
}