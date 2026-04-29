import type { QualityTier } from "../models/types.js";
import { ClassifierError } from "../utils/errors.js";
import { AiDetectorGateway } from "../integrations/ai-detector/ai-detector-gateway.js";
import { AiTextDetectorResult } from "../integrations/ai-detector/ai-detector-contract.js";

export interface TextClassificationResult {
  ok: boolean;
  aiProbability: number | null;
  riskLevel: QualityTier;
  insufficientText: boolean;
  sentenceBreakdown?: Array<{ sentence: string, confidence: number }>;
  provider: string;
  classifiedAt: Date;
}

/** REQUIREMENTS §7.1: none 0.00–0.49, review 0.50–0.74, high 0.75–1.00 */
export function mapAiProbabilityToRiskLevel(probability: number): QualityTier {
  if (probability >= 0.75) {
    return "high";
  }
  if (probability >= 0.5) {
    return "review";
  }
  return "none";
}

function extractProbability(data: AiTextDetectorResult): number {
  const raw = data.ai_confidence ?? 0;
  return Math.min(1, Math.max(0, raw));
}

/**
 * Classifies plain text
 * @param storeId - merchant store id
 * @param text - text to scan
 * @param requestId - request id
 * @returns result of the text classification
 */

// TODO: Add support for multiple texts `text: string | string[]` and large batches chunking. This can also happen at the provider level to keep the classifier simple.
export async function classifyPlainText(storeId: string, requestId: string, text: string): Promise<TextClassificationResult> {
  const scanResult = await AiDetectorGateway.executeTextDetector(storeId, requestId, text);

  if (!scanResult.ok) {
    throw new ClassifierError("empty scan result");
  }

  const aiProbability = extractProbability(scanResult);
  const riskLevel = mapAiProbabilityToRiskLevel(aiProbability);

  return {
    ok: scanResult.ok,
    aiProbability,
    riskLevel,
    insufficientText: !!scanResult.insufficientText,
    sentenceBreakdown: scanResult.sentenceBreakdown ?? [],
    provider: scanResult.provider,
    classifiedAt: scanResult.scanAt ?? new Date(),
  };
}
