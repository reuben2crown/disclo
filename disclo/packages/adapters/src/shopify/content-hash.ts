import { createHash } from "node:crypto";

/** Stable hash for scan dedupe (title + body + image URLs). */
export function computeContentHash(parts: string[]): string {
  return createHash("sha256").update(parts.join("\u001e"), "utf8").digest("hex");
}
