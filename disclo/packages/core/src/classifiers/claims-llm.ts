import { z } from "zod";
import { ClassifierError } from "../utils/errors.js";

export const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
export const ANTHROPIC_SONNET_MODEL = "claude-sonnet-4-20250514";

const substantiationResultSchema = z.object({
  results: z.array(
    z.object({
      phrase: z.string(),
      status: z.enum(["SUBSTANTIATED", "BARE_ASSERTION"]),
    }),
  ),
});

export interface SubstantiateGreenClaimsDeps {
  productDescription: string;
  flaggedPhrases: string[];
  planAllowsLlm: boolean;
  apiKey: string;
  model?: string;
  fetchFn?: typeof fetch;
}

export type ClaimSubstantiationStatus = "SUBSTANTIATED" | "BARE_ASSERTION";

export interface ClaimSubstantiationResult {
  phrase: string;
  status: ClaimSubstantiationStatus;
}

/**
 * Pass 2 — LLM substantiation (Pro+). Mocks in unit tests only.
 */
export async function substantiateGreenClaims(
  deps: SubstantiateGreenClaimsDeps,
): Promise<ClaimSubstantiationResult[]> {
  const base = deps.flaggedPhrases.map((phrase) => ({
    phrase,
    status: "BARE_ASSERTION" as const,
  }));

  if (!deps.planAllowsLlm || deps.flaggedPhrases.length === 0) {
    return base;
  }

  const fetchImpl = deps.fetchFn ?? globalThis.fetch.bind(globalThis);
  const model = deps.model ?? ANTHROPIC_SONNET_MODEL;

  const prompt = `You classify green marketing claims for a product.
Product description:
---
${deps.productDescription}
---
Flagged phrases: ${JSON.stringify(deps.flaggedPhrases)}
For each phrase, respond with SUBSTANTIATED only if the description gives concrete, verifiable support (specific cert, measurable claim, named standard). Otherwise BARE_ASSERTION.
Return JSON only: {"results":[{"phrase":"...","status":"SUBSTANTIATED"|"BARE_ASSERTION"}]}`;

  const res = await fetchImpl(ANTHROPIC_MESSAGES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": deps.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new ClassifierError(`anthropic: HTTP ${res.status}`);
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ClassifierError("anthropic: invalid JSON");
  }

  const content = (body as { content?: Array<{ type?: string; text?: string }> })
    ?.content?.[0]?.text;
  if (!content || typeof content !== "string") {
    throw new ClassifierError("anthropic: missing content text");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new ClassifierError("anthropic: content not JSON");
  }

  const parsed = substantiationResultSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new ClassifierError("anthropic: unexpected substantiation shape");
  }

  return parsed.data.results.map((r) => ({
    phrase: r.phrase,
    status: r.status,
  }));
}
