import prisma from "@disclo/db";
import { Worker } from "bullmq";
import {
  QUEUE_NAMES,
  defaultLocaleFromEnv,
  getBullmqQueueOptions,
  getNotificationMessages,
  reportGeneratorJobSchema,
} from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

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

    const n = getNotificationMessages(defaultLocaleFromEnv());
    const title =
      data.kind === "scan_complete"
        ? n.reportScanCompleteTitle
        : n.reportMonthlyTitle;
    const body =
      data.kind === "scan_complete"
        ? n.reportScanCompleteBody(shop.externalDomain)
        : n.reportMonthlyBody(shop.externalDomain);

    await prisma.notification.create({
      data: {
        userId: shop.ownerUserId,
        shopId: data.shopId,
        type: "report",
        title,
        body,
        link: "/app",
      },
    });

    console.info(`report-generator job ${job.id}: notification created for shop ${data.shopId}`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void reportGeneratorWorker;
