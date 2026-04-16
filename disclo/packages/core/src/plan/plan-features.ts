import { z } from "zod";

/** Mirrors `plans` row scalars used for gating (cache JSON + merge). */
export interface PlanRowSnapshot {
  id: string;
  name: string;
  displayName: string;
  maxItemsPerScan: number | null;
  textDetection: boolean;
  imageDetection: boolean;
  fixDashboard: boolean;
  auditLog: boolean;
  auditLogPdfExport: boolean;
  monthlyAutoScan: boolean;
  rewriteEngine: boolean;
  maxShops: number | null;
  whiteLabelReports: boolean;
  apiAccess: boolean;
  apiMonthlyCalls: number | null;
  teamMembers: number;
  slaSupport: string;
}

/** Effective plan capabilities for a shop (base plan + active override). */
export type PlanFeatures = PlanRowSnapshot;

const overridePatchSchema = z
  .object({
    maxItemsPerScan: z.number().int().positive().nullable().optional(),
    textDetection: z.boolean().optional(),
    imageDetection: z.boolean().optional(),
    fixDashboard: z.boolean().optional(),
    auditLog: z.boolean().optional(),
    auditLogPdfExport: z.boolean().optional(),
    monthlyAutoScan: z.boolean().optional(),
    rewriteEngine: z.boolean().optional(),
    maxShops: z.number().int().positive().nullable().optional(),
    whiteLabelReports: z.boolean().optional(),
    apiAccess: z.boolean().optional(),
    apiMonthlyCalls: z.number().int().positive().nullable().optional(),
    teamMembers: z.number().int().positive().optional(),
    slaSupport: z.string().min(1).optional(),
  });

export type PlanOverridePatch = z.infer<typeof overridePatchSchema>;

export interface PlanOverrideInput {
  overrides: unknown;
  expiresAt: Date | null;
}

function overrideIsActive(expiresAt: Date | null): boolean {
  if (!expiresAt) {
    return true;
  }
  return expiresAt.getTime() > Date.now();
}

/** Parses `plan_overrides.overrides` JSON; unknown keys are stripped. */
export function parsePlanOverridePatch(raw: unknown): PlanOverridePatch {
  if (raw == null || typeof raw !== "object") {
    return {};
  }
  const parsed = overridePatchSchema.safeParse(raw);
  return parsed.success ? parsed.data : {};
}

/** Builds effective features from plan row + optional active override. */
export function buildPlanFeatures(
  plan: PlanRowSnapshot,
  planOverride: PlanOverrideInput | null,
): PlanFeatures {
  const base: PlanFeatures = { ...plan };

  if (!planOverride || !overrideIsActive(planOverride.expiresAt)) {
    return base;
  }

  const patch = parsePlanOverridePatch(planOverride.overrides);
  return { ...base, ...patch };
}
