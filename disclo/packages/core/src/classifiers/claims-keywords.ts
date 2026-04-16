/**
 * Pass 1 — keyword rules for green claims (REQUIREMENTS §7.3).
 */

export type GreenClaimCategory =
  | "environmental"
  | "carbon"
  | "materials"
  | "certifications_unverified";

export interface FlaggedGreenClaim {
  category: GreenClaimCategory;
  /** Matched phrase (lowercase normalized for multi-word). */
  term: string;
  startIndex: number;
  endIndex: number;
}

export interface GreenClaimsKeywordResult {
  flagged_claims: FlaggedGreenClaim[];
}

/** Ordered: longest match wins per category pass (simple overlap: skip contained). */
const RULES: ReadonlyArray<{
  category: GreenClaimCategory;
  phrases: readonly string[];
}> = [
  {
    category: "environmental",
    phrases: [
      "environmentally friendly",
      "eco-friendly",
      "planet-friendly",
      "nature-safe",
      "sustainable",
      "green",
    ],
  },
  {
    category: "carbon",
    phrases: [
      "carbon neutral",
      "carbon-neutral",
      "carbon free",
      "net zero",
      "net-zero",
      "climate positive",
    ],
  },
  {
    category: "materials",
    phrases: [
      "ocean plastic",
      "zero-waste",
      "plastic-free",
      "upcycled",
      "compostable",
      "biodegradable",
      "recycled",
    ],
  },
  {
    category: "certifications_unverified",
    phrases: ["certified organic", "b-corp", "fair trade"],
  },
];

export const GREEN_CLAIM_CATEGORIES: GreenClaimCategory[] = [
  "environmental",
  "carbon",
  "materials",
  "certifications_unverified",
];

function normalizeText(s: string): string {
  return s.toLowerCase();
}

/**
 * Scans product description text for green-claim keywords (four categories).
 */
export function flagGreenClaimsByKeywords(text: string): GreenClaimsKeywordResult {
  const hay = normalizeText(text);
  const flagged: FlaggedGreenClaim[] = [];
  const covered: Array<{ start: number; end: number }> = [];

  function overlaps(start: number, end: number): boolean {
    return covered.some(
      (c) => !(end <= c.start || start >= c.end),
    );
  }

  const sortedRules = [...RULES].sort((a, b) => {
    const maxA = Math.max(...a.phrases.map((p) => p.length));
    const maxB = Math.max(...b.phrases.map((p) => p.length));
    return maxB - maxA;
  });

  for (const rule of sortedRules) {
    const phrases = [...rule.phrases].sort((a, b) => b.length - a.length);
    for (const phrase of phrases) {
      const needle = phrase.toLowerCase();
      let from = 0;
      while (from < hay.length) {
        const idx = hay.indexOf(needle, from);
        if (idx === -1) {
          break;
        }
        const end = idx + needle.length;
        if (!overlaps(idx, end)) {
          flagged.push({
            category: rule.category,
            term: phrase,
            startIndex: idx,
            endIndex: end,
          });
          covered.push({ start: idx, end: end });
        }
        from = idx + 1;
      }
    }
  }

  flagged.sort((a, b) => a.startIndex - b.startIndex);
  return { flagged_claims: flagged };
}
