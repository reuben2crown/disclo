import { z } from "zod";
import type { QualityTier } from "../models/types.js";

export const HIVE_DEFAULT_SYNC_URL = "https://api.thehive.ai/api/v2/task/sync";

const hiveClassSchema = z.object({
  class: z.string(),
  score: z.number(),
});

const hiveOutputFrameSchema = z.object({
  time: z.number().optional(),
  classes: z.array(hiveClassSchema).optional(),
});

const hiveTaskResponseSchema = z
  .object({
    status: z
      .array(
        z.object({
          status: z
            .object({
              code: z.union([z.number(), z.string()]).optional(),
              message: z.string().optional(),
            })
            .optional(),
          response: z
            .object({
              output: z.array(hiveOutputFrameSchema).optional(),
            })
            .optional(),
        }),
      )
      .optional(),
  })
  .passthrough();

export interface ClassifyImageUrlDeps {
  imageUrl: string;
  apiKey: string;
  /** Default Hive sync URL. */
  baseUrl?: string;
  fetchFn?: typeof fetch;
}

export type ImageClassificationSuccess = {
  ok: true;
  aiProbability: number;
  riskLevel: QualityTier;
  imageUrl: string;
  provider: "hive";
  classifiedAt: Date;
};

export type ImageClassificationFailure = {
  ok: false;
  aiProbability: null;
  riskLevel: "review";
  imageUrl: string;
  provider: "hive";
  classifiedAt: Date;
  /** Worker should requeue with ~1h delay when true. */
  retryable: boolean;
};

export type ImageClassificationResult =
  | ImageClassificationSuccess
  | ImageClassificationFailure;

/** Same 0.50 / 0.75 bands as text (REQUIREMENTS §7.1–7.2). */
export function mapHiveScoreToRiskLevel(score: number): QualityTier {
  if (score >= 0.75) {
    return "high";
  }
  if (score >= 0.5) {
    return "review";
  }
  return "none";
}

function extractAiGeneratedScore(output: z.infer<typeof hiveOutputFrameSchema>[]): number {
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
export async function classifyImageUrl(
  deps: ClassifyImageUrlDeps,
): Promise<ImageClassificationResult> {
  const fetchImpl = deps.fetchFn ?? globalThis.fetch.bind(globalThis);
  const url = deps.baseUrl ?? HIVE_DEFAULT_SYNC_URL;
  const now = new Date();

  let res: Response;
  try {
    res = await fetchImpl(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${deps.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: deps.imageUrl }),
    });
  } catch {
    return {
      ok: false,
      aiProbability: null,
      riskLevel: "review",
      imageUrl: deps.imageUrl,
      provider: "hive",
      classifiedAt: now,
      retryable: true,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      aiProbability: null,
      riskLevel: "review",
      imageUrl: deps.imageUrl,
      provider: "hive",
      classifiedAt: now,
      retryable: true,
    };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return {
      ok: false,
      aiProbability: null,
      riskLevel: "review",
      imageUrl: deps.imageUrl,
      provider: "hive",
      classifiedAt: now,
      retryable: true,
    };
  }

  const parsed = hiveTaskResponseSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      aiProbability: null,
      riskLevel: "review",
      imageUrl: deps.imageUrl,
      provider: "hive",
      classifiedAt: now,
      retryable: true,
    };
  }

  const frames = parsed.data.status?.[0]?.response?.output ?? [];
  const aiProb = extractAiGeneratedScore(frames);
  const riskLevel = mapHiveScoreToRiskLevel(aiProb);

  return {
    ok: true,
    aiProbability: aiProb,
    riskLevel,
    imageUrl: deps.imageUrl,
    provider: "hive",
    classifiedAt: now,
  };
}
