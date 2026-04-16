import { normalizeMarketToken } from "@disclo/core/regulations";

const ALLOWED = new Set(["EU", "US", "US-FL", "US-NY"]);

/**
 * Normalized, de-duplicated target markets from form checkbox values.
 * Unknown tokens are dropped.
 */
export function parseTargetMarketsFromForm(
  entries: FormDataEntryValue[],
): string[] {
  return [
    ...new Set(
      entries
        .map((v) => normalizeMarketToken(String(v)))
        .filter((m) => ALLOWED.has(m)),
    ),
  ];
}
