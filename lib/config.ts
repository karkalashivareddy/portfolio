/**
 * Central configuration. Everything is env-optional with safe defaults so the
 * project runs with zero setup. Secrets are only ever read server-side.
 */
const MIN = 60_000;

export const config = {
  github: {
    username: process.env.GITHUB_USERNAME || "karkalashivareddy",
    ttlMs: Number(process.env.GITHUB_TTL_MS || 15 * MIN),
    perPage: 30,
  },
  codolio: {
    userKey: process.env.CODOLIO_USER_KEY || "2520030105",
    ttlMs: Number(process.env.CODOLIO_TTL_MS || 60 * MIN),
  },
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED !== "false",
    eventIdLength: 12,
  },
  admin: {
    token: process.env.ADMIN_TOKEN || "",
    cookieName: "admin_session",
    cookieMaxAge: 60 * 60 * 12, // 12h — mirrored in the session expiry claim
    // Secure is forced on in production; flip to "false" only for local/TLS-proxy testing.
    cookieSecure: process.env.ADMIN_COOKIE_SECURE === "false" ? false : process.env.NODE_ENV === "production",
  },
  webhook: {
    githubSecret: process.env.GITHUB_WEBHOOK_SECRET || "",
  },
  readme: {
    autoUpdate: process.env.AUTO_UPDATE_README === "true",
    // After generating, always requires human approval (safe default).
    approvalRequired: process.env.README_APPROVAL_REQUIRED !== "false",
  },
  sync: {
    // Sync intervals used by the "Sync now" / schedule hinting UI.
    githubIntervalMs: Number(process.env.GITHUB_TTL_MS || 15 * MIN),
    codolioIntervalMs: Number(process.env.CODOLIO_TTL_MS || 60 * MIN),
  },
};

export function hasAdminToken(): boolean {
  return config.admin.token.length > 0;
}