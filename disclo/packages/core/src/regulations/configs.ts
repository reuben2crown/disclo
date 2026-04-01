import type { RegulationConfig } from "../types.js";

/** Canonical regulation definitions (code constants; ship with releases, not DB). */
export const REGULATION_CONFIGS = [
  {
    code: "eu_ai_act_art50",
    displayName: "EU AI Act Article 50",
    jurisdiction: "EU",
    category: "ai_disclosure",
    appliesTo: ["text", "image"],
    badgeType: "consumer_visible",
    defaultBadgeText: "This content was created with AI assistance.",
    citationText:
      "Regulation (EU) 2024/1689 (AI Act), Article 50 — transparency obligations for deployers of certain AI systems.",
  },
  {
    code: "florida_ai",
    displayName: "Florida AI Disclosure Law",
    jurisdiction: "US-FL",
    category: "ai_disclosure",
    appliesTo: ["text", "image"],
    badgeType: "consumer_visible",
    defaultBadgeText: "This content was created with AI assistance.",
    citationText: "Florida Statutes — synthetic media and AI disclosure obligations for commercial online platforms.",
  },
  {
    code: "ny_synthetic",
    displayName: "New York Synthetic Performer / Digital Replica",
    jurisdiction: "US-NY",
    category: "ai_disclosure",
    appliesTo: ["text", "image"],
    badgeType: "consumer_visible",
    defaultBadgeText: "This content may include synthetic or digitally altered media.",
    citationText:
      "New York Labor Law / related provisions on digital replicas and synthetic performer disclosure (as applicable to your content).",
  },
  {
    code: "ftc_green",
    displayName: "FTC Green Guides (16 CFR Part 260)",
    jurisdiction: "US",
    category: "green_claims",
    appliesTo: ["text"],
    badgeType: "merchant_only",
    defaultBadgeText: "",
    citationText:
      "Federal Trade Commission — Guides for the Use of Environmental Marketing Claims (Green Guides).",
  },
  {
    code: "eu_green_claims",
    displayName: "EU Green Claims Directive (framework)",
    jurisdiction: "EU",
    category: "green_claims",
    appliesTo: ["text"],
    badgeType: "merchant_only",
    defaultBadgeText: "",
    citationText:
      "EU Directive on substantiation and communication of explicit environmental claims (Green Claims), as transposed in member states.",
  },
] as const satisfies readonly RegulationConfig[];

const byCode: ReadonlyMap<string, RegulationConfig> = new Map(
  REGULATION_CONFIGS.map((c) => [c.code, c]),
);

export const REGULATION_CODES: RegulationConfig["code"][] = REGULATION_CONFIGS.map((c) => c.code);

export function getRegulationByCode(code: string): RegulationConfig | undefined {
  return byCode.get(code);
}
