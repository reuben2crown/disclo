import { describe, expect, it } from "vitest";
import {
  buildPlanFeatures,
  parsePlanOverridePatch,
  type PlanOverrideInput,
  type PlanRowSnapshot,
} from "./plan-features.js";

const freePlan: PlanRowSnapshot = {
  id: "p1",
  name: "free",
  displayName: "Free",
  maxItemsPerScan: 50,
  textDetection: true,
  imageDetection: false,
  fixDashboard: false,
  auditLog: false,
  auditLogPdfExport: false,
  monthlyAutoScan: false,
  rewriteEngine: false,
  maxShops: 1,
  whiteLabelReports: false,
  apiAccess: false,
  apiMonthlyCalls: null,
  teamMembers: 1,
  slaSupport: "community",
};

describe("parsePlanOverridePatch", () => {
  it("returns empty object for null", () => {
    expect(parsePlanOverridePatch(null)).toEqual({});
  });

  it("parses known boolean and numeric overrides", () => {
    expect(
      parsePlanOverridePatch({
        imageDetection: true,
        maxItemsPerScan: 200,
      }),
    ).toEqual({ imageDetection: true, maxItemsPerScan: 200 });
  });

  it("drops unknown keys", () => {
    expect(
      parsePlanOverridePatch({
        imageDetection: true,
        unknown: "x",
      } as Record<string, unknown>),
    ).toEqual({ imageDetection: true });
  });
});

describe("buildPlanFeatures", () => {
  it("maps plan row only when override is inactive", () => {
    const f = buildPlanFeatures(freePlan, null);
    expect(f.id).toBe("p1");
    expect(f.name).toBe("free");
    expect(f.maxItemsPerScan).toBe(50);
    expect(f.imageDetection).toBe(false);
  });

  it("merges active override JSON over plan row", () => {
    const override: PlanOverrideInput = {
      overrides: { imageDetection: true, maxItemsPerScan: 999 },
      expiresAt: null,
    };
    const f = buildPlanFeatures(freePlan, override);
    expect(f.imageDetection).toBe(true);
    expect(f.maxItemsPerScan).toBe(999);
    expect(f.textDetection).toBe(true);
  });

  it("ignores override when expiresAt is in the past", () => {
    const past = new Date(Date.now() - 60_000);
    const override: PlanOverrideInput = {
      overrides: { imageDetection: true },
      expiresAt: past,
    };
    const f = buildPlanFeatures(freePlan, override);
    expect(f.imageDetection).toBe(false);
  });

  it("applies override when expiresAt is in the future", () => {
    const future = new Date(Date.now() + 3600_000);
    const override: PlanOverrideInput = {
      overrides: { rewriteEngine: true },
      expiresAt: future,
    };
    const f = buildPlanFeatures(freePlan, override);
    expect(f.rewriteEngine).toBe(true);
  });
});
