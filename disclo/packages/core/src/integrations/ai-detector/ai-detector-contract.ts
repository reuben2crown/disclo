export enum AiTextDetector {
  GPTZERO = "gptzero",
  AIORNOT = "aiornot" // image and text scanner
}

export enum AiImageDetector {
  HIVE = "hive",
  AIORNOT = "aiornot" // image and text scanner
}

// TODO: Update the BaseAiDetectorResult with common properties that all providers can return.
// Each provider handle their conversion internally, and only return what the scanner needs without loosing relevant details
// The scanner does't have to worry about provider provlem
export interface BaseAiDetectorResult {
  ok: boolean; // if the request was successful. 
  external_id?: string; // id of the request from the provider.
  version?: string; // Api version used for the scan
  ai_detected?: boolean;
  ai_confidence?: number;
  ai_tools?: Record<string, number>; // <name, confidence> of possible ai tools or models that generated the content.
  ai_scan_comment?: string; // descriptiive text sent by the Api.
  human_detected?: boolean; // if the content was altered by a human. (AI assisted vs AI generated)
  human_confidence?: number; // confidence score for the human alteration.
  scanAt?: Date | null;
  latencyMs?: number; // time taken to receive the response from the provider
}

export interface AiTextDetectorResult extends BaseAiDetectorResult {
  insufficientText?: boolean;
  sentenceBreakdown?: Array<{ sentence: string, confidence: number; }>;
  provider: AiTextDetector;
  // TODO: Add other useful properties.
}

export interface AiImageDetectorResult extends BaseAiDetectorResult {
  imageUrl: string;
  provider: AiImageDetector;
  // TODO: Add other useful properties.
  frames?: {
    time: number;
    classes: ImageClassification[];
  }[];
}

export interface ImageClassification {
  class: string;
  score: number;
}

// contract for text scanner providers only
export interface AiTextDetectorContract {
  scanText(prompt: string, requestId: string): Promise<AiTextDetectorResult>;
}

// contract for image scanner providers only
export interface AiImageDetectorContract {
  scanImage(imageUrl: string, requestId: string): Promise<AiImageDetectorResult>;
}

// contract for providers that can both text and image scan
// export interface FullAiDetectorContract extends AiTextDetectorContract, AiImageDetectorContract {
//   scanText(prompt: string): Promise<AiTextDetectorResult>;
//   scanImage(imageUrl: string): Promise<AiImageDetectorResult>;
// }
