import { describe, expect, it } from "vitest";
import { parseShopifyMetaKey } from "./parse-meta-key.js";

describe("parseShopifyMetaKey", () => {
  it("splits namespace and key", () => {
    expect(parseShopifyMetaKey("eu_ai_compliance.ai_content_disclosure")).toEqual({
      namespace: "eu_ai_compliance",
      key: "ai_content_disclosure",
    });
  });

  it("rejects invalid keys", () => {
    expect(() => parseShopifyMetaKey("nonsense")).toThrow();
  });
});
