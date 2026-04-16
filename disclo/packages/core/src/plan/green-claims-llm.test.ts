import { describe, expect, it } from "vitest";
import { greenClaimsLlmAllowedFromFeatures } from "./green-claims-llm.js";
import type { PlanFeatures } from "./plan-features.js";

const base: PlanFeatures = {
  id: "p",
  name: "pro",
  displayName: "Pro",
  maxItemsPerScan: 100,
  textDetection: true,
  imageDetection: true,
  fixDashboard: true,
  auditLog: true,
  auditLogPdfExport: true,
  monthlyAutoScan: true,
  rewriteEngine: true,
  maxShops: 3,
  whiteLabelReports: false,
  apiAccess: true,
  apiMonthlyCalls: null,
  teamMembers: 3,
  slaSupport: "email",
};

describe("greenClaimsLlmAllowedFromFeatures", () => {
  it("returns false for null features", () => {
    expect(greenClaimsLlmAllowedFromFeatures(null)).toBe(false);
  });

  it("returns false when rewriteEngine is false", () => {
    expect(
      greenClaimsLlmAllowedFromFeatures({ ...base, rewriteEngine: false }),
    ).toBe(false);
  });

  it("returns true when rewriteEngine is true", () => {
    expect(greenClaimsLlmAllowedFromFeatures(base)).toBe(true);
  });
});
