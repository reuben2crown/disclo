import { z } from "zod";
import { AIGateway } from "../integrations/ai/ai-gateway.js";
import { ClassifierError } from "../utils/errors.js";
import { PromptManager } from "../integrations/ai/prompt-manager.server.js";
import { AIProviderModel, AIProviderType, GEMINI_MODEL } from "../integrations/ai/ai-contract.js";
import { resolveDefaultAIProviderModel } from "../integrations/ai/ai-factory.js";

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
  storeId: string;
}

export type ClaimSubstantiationStatus = "SUBSTANTIATED" | "BARE_ASSERTION";

export interface ClaimSubstantiationResult {
  phrase: string;
  status: ClaimSubstantiationStatus;
}

/**
 * Pass 2 — LLM substantiation for green marketing claims (domain logic).
 * Uses AIGateway via {@link AIGateway}; mocks `fetch` in tests only.
 */
export async function substantiateGreenClaims(
  deps: SubstantiateGreenClaimsDeps,
): Promise<ClaimSubstantiationResult[]> {

  const base = deps.flaggedPhrases.map((phrase) => ({
    phrase,
    status: "BARE_ASSERTION" as const,
  }));
  if (!deps.planAllowsLlm || deps.flaggedPhrases.length === 0) {
    //TODO: validate if its appropriate to return BARE_ASSERTION for this case when no actual check is performed. To avoid misinformation of fact.
    return base;
  }

  
  // TODO: add this to the template_manager migration. 
// const prompt = `You classify green marketing claims for a product.
// Product description:
// ---
// ${deps.productDescription}
// ---
// Flagged phrases: ${JSON.stringify(deps.flaggedPhrases)}
// For each phrase, respond with SUBSTANTIATED only if the description gives concrete, verifiable support (specific cert, measurable claim, named standard). Otherwise BARE_ASSERTION.
// Return JSON only: {"results":[{"phrase":"...","status":"SUBSTANTIATED"|"BARE_ASSERTION"}]}`;

const template = await PromptManager.getTemplate('substantiate_green_claims');

const prompt = PromptManager.hydrate(template, {
  product_description: deps.productDescription,
  flagged_phrases: JSON.stringify(deps.flaggedPhrases),
});


const providerModel: AIProviderModel = resolveDefaultAIProviderModel();

// fallback providers (optional)
const fallbackProviders: AIProviderModel[] = [
  {
    provider: AIProviderType.GOOGLE_AI_STUDIO,
    model: GEMINI_MODEL.GEMINI_2_0_FLASH,
  },
];

const aiResponse = await AIGateway.execute({
  prompt,
  options: {
    provider: providerModel, // Primary
    fallbackProviders: fallbackProviders,
    jsonMode: true,
    temperature: 0.8,
    useCache: true,
    cacheDuration: 1440, // Cache for 24 hours (in minutes)
  },
  metadata: {
    storeId: deps.storeId,
    featureName: 'substantiate_green_claims',
  }
});

let cleanJson = aiResponse.text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

  const parsed = substantiationResultSchema.safeParse(cleanJson);
  if (!parsed.success) {
    throw new ClassifierError("anthropic: unexpected substantiation shape");
  }

  return parsed.data.results.map((r) => ({
    phrase: r.phrase,
    status: r.status,
  }));
}
