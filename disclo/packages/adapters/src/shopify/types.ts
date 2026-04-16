import type { PrismaClient } from "@disclo/db";

export interface ShopifyAdapterDeps {
  prisma: PrismaClient;
  /** Must match `ENCRYPTION_KEY` used when persisting `shops.accessToken`. */
  encryptionKey: string;
  /** Admin API version segment, e.g. `2025-01`. */
  apiVersion?: string;
}
