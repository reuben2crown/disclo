import type { LabelInstruction, PlatformAdapter, ScanRequest } from "@disclo/core";

/**
 * Shopify adapter — thin I/O. Business logic lives in `packages/core`.
 * Full OAuth + GraphQL wiring is implemented in `apps/shopify`.
 */
export function createShopifyAdapter(): PlatformAdapter {
  return {
    async fetchContent(_shopId: string, _cursor?: string): Promise<ScanRequest[]> {
      throw new Error("ShopifyAdapter.fetchContent not wired — use apps/shopify server utilities");
    },
    async writeLabel(_instruction: LabelInstruction): Promise<void> {
      throw new Error("ShopifyAdapter.writeLabel not wired — use apps/shopify server utilities");
    },
    async registerWebhooks(_shopId: string): Promise<void> {
      throw new Error("ShopifyAdapter.registerWebhooks not wired");
    },
    async revokeAccess(_shopId: string): Promise<void> {
      void _shopId;
    },
  };
}
