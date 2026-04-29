/**
 * Prompt Manager
 * This module is responsible for managing the prompt templates for the AI.
 * It is used to get the prompt template for a given name and to hydrate the prompt template with the variables.
 * It is also responsible for caching the prompt template in Redis.
 */
import { redis } from '../../utils/redis.js';
import prisma from '@disclo/db';

const DEFAULT_PROMPT_TEMPLATES: Record<string, string> = {
  substantiate_green_claims: `You classify green marketing claims for a product.
Product description:
---
{{product_description}}
---
Flagged phrases: {{flagged_phrases}}
For each phrase, respond with SUBSTANTIATED only if the description gives concrete, verifiable support (specific cert, measurable claim, named standard). Otherwise BARE_ASSERTION.
Return JSON only: {"results":[{"phrase":"...","status":"SUBSTANTIATED"|"BARE_ASSERTION"}]}`,
};

export const PromptManager = {
  async getTemplate(name: string): Promise<string> {
    const cacheKey = `prompt:${name}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const dbTemplate = await prisma.promptTemplate.findUnique({
      where: { name }
    });

    if (dbTemplate && dbTemplate.isActive) {
      await redis.setex(cacheKey, 3600, dbTemplate.content);
      return dbTemplate.content;
    }

    const fallbackTemplate = DEFAULT_PROMPT_TEMPLATES[name];
    if (fallbackTemplate) {
      return fallbackTemplate;
    }

    throw new Error(`Prompt template '${name}' not found or inactive.`);
  },

  hydrate(template: string, variables: Record<string, string | number>): string {
    return Object.entries(variables).reduce((str, [key, val]) => {
      // replace all instances of {{key}}
      return str.split(`{{${key}}}`).join(String(val));
    }, template);
  }
};
