import { describe, expect, it } from "vitest";
import {
  formatDiscloSubscriptionName,
  parseAppSubscriptionWebhookPayload,
  parsePlanSlugFromDiscloSubscriptionName,
  subscriptionStatusIsEnded,
  subscriptionStatusIsLive,
} from "./subscription-payload.server.js";

describe("formatDiscloSubscriptionName", () => {
  it("wraps slug in Disclo (slug) form", () => {
    expect(formatDiscloSubscriptionName("basic")).toBe("Disclo (basic)");
    expect(formatDiscloSubscriptionName("PRO")).toBe("Disclo (pro)");
  });
});

describe("parsePlanSlugFromDiscloSubscriptionName", () => {
  it("returns slug for canonical names", () => {
    expect(parsePlanSlugFromDiscloSubscriptionName("Disclo (basic)")).toBe(
      "basic",
    );
    expect(parsePlanSlugFromDiscloSubscriptionName("DISCLO (agency)")).toBe(
      "agency",
    );
  });
  it("returns null for unexpected strings", () => {
    expect(parsePlanSlugFromDiscloSubscriptionName("Basic plan")).toBeNull();
    expect(parsePlanSlugFromDiscloSubscriptionName("")).toBeNull();
  });
});

describe("parseAppSubscriptionWebhookPayload", () => {
  it("reads nested app_subscription", () => {
    const parsed = parseAppSubscriptionWebhookPayload({
      app_subscription: {
        admin_graphql_api_id: "gid://shopify/AppSubscription/1",
        name: "Disclo (pro)",
        status: "ACTIVE",
      },
    });
    expect(parsed).toEqual({
      adminGraphqlApiId: "gid://shopify/AppSubscription/1",
      name: "Disclo (pro)",
      status: "ACTIVE",
    });
  });
  it("reads flat payload", () => {
    const parsed = parseAppSubscriptionWebhookPayload({
      admin_graphql_api_id: "gid://shopify/AppSubscription/2",
      name: "Disclo (basic)",
      status: "CANCELLED",
    });
    expect(parsed?.status).toBe("CANCELLED");
  });
  it("returns null when required fields missing", () => {
    expect(parseAppSubscriptionWebhookPayload({})).toBeNull();
    expect(parseAppSubscriptionWebhookPayload(null)).toBeNull();
  });
});

describe("subscription status helpers", () => {
  it("treats ACTIVE and TRIAL as live", () => {
    expect(subscriptionStatusIsLive("active")).toBe(true);
    expect(subscriptionStatusIsLive("trial")).toBe(true);
    expect(subscriptionStatusIsLive("cancelled")).toBe(false);
  });
  it("treats terminal statuses as ended", () => {
    expect(subscriptionStatusIsEnded("cancelled")).toBe(true);
    expect(subscriptionStatusIsEnded("expired")).toBe(true);
    expect(subscriptionStatusIsEnded("active")).toBe(false);
  });
});
