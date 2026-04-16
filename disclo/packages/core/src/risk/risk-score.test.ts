import { describe, expect, it } from "vitest";
import { computeComplianceScore } from "./risk-score.js";

describe("computeComplianceScore", () => {
  it("returns 100 for empty items", () => {
    expect(computeComplianceScore([])).toBe(100);
  });

  it("matches REQUIREMENTS §7.4 formula", () => {
    expect(
      computeComplianceScore([
        { riskLevel: "high" },
        { riskLevel: "none" },
        { riskLevel: "review" },
      ]),
    ).toBe(56);
  });

  it("applies multi-regulation weight when multiple codes on one item", () => {
    const a = computeComplianceScore([
      { riskLevel: "review", regulationCodes: ["eu_ai_act_art50"] },
    ]);
    const b = computeComplianceScore([
      {
        riskLevel: "review",
        regulationCodes: ["eu_ai_act_art50", "ftc_green"],
      },
    ]);
    expect(b).toBeLessThan(a);
  });
});
