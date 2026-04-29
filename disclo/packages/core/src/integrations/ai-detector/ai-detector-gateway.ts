import { aiDetectorRegistry } from './ai-detector-factory.js';
import { AiImageDetector, AiImageDetectorResult, AiTextDetector, AiTextDetectorResult } from './ai-detector-contract.js';
import { apiLogger } from '../api-logger.js';

export const AiDetectorGateway = {
  /**
   * Executes an AI text detector request. You can optionally switch a provider or use the default provider. Logs the consumptions to `AILog`.
   * 
   * @param storeId - merchant store id
   * @param requestId - request id
   * @param text - text to scan
   * @param provider - optional provider to use, if not provided, the default provider will be used
   * @returns result of the text detection
   */
  async executeTextDetector(storeId: string, requestId: string, text: string, provider?: AiTextDetector): Promise<AiTextDetectorResult> {
    try {
      // get the text detector provider
      const textRegistry = aiDetectorRegistry.getTextDetectorProvider(provider);
      
      // execute the text detection scan - call the provider Api
      const response = await textRegistry.scanText(text, requestId);

        // Log to db asynchronously (fire and forget)
        await apiLogger({
          storeId: storeId,
          requestId: requestId,
          featureName: 'text_detector',
          provider: response.provider.toString(),
          modelVersion: response.version,
          latencyMs: response.latencyMs,

          // TODO: Add other useful properties from the response
      }).catch((err: Error) => console.error('Failed to log AILog:', err));

      return response;
    }
    catch (error: any) {
      throw error;
    }
  },

  /**
   * Executes an AI image detector request. You can optionally switch a provider or use the default provider. Logs the consumptions to `AILog`.
   * 
   * @param storeId - merchant store id
   * @param requestId - request id
  * @param imageUrl - image url to scan
   * @param provider - optional provider to use, if not provided, the default provider will be used
   * @returns result of the image detection
   */
  async executeImageDetector(storeId: string, requestId: string, imageUrl: string, provider?: AiImageDetector): Promise<AiImageDetectorResult> {
      try {
        // get the image detector provider
        const imageRegistry = aiDetectorRegistry.getImageDetectorProvider(provider);
        
        // execute the image detection scan - call the provider Api
        const response = await imageRegistry.scanImage(imageUrl, requestId);

        // Log to db asynchronously (fire and forget)
        await apiLogger({
            storeId: storeId,
            requestId: requestId,
            featureName: 'image_detector',
            provider: response.provider.toString(),
            modelVersion: response.version,
            latencyMs: response.latencyMs,

            // TODO: Add other useful properties from the response
        }).catch((err: Error) => console.error('Failed to log AILog:', err));

        return response;
      } catch (error: any) {
        throw error;
      }
  }
};
