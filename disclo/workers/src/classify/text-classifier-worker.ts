/**
 * BE-16 (+ BE-17/BE-18 logic in-process): per-item classification (GPTZero + Hive + claims).
 * Image/claims queues remain for future split; pipeline runs here for MVP.
 */
import prisma from "@disclo/db";
import { Prisma } from "@prisma/client";
import { Worker } from "bullmq";
import {
  QUEUE_NAMES,
  classifyPlainText,
  classifyImageUrl,
  flagGreenClaimsByKeywords,
  substantiateGreenClaims,
  finalizeScanIfComplete,
  getBullmqQueueOptions,
  maxQualityTier,
  scanItemClassifyJobSchema,
  type QualityTier,
} from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`${name} is required for classification worker`);
  }
  return v;
}

export const textClassifierWorker = new Worker(
  QUEUE_NAMES.textClassify,
  async (job) => {
    const p = scanItemClassifyJobSchema.parse(job.data);
    const gptKey = requireEnv("GPTZERO_API_KEY");
    const hiveKey = process.env.HIVE_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const body = p.request.fields.body ?? "";
    const title = p.request.fields.title ?? "";
    const combinedText = `${title}\n${body}`.trim();

    let textAi = 0;
    let textRisk: QualityTier = "none";
    if (combinedText.length > 0) {
      const tr = await classifyPlainText({
        text: combinedText,
        apiKey: gptKey,
      });
      textAi = tr.aiProbability ?? 0;
      textRisk = tr.riskLevel;
    }

    let imageAi = 0;
    let imageRisk: QualityTier = "none";
    const urls = p.request.fields.image_urls ?? [];
    if (hiveKey && urls.length > 0) {
      for (const imageUrl of urls) {
        const ir = await classifyImageUrl({
          imageUrl,
          apiKey: hiveKey,
        });
        if (ir.ok) {
          imageAi = Math.max(imageAi, ir.aiProbability);
          imageRisk = maxQualityTier(imageRisk, ir.riskLevel);
        } else {
          imageRisk = maxQualityTier(imageRisk, ir.riskLevel);
        }
      }
    }

    const kw = flagGreenClaimsByKeywords(combinedText);
    let flaggedClaims = kw.flagged_claims.map(
      (f: { category: string; term: string }) => `${f.category}:${f.term}`,
    );
    let claimsRisk: QualityTier =
      kw.flagged_claims.length > 0 ? "review" : "none";

    const planAllowsLlm = p.planAllowsLlm === true;
    if (
      planAllowsLlm &&
      anthropicKey &&
      kw.flagged_claims.length > 0
    ) {
      const phrases = kw.flagged_claims.map(
        (f: { term: string }) => f.term,
      );
      const sub = await substantiateGreenClaims({
        productDescription: combinedText,
        flaggedPhrases: phrases,
        planAllowsLlm: true,
        apiKey: anthropicKey,
      });
      const bare = sub.filter((s) => s.status === "BARE_ASSERTION").length;
      if (bare > 0) {
        claimsRisk = maxQualityTier(claimsRisk, "review");
      }
      flaggedClaims = sub.map(
        (s: { phrase: string; status: string }) =>
          `llm:${s.phrase}:${s.status}`,
      );
    }

    const aiProbability = Math.max(textAi, imageAi);
    const riskLevel = maxQualityTier(
      maxQualityTier(textRisk, imageRisk),
      claimsRisk,
    );

    await prisma.scanItem.update({
      where: { id: p.scanItemId },
      data: {
        aiProbability: new Prisma.Decimal(aiProbability),
        riskLevel,
        flaggedClaims,
        status: "classified",
      },
    });

    await finalizeScanIfComplete(prisma, p.scanId);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void textClassifierWorker;
