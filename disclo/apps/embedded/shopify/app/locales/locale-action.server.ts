/**
 * Shared locale cookie commit + safe return path for POST /locale.
 * Open redirects are rejected; only same-app paths starting with `/` are allowed.
 */
export function safeLocaleReturnTo(
  raw: FormDataEntryValue | null,
  fallback: string,
): string {
  if (raw == null || typeof raw !== "string") {
    return fallback;
  }
  const t = raw.trim();
  if (!t.startsWith("/") || t.startsWith("//")) {
    return fallback;
  }
  if (t.includes("@") || /\s/.test(t)) {
    return fallback;
  }
  return t;
}
