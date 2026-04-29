import prisma from "@disclo/db";
import { Queue, Worker } from "bullmq";
import {
  QUEUE_NAMES,
  evidenceVerifyJobSchema,
  getBullmqQueueOptions,
  notificationDispatchJobSchema,
} from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

function evaluateEvidenceStatus(input: {
  certificateNumber: string | null;
  referenceUrl: string | null;
}): "verified" | "expired" {
  const cert = (input.certificateNumber ?? "").toUpperCase();
  const url = (input.referenceUrl ?? "").toLowerCase();
  if (cert.startsWith("EXP-") || url.includes("expired")) {
    return "expired";
  }
  return "verified";
}

const redisUrl = requireRedisUrl();
const notificationQueue = new Queue(
  QUEUE_NAMES.notificationDispatch,
  getBullmqQueueOptions(redisUrl),
);

export const evidenceVerifierWorker = new Worker(
  QUEUE_NAMES.evidenceVerify,
  async (job) => {
    const parsed = evidenceVerifyJobSchema.safeParse(job.data);
    if (!parsed.success) {
      console.warn(
        `evidence-verifier job ${job.id}: invalid payload`,
        parsed.error.flatten(),
      );
      return;
    }
    const now = new Date();
    const due = await prisma.evidenceItem.findMany({
      where: {
        OR: [
          { verificationStatus: "pending" },
          { verificationStatus: "review" },
          {
            verificationStatus: "verified",
            nextVerificationAt: { lte: now },
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        scopeShopId: true,
        certificateNumber: true,
        referenceUrl: true,
      },
      take: parsed.data.limit ?? 200,
    });

    for (const evidence of due) {
      const nextStatus = evaluateEvidenceStatus({
        certificateNumber: evidence.certificateNumber,
        referenceUrl: evidence.referenceUrl,
      });
      const nextVerificationAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await prisma.evidenceItem.update({
        where: { id: evidence.id },
        data: {
          verificationStatus: nextStatus,
          verifiedAt: now,
          nextVerificationAt,
        },
      });

      if (nextStatus !== "expired") {
        continue;
      }

      const links = await prisma.claimEvidence.findMany({
        where: { evidenceItemId: evidence.id },
        select: { scanItemId: true },
      });
      if (links.length) {
        await prisma.scanItem.updateMany({
          where: {
            id: { in: links.map((l) => l.scanItemId) },
          },
          data: { status: "classified" },
        });
      }

      const dispatch = notificationDispatchJobSchema.parse({
        userId: evidence.userId,
        shopId: evidence.scopeShopId ?? undefined,
        kind: "evidence_expiry",
        link: "/app/evidence",
      });
      await notificationQueue.add("dispatch", dispatch, {
        removeOnComplete: true,
        removeOnFail: 50,
      });
    }
    console.info(`evidence-verifier job ${job.id}: processed ${due.length} evidence items`);
  },
  getBullmqQueueOptions(redisUrl),
);

void evidenceVerifierWorker;
