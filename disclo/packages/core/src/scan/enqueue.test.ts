import type { Queue } from "bullmq";
import { describe, expect, it, vi } from "vitest";
import { enqueueScanOrchestratorJob } from "./enqueue.js";

const validJob = {
  scanId: "550e8400-e29b-41d4-a716-446655440000",
  shopId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  requests: [
    {
      platform: "shopify" as const,
      shop_id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      external_id: "1",
      content_type: "product" as const,
      fields: { title: "T" },
      metadata: {
        source_url: "https://x.com/p",
        updated_at: "2026-01-01T00:00:00Z",
        content_hash: "h",
      },
    },
  ],
};

describe("enqueueScanOrchestratorJob", () => {
  it("parses payload and calls queue.add", async () => {
    const add = vi.fn().mockResolvedValue(undefined);
    const queue = { add } as unknown as Queue;

    await enqueueScanOrchestratorJob(queue, validJob);

    expect(add).toHaveBeenCalledTimes(1);
    const [name, data, opts] = add.mock.calls[0]!;
    expect(name).toBe("orchestrate");
    expect(data).toEqual(validJob);
    expect(opts).toMatchObject({ removeOnComplete: true });
  });

  it("rejects invalid jobs before add", async () => {
    const add = vi.fn();
    const queue = { add } as unknown as Queue;

    await expect(
      enqueueScanOrchestratorJob(queue, {
        ...validJob,
        scanId: "not-a-uuid",
      }),
    ).rejects.toThrow();

    expect(add).not.toHaveBeenCalled();
  });
});
