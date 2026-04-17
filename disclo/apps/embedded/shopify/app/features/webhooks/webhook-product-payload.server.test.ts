import { describe, expect, it } from "vitest";
import { numericProductIdFromWebhookPayload } from "./webhook-product-payload.server.js";

describe("numericProductIdFromWebhookPayload", () => {
  it("reads numeric id", () => {
    expect(numericProductIdFromWebhookPayload({ id: 42 })).toBe("42");
  });

  it("reads GraphQL gid", () => {
    expect(
      numericProductIdFromWebhookPayload({
        admin_graphql_api_id: "gid://shopify/Product/99",
      }),
    ).toBe("99");
  });

  it("returns null for empty input", () => {
    expect(numericProductIdFromWebhookPayload(null)).toBeNull();
  });
});
