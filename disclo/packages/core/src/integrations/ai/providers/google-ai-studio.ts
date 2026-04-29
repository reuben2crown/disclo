import { GoogleGenerativeAI } from '@google/generative-ai'; // or use httpService
import { AIProvider, AIGenerationOptions, AIGenerationResponse, AIProviderType } from '../ai-contract.js';

export class GoogleAIStudioProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Requires GOOGLE_AI_STUDIO_API_KEY in the environment
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_STUDIO_API_KEY environment variable is missing.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, options: AIGenerationOptions): Promise<AIGenerationResponse> {
    const startTime = Date.now();

    // Default to gemini-2.0-flash as the fast model
    const modelName = options.provider!.model || 'gemini-2.0-flash';

    const model = this.genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: options.systemInstruction,
      generationConfig: {
        responseMimeType: options.jsonMode ? "application/json" : "text/plain",
        maxOutputTokens: options.maxTokens,
        temperature: options.temperature,
      }
    });

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const usageMetadata = response.usageMetadata;

      return {
        text,
        provider: AIProviderType.GOOGLE_AI_STUDIO,
        model: options.provider!.model,
        tokensIn: usageMetadata?.promptTokenCount || 0,
        tokensOut: usageMetadata?.candidatesTokenCount || 0,
        latencyMs: Date.now() - startTime,
      };
    } catch (error: any) {
      // Map Google AI Studio errors to generic HTTP status patterns so AIGateway can handle fallbacks
      if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        error.status = 429;
      }
      throw error;
    }
  }
}
