export enum AIProviderType {
  GOOGLE_AI_STUDIO = "google_ai_studio",
  ANTHROPIC = "anthropic",
  OPENAI = "openai",
  GROQ = "groq",
  OPENROUTER = "openrouter",
  DEEPSEEK = "deepseek",
}

export type AIProviderModel = {
  provider: AIProviderType;
  model: ANTHROPIC_MODEL | GEMINI_MODEL | GROQ_MODEL;
}

// Google Gemini Models
export enum GEMINI_MODEL {
  GEMINI_3_0_FLASH = "gemini-3-flash-preview",
  GEMINI_3_1_FLASH = "gemini-3.1-flash-preview",
  GEMINI_2_0_FLASH_THINKING = "gemini-2.0-flash-thinking",
  GEMINI_2_5_PRO = "gemini-2.5-pro",
  GEMINI_2_5_FLASH_THINKING = "gemini-2.5-flash-thinking",
  GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite",
  // Gemini Models (Legacy)
  GEMINI_2_0_FLASH = "gemini-2.0-flash"
}

// Anthropic Models
export enum ANTHROPIC_MODEL {
  // Anthropic Models (Active)
  CLAUDE_OPUS_4_7 = "claude-opus-4-7",
  CLAUDE_OPUS_4_6 = "claude-opus-4-6",
  CLAUDE_HAIKU_4_5_20251001 = "claude-haiku-4-5-20251001",
  // Anthropic Models (Legacy)
  CLAUDE_OPUS_4_5_20251101 = "claude-opus-4-5-20251101",
  CLAUDE_SONNET_4_5_20250929 = "claude-sonnet-4-5-20250929",
  CLAUDE_3_5_HAIKU_LATEST = "claude-3-5-haiku-latest",
}

// TODO: Add OpenAI models here enum

// Groq Models
export enum GROQ_MODEL {
  GROQ_LLAMA_3_70B = "llama3-70b-8192",
}

export interface AIGenerationOptions {
  provider: AIProviderModel;
  fallbackProviders?: AIProviderModel[];
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  useCache?: boolean;
  cacheDuration?: number; // in minutes
}

export interface AIGenerationResponse {
  text: string;
  provider: AIProviderType; // Which provider eventually succeeded
  model: ANTHROPIC_MODEL | GEMINI_MODEL | GROQ_MODEL;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number; // time taken to receive the response from the provider
}

export interface AIProvider {
  /**
   * Triggers a text generation request to the provider.
   * Throws an error if rate-limited or service unavailable.
   */
  generateText(prompt: string, options: AIGenerationOptions): Promise<AIGenerationResponse>;
}
