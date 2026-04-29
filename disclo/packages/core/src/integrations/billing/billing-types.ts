export type BillingLifecycleStatus = "live" | "ended" | "noop";

export interface BillingFinalizeInput {
  shopDomain: string;
  providerSubscriptionId: string | null;
  providerPlanSlug: string | null;
  lifecycleStatus: BillingLifecycleStatus;
}

export type BillingFinalizeResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: string;
    };
