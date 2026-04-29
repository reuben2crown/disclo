import type { AIGenerationOptions, AIGenerationResponse } from './ai-contract.js';

interface ExecuteParams {
  options: AIGenerationOptions;
  prompt: string;
  metadata: {
    storeId: string;
    featureName: string;
  };
}

import { redis } from '../../utils/redis.js';
import crypto from 'crypto';
import { getAIProvider } from './ai-factory.js';
import { apiLogger } from '../api-logger.js';

export const AIGateway = {
  /**
   * Executes an AI request. If the primary provider fails, it attempts
   * to use fallback providers sequentially. Logs the consumptions to `AILog`.
   */
  async execute({ options, prompt, metadata }: ExecuteParams): Promise<AIGenerationResponse> {
    const providersToTry = [options.provider, ...(options.fallbackProviders || [])];
    let lastError: any;

    let cacheKey = '';
    if (options.useCache) {
      const hash = crypto.createHash('sha256')
        .update(prompt + JSON.stringify(options))
        .digest('hex');
      cacheKey = `ai_cache_${hash}`;

      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log(`[AIGateway] Cache hit for ${metadata.featureName}`);
          return JSON.parse(cached);
        }
      } catch (err) {
        console.error('[AIGateway] Redis cache get error:', err);
      }
    }

    for (const providerType of providersToTry) {
      try {
        const providerInstance = getAIProvider(providerType.provider);

        // Ensure options override its own provider context
        const attemptOptions = { ...options, provider: providerType };

        const response = await providerInstance.generateText(prompt, attemptOptions);

        await apiLogger({
          storeId: metadata.storeId,
          featureName: metadata.featureName,
          provider: response.provider,
          modelVersion: response.model,
          latencyMs: response.latencyMs,
          metadata: {
            tokensIn: response.tokensIn,
            tokensOut: response.tokensOut,
          },
        }).catch((err: Error) => console.error('Failed to log API call:', err));

        if (options.useCache && cacheKey) {
          // Cache successful generations for the specified duration or default 1 day
          // cacheDuration is expected in minutes, so multiply by 60 for EX (seconds)
          const cacheDurationSecs = (options.cacheDuration ? options.cacheDuration * 60 : 60 * 60 * 24);
          redis.set(cacheKey, JSON.stringify(response), 'EX', cacheDurationSecs).catch(err => console.error('[AIGateway] Redis cache set error:', err));
        }

        return response;
      } catch (error: any) {
        lastError = error;
        // Basic fallback heuristic: if it's a rate limit (429) or server error (500+), try next
        // If it's a client error like 400 (Bad Request), throw immediately because all providers might fail.
        const status = error?.status || error?.response?.status;
        if (status && status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
        console.warn(`Provider ${providerType} failed, trying fallback...`, error?.message);
      }
    }

    throw new Error(`All AI providers failed. Last error: ${lastError?.message || lastError}`);
  }
};
