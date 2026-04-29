import { AIProviderType, AIProvider, AIProviderModel, ANTHROPIC_MODEL, GEMINI_MODEL, GROQ_MODEL } from './ai-contract.js';
import { GoogleAIStudioProvider } from './providers/google-ai-studio.js';
import { OpenRouterProvider } from './providers/openrouter.js';
import { GroqProvider } from './providers/groq-ai.js';
import { AnthropicProvider } from './providers/anthropic-ai.js';

export function getAIProvider(providerType: AIProviderType): AIProvider {
  switch (providerType) {
    case AIProviderType.GOOGLE_AI_STUDIO:
      return new GoogleAIStudioProvider();
    case AIProviderType.ANTHROPIC:
      return new AnthropicProvider();
    // case AIProviderType.OPENAI:
    //   return new OpenAIProvider(); // TODO: Implement OpenAIProvider
    case AIProviderType.OPENROUTER:
      return new OpenRouterProvider();
    case AIProviderType.GROQ:
      return new GroqProvider();
    default:
      throw new Error(`Provider ${providerType} is not supported yet.`);
  }
}

export function resolveDefaultAIProviderModel(): AIProviderModel {
  const provider = (process.env.AI_PROVIDER || AIProviderType.ANTHROPIC) as AIProviderType;

  switch (provider) {
    case AIProviderType.GOOGLE_AI_STUDIO:
      return {
        provider,
        model: (process.env.AI_MODEL as GEMINI_MODEL) || GEMINI_MODEL.GEMINI_2_0_FLASH,
      };
    case AIProviderType.GROQ:
      return {
        provider,
        model: (process.env.AI_MODEL as GROQ_MODEL) || GROQ_MODEL.GROQ_LLAMA_3_70B,
      };
    case AIProviderType.ANTHROPIC:
    default:
      return {
        provider: AIProviderType.ANTHROPIC,
        model: (process.env.AI_MODEL as ANTHROPIC_MODEL) || ANTHROPIC_MODEL.CLAUDE_OPUS_4_7,
      };
  }
}
