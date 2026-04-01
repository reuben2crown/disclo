import type { RegulationConfig } from "../types.js";
import { REGULATION_CONFIGS } from "./configs.js";

/**
 * Normalizes `shop_settings.target_markets` values (e.g. EU, US, US-FL, US-NY).
 */
export function normalizeMarketToken(raw: string): string {
  return raw.trim().toUpperCase();
}

/**
 * Returns applicable regulation configs for the shop's target markets.
 * Order is stable: same as `REGULATION_CONFIGS` definition order, filtered.
 */
export function resolveRegulationsForMarkets(targetMarkets: readonly string[]): RegulationConfig[] {
  const markets = new Set(targetMarkets.map(normalizeMarketToken));
  const want = new Set<string>();

  if (markets.has("EU")) {
    want.add("eu_ai_act_art50");
    want.add("eu_green_claims");
  }
  if (markets.has("US-FL")) {
    want.add("florida_ai");
  }
  if (markets.has("US-NY")) {
    want.add("ny_synthetic");
  }
  if (markets.has("US") || markets.has("US-FL") || markets.has("US-NY")) {
    want.add("ftc_green");
  }

  return REGULATION_CONFIGS.filter((c) => want.has(c.code));
}
