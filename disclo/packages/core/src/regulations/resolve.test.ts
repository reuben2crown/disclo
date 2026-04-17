import { describe, expect, it } from "vitest";
import { REGULATION_CODES } from "./configs.js";
import { resolveRegulationsForMarkets } from "./resolve.js";

describe("resolveRegulationsForMarkets", () => {
  it("returns all five regulation codes as a stable set", () => {
    expect(REGULATION_CODES).toHaveLength(5);
    expect(new Set(REGULATION_CODES).size).toBe(5);
  });

  it("EU adds AI content rules + EU green claims", () => {
    const codes = resolveRegulationsForMarkets(["EU"]).map((c) => c.code);
    expect(codes).toContain("eu_ai_act_art50");
    expect(codes).toContain("eu_green_claims");
    expect(codes).not.toContain("florida_ai");
  });

  it("US-FL adds Florida AI + FTC green", () => {
    const codes = resolveRegulationsForMarkets(["US-FL"]).map((c) => c.code);
    expect(codes).toContain("florida_ai");
    expect(codes).toContain("ftc_green");
  });

  it("US-NY adds NY synthetic + FTC green", () => {
    const codes = resolveRegulationsForMarkets(["US-NY"]).map((c) => c.code);
    expect(codes).toContain("ny_synthetic");
    expect(codes).toContain("ftc_green");
  });

  it("US adds FTC green only (federal green-claims baseline)", () => {
    const codes = resolveRegulationsForMarkets(["US"]).map((c) => c.code);
    expect(codes).toEqual(["ftc_green"]);
  });

  it("dedupes when multiple markets overlap", () => {
    const codes = resolveRegulationsForMarkets(["EU", "US", "US-FL"]).map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toContain("eu_ai_act_art50");
    expect(codes).toContain("florida_ai");
    expect(codes).toContain("ftc_green");
  });

  it("normalizes case and trims market tokens", () => {
    const a = resolveRegulationsForMarkets(["  eu "]).map((c) => c.code);
    const b = resolveRegulationsForMarkets(["EU"]).map((c) => c.code);
    expect(a).toEqual(b);
  });
});
