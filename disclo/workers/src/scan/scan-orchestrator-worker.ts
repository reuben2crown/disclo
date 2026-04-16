/**
 * BE-15: Consumes `scan` jobs, creates `scan_items`, fans out to `text-classify` (per-item pipeline).
 */
import prisma from "@disclo/db";
import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import {
  QUEUE_NAMES,
  createPlanFeatureService,
  getBullmqQueueOptions,
  greenClaimsLlmAllowedFromFeatures,
  resolveRegulationsForMarkets,
  scanOrchestratorJobSchema,
} from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

const redisOpts = getBullmqQueueOptions(requireRedisUrl());

/** Producers enqueue orchestration jobs here (API, auto-scan, etc.). */
export const scanQueue = new Queue(QUEUE_NAMES.scan, redisOpts);

export const textClassifyQueue = new Queue(
  QUEUE_NAMES.textClassify,
  redisOpts,
);

export const scanOrchestratorWorker = new Worker(
  QUEUE_NAMES.scan,
  async (job) => {
    const data = scanOrchestratorJobSchema.parse(job.data);

    const redisUrl = requireRedisUrl();
    const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
    try {
      const { getFeatures } = createPlanFeatureService(prisma, redis);
      const features = await getFeatures(data.shopId);
      const planAllowsLlm = greenClaimsLlmAllowedFromFeatures(features);

      const settings = await prisma.shopSettings.findUnique({
        where: { shopId: data.shopId },
      });
      const targetMarkets = settings?.targetMarkets ?? ["EU"];
      const regulations = resolveRegulationsForMarkets(targetMarkets).map(
        (c) => c.code,
      );

      await prisma.scan.update({
        where: { id: data.scanId },
        data: {
          status: "running",
          startedAt: new Date(),
          totalItems: data.requests.length,
        },
      });

      for (const req of data.requests) {
        const item = await prisma.scanItem.create({
          data: {
            scanId: data.scanId,
            shopId: data.shopId,
            platform: req.platform,
            contentId: req.external_id,
            contentType: req.content_type,
            field: "body",
            contentHash: req.metadata.content_hash,
            riskLevel: "none",
            status: "pending",
            regulations,
            flaggedClaims: [],
          },
        });

        await textClassifyQueue.add(
          "classify-item",
          {
            scanId: data.scanId,
            shopId: data.shopId,
            scanItemId: item.id,
            request: req,
            planAllowsLlm,
          },
          { removeOnComplete: 1000, removeOnFail: 5000 },
        );
      }
    } finally {
      await redis.quit();
    }
  },
  redisOpts,
);

void scanOrchestratorWorker;
void textClassifyQueue;
