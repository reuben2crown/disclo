import { defineConfig, devices } from "@playwright/test";

/**
 * E2E runs against a live dev or preview URL. Start the app first, for example:
 *   cd disclo && pnpm --filter disclo-shopify dev
 * Then set the URL the CLI prints (tunnel or localhost), e.g.:
 *   set PLAYWRIGHT_BASE_URL=https://xxxx.ngrok-free.app
 *   pnpm --filter disclo-shopify test:e2e
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
