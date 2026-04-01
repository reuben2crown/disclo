/**
 * Ensures Prisma can load `schema.prisma` (which references `env("DATABASE_URL")`)
 * during `prisma generate` after a fresh clone, without requiring a real database TCP connection.
 * For local development and production, set `DATABASE_URL` to your Supabase connection string.
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://placeholder:placeholder@127.0.0.1:5432/postgres";
}

execSync("pnpm --filter @disclo/db exec prisma generate", {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: process.env,
});
