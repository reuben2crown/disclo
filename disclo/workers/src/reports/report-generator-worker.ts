import prisma from "@disclo/db";
import { Queue, Worker } from "bullmq";
import {
  QUEUE_NAMES,
  getBullmqQueueOptions,
  notificationDispatchJobSchema,
  reportGeneratorJobSchema,
  resolveNotificationPreferences,
  shouldEnqueueScanCompleteNotification,
} from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

const redisUrl = requireRedisUrl();
const notificationQueue = new Queue(
  QUEUE_NAMES.notificationDispatch,
  getBullmqQueueOptions(redisUrl),
);

export const reportGeneratorWorker = new Worker(
  QUEUE_NAMES.report,
  async (job) => {
    const parsed = reportGeneratorJobSchema.safeParse(job.data);
    if (!parsed.success) {
      console.warn(
        `report-generator job ${job.id}: invalid payload`,
        parsed.error.flatten(),
      );
      return;
    }
    const data = parsed.data;
    const shop = await prisma.shop.findUnique({
      where: { id: data.shopId },
      select: { ownerUserId: true, externalDomain: true },
    });
    if (!shop) {
      console.warn(`report-generator job ${job.id}: shop ${data.shopId} not found`);
      return;
    }

    const settings = await prisma.shopSettings.findUnique({
      where: { shopId: data.shopId },
      select: { notifyScanComplete: true, notifyHighRisk: true },
    });
    const prefs = resolveNotificationPreferences(settings);
    if (
      data.kind === "scan_complete" &&
      !shouldEnqueueScanCompleteNotification(prefs)
    ) {
      console.info(
        `report-generator job ${job.id}: skipped scan-complete notification (shop prefs)`,
      );
      return;
    }

    const dispatch = notificationDispatchJobSchema.parse({
      userId: shop.ownerUserId,
      shopId: data.shopId,
      shopDomain: shop.externalDomain,
      kind:
        data.kind === "scan_complete"
          ? "report_scan_complete"
          : "report_monthly_summary",
      link: data.kind === "scan_complete" ? "/app/scans" : "/app/audit",
    });
    await notificationQueue.add("dispatch", dispatch, {
      removeOnComplete: true,
      removeOnFail: 50,
    });
    console.info(
      `report-generator job ${job.id}: queued notification for shop ${data.shopId}`,
    );
  },
  getBullmqQueueOptions(redisUrl),
);

void reportGeneratorWorker;
