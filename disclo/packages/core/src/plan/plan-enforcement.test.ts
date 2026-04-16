import { describe, expect, it } from "vitest";
import { PlanError } from "../utils/errors.js";
import type { PlanFeatures } from "./plan-features.js";
import { requireFeature, requireWithinLimit } from "./plan-enforcement.js";

const proFeatures: PlanFeatures = {
  id: "p",
  name: "pro",
  displayName: "Pro",
  maxItemsPerScan: 1500,
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

const freeFeatures: PlanFeatures = {
  ...proFeatures,
  name: "free",
  displayName: "Free",
  maxItemsPerScan: 50,
  imageDetection: false,
  fixDashboard: false,
  auditLog: false,
  auditLogPdfExport: false,
  monthlyAutoScan: false,
  rewriteEngine: false,
  maxShops: 1,
  apiAccess: false,
  teamMembers: 1,
  slaSupport: "community",
};

describe("requireFeature", () => {
  it("resolves when feature is enabled", () => {
    expect(() =>
      requireFeature(proFeatures, "imageDetection"),
    ).not.toThrow();
  });

  it("throws PlanError when feature is disabled", () => {
    expect(() => requireFeature(freeFeatures, "imageDetection")).toThrow(
      PlanError,
    );
  });

  it("uses merchant-facing copy for disabled features", () => {
    expect(() => requireFeature(freeFeatures, "imageDetection")).toThrowError(
      /AI image detection.*Shopify admin/s,
    );
  });

  it("uses French copy when locale is fr", () => {
    expect(() =>
      requireFeature(freeFeatures, "imageDetection", "fr"),
    ).toThrowError(/Détection.*images IA/);
  });
});

describe("requireWithinLimit", () => {
  it("allows usage under maxItemsPerScan", () => {
    expect(() =>
      requireWithinLimit(freeFeatures, "maxItemsPerScan", 49),
    ).not.toThrow();
  });

  it("throws when usage reaches limit for maxItemsPerScan", () => {
    expect(() =>
      requireWithinLimit(freeFeatures, "maxItemsPerScan", 50),
    ).toThrow(PlanError);
  });

  it("uses merchant-facing copy when maxItemsPerScan is reached", () => {
    expect(() =>
      requireWithinLimit(freeFeatures, "maxItemsPerScan", 50),
    ).toThrowError(/50.*products.*plan/s);
  });

  it("uses French copy for limits when locale is fr", () => {
    expect(() =>
      requireWithinLimit(freeFeatures, "maxItemsPerScan", 50, "fr"),
    ).toThrowError(/50.*produits.*offre/s);
  });

  it("treats null limit as unlimited for maxItemsPerScan", () => {
    const agency = { ...proFeatures, maxItemsPerScan: null };
    expect(() =>
      requireWithinLimit(agency, "maxItemsPerScan", 1_000_000),
    ).not.toThrow();
  });

  it("enforces teamMembers as maximum count", () => {
    expect(() =>
      requireWithinLimit(proFeatures, "teamMembers", 2),
    ).not.toThrow();
    expect(() => requireWithinLimit(proFeatures, "teamMembers", 3)).toThrow(
      PlanError,
    );
  });

  it("enforces apiMonthlyCalls when set", () => {
    const withCap = { ...proFeatures, apiMonthlyCalls: 100 };
    expect(() =>
      requireWithinLimit(withCap, "apiMonthlyCalls", 99),
    ).not.toThrow();
    expect(() =>
      requireWithinLimit(withCap, "apiMonthlyCalls", 100),
    ).toThrow(PlanError);
  });

  it("treats null apiMonthlyCalls as unlimited", () => {
    expect(() =>
      requireWithinLimit(proFeatures, "apiMonthlyCalls", 999_999),
    ).not.toThrow();
  });
});
