import { describe, expect, it } from "vitest";
import {
  flagGreenClaimsByKeywords,
  GREEN_CLAIM_CATEGORIES,
} from "./claims-keywords.js";

describe("flagGreenClaimsByKeywords", () => {
  it("returns empty when no matches", () => {
    expect(flagGreenClaimsByKeywords("Just a product title.").flagged_claims).toEqual(
      [],
    );
  });

  it("flags environmental terms (case-insensitive)", () => {
    const { flagged_claims } = flagGreenClaimsByKeywords(
      "Our ECO-FRIENDLY bottle is Sustainable.",
    );
    expect(flagged_claims.length).toBeGreaterThanOrEqual(2);
    expect(flagged_claims.some((f) => f.category === "environmental")).toBe(true);
  });

  it("flags carbon terms", () => {
    const { flagged_claims } = flagGreenClaimsByKeywords(
      "Carbon neutral shipping and net-zero packaging.",
    );
    expect(flagged_claims.some((f) => f.category === "carbon")).toBe(true);
  });

  it("flags materials terms", () => {
    const { flagged_claims } = flagGreenClaimsByKeywords(
      "Made from recycled ocean plastic.",
    );
    expect(flagged_claims.some((f) => f.category === "materials")).toBe(true);
  });

  it("flags certification terms", () => {
    const { flagged_claims } = flagGreenClaimsByKeywords(
      "Certified organic cotton, B-corp supplier.",
    );
    expect(flagged_claims.some((f) => f.category === "certifications_unverified")).toBe(
      true,
    );
  });

  it("records term and index", () => {
    const text = "xx biodegradable yy";
    const { flagged_claims } = flagGreenClaimsByKeywords(text);
    const bio = flagged_claims.find((f) => f.term === "biodegradable");
    expect(bio?.startIndex).toBe(text.indexOf("biodegradable"));
  });
});

describe("GREEN_CLAIM_CATEGORIES", () => {
  it("has four categories", () => {
    expect(GREEN_CLAIM_CATEGORIES.length).toBe(4);
  });
});
