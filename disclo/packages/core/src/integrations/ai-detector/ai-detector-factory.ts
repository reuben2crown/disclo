import { AiImageDetectorContract, AiImageDetector, AiTextDetectorContract, AiTextDetector } from "./ai-detector-contract.js";
import { AiOrNotScanner } from "./providers/aiornot/aiornot.js";
import { GptZeroTextScannerProvider } from "./providers/gptzero.js";
import { HiveAiDetector } from "./providers/hive/hive.js";

export function getAiTextDetectorProvider(provider: AiTextDetector): AiTextDetectorContract {
    switch (provider) {
      case AiTextDetector.GPTZERO:
        return new GptZeroTextScannerProvider();
      case AiTextDetector.AIORNOT:
        return new AiOrNotScanner();
      default:
        throw new Error(`AI detector: ${provider} is not supported yet.`);
    }
}

export function getAiImageDetectorProvider(provider: AiImageDetector): AiImageDetectorContract {
    switch (provider) {
      case AiImageDetector.HIVE:
        return new HiveAiDetector();
      case AiImageDetector.AIORNOT:
        return new AiOrNotScanner();
      default:
        throw new Error(`AI detector: ${provider} is not supported yet.`);
    }
}

/**
 * Single access point for the active ai detector implementation.
 * Default provider is created lazily so tests can inject mocks before first use.
 */
export function createAiDetectorRegistry() {
    const imageProvider = (process.env.AI_IMAGE_DETECTOR_PROVIDER as AiImageDetector) || AiImageDetector.HIVE;
    const textProvider = (process.env.AI_TEXT_DETECTOR_PROVIDER as AiTextDetector) || AiTextDetector.GPTZERO;
  
    return {
      getTextDetectorProvider(replaceProvider?: AiTextDetector) {
        const providerInstance = getAiTextDetectorProvider(replaceProvider ?? textProvider);
        return providerInstance;
      },
  
      getImageDetectorProvider(replaceProvider?: AiImageDetector) {
        const providerInstance = getAiImageDetectorProvider(replaceProvider ?? imageProvider);
        return providerInstance;
      },
    };
  }
  
  export const aiDetectorRegistry = createAiDetectorRegistry();
  