/** Shopify product webhook JSON (`products/create`, `products/update`). */
export function numericProductIdFromWebhookPayload(
  payload: unknown,
): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const o = payload as Record<string, unknown>;
  if (typeof o.id === "number" || typeof o.id === "string") {
    return String(o.id);
  }
  const gid = o.admin_graphql_api_id;
  if (typeof gid === "string") {
    const m = /^gid:\/\/shopify\/Product\/(\d+)$/.exec(gid);
    return m ? m[1]! : null;
  }
  return null;
}
