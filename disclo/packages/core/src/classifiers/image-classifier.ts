import type { QualityTier } from "../models/types.js";
import { AiDetectorGateway } from "../integrations/ai-detector/ai-detector-gateway.js";
import { ImageClassification } from "../integrations/ai-detector/ai-detector-contract.js";

export type ImageClassificationResult = {
  ok: Boolean;
  aiProbability: number | null;
  riskLevel: QualityTier;
  imageUrl: string;
  provider: string;
  classifiedAt: Date;
  /** Worker should requeue with ~1h delay when true. */
  retryable: boolean;
};

/** Same 0.50 / 0.75 bands as text (REQUIREMENTS §7.1–7.2). */
export function mapImageScoreToRiskLevel(score: number): QualityTier {
  if (score >= 0.75) {
    return "high";
  }
  if (score >= 0.5) {
    return "review";
  }
  return "none";
}

function extractAiGeneratedScore(output: { time: number, classes: ImageClassification[] }[]): number {
  for (const frame of output) {
    const classes = frame.classes ?? [];
    for (const c of classes) {
      if (c.class.toLowerCase() === "ai_generated") {
        return Math.min(1, Math.max(0, c.score));
      }
    }
  }
  return 0;
}

/**
 * Hive synchronous image moderation (`POST /api/v2/task/sync` with `image_url`).
 * On transport/parse failure: **never** returns `none`; `riskLevel` is at least `review` (REQUIREMENTS §7.2).
 */
export async function classifyImageUrl(storeId: string, requestId: string, imageUrl: string): Promise<ImageClassificationResult> {
  const scanResult = await AiDetectorGateway.executeImageDetector(storeId, requestId, imageUrl);

  if (!scanResult.ok) {
    return {
      ok: false,
      aiProbability: null,
      riskLevel: "review",
      imageUrl: imageUrl,
      provider: scanResult.provider,
      classifiedAt: scanResult.scanAt ?? new Date(),
      retryable: true,
    };
  }

  const aiProb = extractAiGeneratedScore(scanResult.frames ?? []);
  const riskLevel = mapImageScoreToRiskLevel(aiProb);

  return {
    ok: true,
    aiProbability: aiProb,
    riskLevel,
    imageUrl: scanResult.imageUrl,
    provider: scanResult.provider,
    classifiedAt: scanResult.scanAt ?? new Date(),
    retryable: false
  };
}
