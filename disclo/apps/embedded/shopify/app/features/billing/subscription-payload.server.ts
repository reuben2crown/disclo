/** Shopify APP_SUBSCRIPTIONS_UPDATE webhook body (JSON). */

export type ParsedAppSubscriptionWebhook = {
  adminGraphqlApiId: string;
  name: string;
  /** Raw status from Shopify (e.g. ACTIVE, CANCELLED). */
  status: string;
};

/** Display name sent to `appSubscriptionCreate` and echoed in webhooks. */
export function formatDiscloSubscriptionName(planSlug: string): string {
  const slug = planSlug.trim().toLowerCase();
  return `Disclo (${slug})`;
}

/** Inverse of {@link formatDiscloSubscriptionName}. */
export function parsePlanSlugFromDiscloSubscriptionName(
  name: string,
): string | null {
  const m = /^Disclo \((\w+)\)\s*$/i.exec(name.trim());
  return m ? m[1]!.toLowerCase() : null;
}

export function subscriptionStatusIsLive(status: string): boolean {
  const s = status.trim().toUpperCase();
  return s === "ACTIVE" || s === "TRIAL";
}

export function subscriptionStatusIsEnded(status: string): boolean {
  const s = status.trim().toUpperCase();
  return (
    s === "CANCELLED" ||
    s === "EXPIRED" ||
    s === "DECLINED" ||
    s === "FROZEN"
  );
}

/**
 * Extracts subscription fields from webhook payload.
 * Shopify may nest under `app_subscription` or send fields at the top level.
 */
export function parseAppSubscriptionWebhookPayload(
  payload: unknown,
): ParsedAppSubscriptionWebhook | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const o = payload as Record<string, unknown>;

  const nested =
    o.app_subscription && typeof o.app_subscription === "object"
      ? (o.app_subscription as Record<string, unknown>)
      : o;

  const idRaw =
    nested.admin_graphql_api_id ?? nested.adminGraphqlApiId ?? o.admin_graphql_api_id;
  const nameRaw = nested.name ?? o.name;
  const statusRaw = nested.status ?? o.status;

  if (
    typeof idRaw !== "string" ||
    typeof nameRaw !== "string" ||
    typeof statusRaw !== "string"
  ) {
    return null;
  }

  return {
    adminGraphqlApiId: idRaw,
    name: nameRaw,
    status: statusRaw,
  };
}
