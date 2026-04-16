import { z } from "zod";
import type { QualityTier } from "../models/types.js";
import { ClassifierError } from "../utils/errors.js";

/** Minimum word count before calling GPTZero (execution plan + REQUIREMENTS). */
export const GPTZERO_MIN_WORDS = 50;

export const GPTZERO_DEFAULT_BASE_URL = "https://api.gptzero.me";

const predictPath = "/v2/predict/text";

const gptZeroDocumentSchema = z.object({
  completely_generated_prob: z.number().optional(),
  average_generated_prob: z.number().optional(),
  sentences: z
    .array(
      z.object({
        generated_prob: z.number(),
        sentence: z.string(),
      }),
    )
    .optional(),
});

const gptZeroPredictResponseSchema = z.object({
  documents: z.array(gptZeroDocumentSchema).min(1),
});

export interface TextClassifierDeps {
  text: string;
  apiKey: string;
  /** Default `https://api.gptzero.me`. */
  baseUrl?: string;
  fetchFn?: typeof fetch;
}

export interface TextClassificationResult {
  aiProbability: number | null;
  riskLevel: QualityTier;
  insufficientText: boolean;
  sentenceBreakdown?: Array<{ generated_prob: number; sentence: string }>;
  provider: "gptzero";
  classifiedAt: Date;
}

export function countWords(text: string): number {
  const t = text.trim();
  if (!t) {
    return 0;
  }
  return t.split(/\s+/).filter(Boolean).length;
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

function resolveBaseUrl(baseUrl?: string): string {
  const raw = (baseUrl ?? GPTZERO_DEFAULT_BASE_URL).replace(/\/$/, "");
  return raw;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function extractProbability(doc: z.infer<typeof gptZeroDocumentSchema>): number {
  if (doc.completely_generated_prob != null) {
    return doc.completely_generated_prob;
  }
  if (doc.average_generated_prob != null) {
    return doc.average_generated_prob;
  }
  return 0;
}

async function postPredictText(
  url: string,
  apiKey: string,
  document: string,
  fetchImpl: typeof fetch,
): Promise<Response> {
  return fetchImpl(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ document }),
  });
}

async function parsePredictJson(res: Response): Promise<z.infer<typeof gptZeroPredictResponseSchema>> {
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ClassifierError("gptzero: invalid JSON response");
  }
  const parsed = gptZeroPredictResponseSchema.safeParse(body);
  if (!parsed.success) {
    throw new ClassifierError("gptzero: unexpected response shape");
  }
  return parsed.data;
}

/**
 * Classifies plain text via GPTZero `POST /v2/predict/text`.
 * Retries once after 5s on HTTP 429 (REQUIREMENTS §7.1).
 */
export async function classifyPlainText(
  deps: TextClassifierDeps,
): Promise<TextClassificationResult> {
  const fetchImpl = deps.fetchFn ?? globalThis.fetch.bind(globalThis);
  const base = resolveBaseUrl(deps.baseUrl);
  const url = `${base}${predictPath}`;
  const wordCount = countWords(deps.text);

  if (wordCount < GPTZERO_MIN_WORDS) {
    return {
      aiProbability: null,
      riskLevel: "review",
      insufficientText: true,
      provider: "gptzero",
      classifiedAt: new Date(),
    };
  }

  const document = deps.text.trim();
  let res = await postPredictText(url, deps.apiKey, document, fetchImpl);

  if (res.status === 429) {
    await delay(5000);
    res = await postPredictText(url, deps.apiKey, document, fetchImpl);
  }

  if (!res.ok) {
    throw new ClassifierError(
      `gptzero: HTTP ${res.status}`,
    );
  }

  const data = await parsePredictJson(res);
  const doc = data.documents[0];
  if (!doc) {
    throw new ClassifierError("gptzero: empty documents");
  }

  const aiProbability = extractProbability(doc);
  const riskLevel = mapAiProbabilityToRiskLevel(aiProbability);

  return {
    aiProbability,
    riskLevel,
    insufficientText: false,
    sentenceBreakdown: doc.sentences,
    provider: "gptzero",
    classifiedAt: new Date(),
  };
}

export interface TextBatchDeps {
  texts: string[];
  apiKey: string;
  baseUrl?: string;
  fetchFn?: typeof fetch;
}

/**
 * Runs multiple plain-text classifications in order (one GPTZero call per non-trivial text).
 * For large batches, prefer chunking at the caller to respect rate limits; `/v2/predict/files` can be added later.
 */
export async function classifyPlainTextBatch(
  deps: TextBatchDeps,
): Promise<TextClassificationResult[]> {
  const out: TextClassificationResult[] = [];
  for (const text of deps.texts) {
    out.push(
      await classifyPlainText({
        text,
        apiKey: deps.apiKey,
        baseUrl: deps.baseUrl,
        fetchFn: deps.fetchFn,
      }),
    );
  }
  return out;
}
