/**
 * Runs `shopify app dev` with explicit localhost ports so this app can sit next to
 * other Shopify apps on the same machine.
 *
 * Optional env (omit by default so the CLI uses its normal tunnel + ports):
 * - SHOPIFY_DEV_LOCALHOST_PORT — if set, passed as `--localhost-port` (only when you need a
 *   fixed app port next to another dev app; can interact with Shopify localhost / TLS prompts)
 * - SHOPIFY_DEV_THEME_APP_EXTENSION_PORT — if set, passed as `--theme-app-extension-port`
 *   (set to 9294, 9295, … when another app already uses 9293)
 * - VITE_HMR_PORT or SHOPIFY_VITE_HMR_PORT (64999) — Vite HMR websocket when SHOPIFY_APP_URL is localhost
 *
 * Example second instance: SHOPIFY_DEV_LOCALHOST_PORT=3001 SHOPIFY_DEV_THEME_APP_EXTENSION_PORT=9294
 * SHOPIFY_VITE_HMR_PORT=65000 pnpm dev
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

if (!process.env.VITE_HMR_PORT && process.env.SHOPIFY_VITE_HMR_PORT) {
  process.env.VITE_HMR_PORT = process.env.SHOPIFY_VITE_HMR_PORT;
}

/** `pnpm dev -- --flags` leaves a standalone `--` in argv; Shopify CLI rejects it. */
const forward = process.argv.slice(2).filter((arg) => arg !== "--");

const args = ["exec", "shopify", "app", "dev"];

const localhostPort = process.env.SHOPIFY_DEV_LOCALHOST_PORT?.trim();
if (localhostPort) {
  args.push("--localhost-port", localhostPort);
}

const themePort = process.env.SHOPIFY_DEV_THEME_APP_EXTENSION_PORT?.trim();
if (themePort) {
  args.push("--theme-app-extension-port", themePort);
}

args.push(...forward);

const isWin = process.platform === "win32";
const child = spawn(isWin ? "pnpm.cmd" : "pnpm", args, {
  cwd: appRoot,
  stdio: "inherit",
  env: process.env,
  // .cmd resolution on Windows is more reliable with a shell.
  shell: isWin,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
