import { APIProviderError, ClassifierError } from "../../../utils/errors.js";
import { httpService } from '../../../utils/http-service.js';
import { AiTextDetector, type AiTextDetectorContract, type AiTextDetectorResult } from "../ai-detector-contract.js";
import { countWords } from "../../../utils/string.helper.js";

export interface GptZeroTextScanRespone {
  documents?: Array<{
    average_generated_prob?: number;
    completely_generated_prob?: number;
    document_classification?: string;
    sentences?: Array<{
      generated_prob?: number;
      sentence?: string;
    }>;
  }>;
  external_id?: string;
};


export class GptZeroTextScannerProvider implements AiTextDetectorContract {
  private baseUrl: string;
  private apiKey: string;
  private minWords: number;

  constructor() {
    this.baseUrl = String(process.env.GPTZERO_BASE_URL || "").replace(/\/$/, "");
    this.apiKey = String(process.env.GPTZERO_API_KEY || "");
    this.minWords = Number(process.env.GPTZERO_MIN_WORDS || 0); // convert to zero

    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Missing GPTZERO configurations.');
    }
  }

  async scanText(text: string, requestId: string): Promise<AiTextDetectorResult> {
    const wordCount = countWords(text);
    if (this.minWords && wordCount < this.minWords) {
      return {
        ok: false,
        insufficientText: true,
        provider: AiTextDetector.GPTZERO
      };
    }

    try {
      const document = text.trim();
      const apiVersion = 'v2';
      const endpoint = `/${apiVersion}/predict/text`;

      // do this to reuse the same request after rate limit
      const httpRequest = httpService.post<GptZeroTextScanRespone>(endpoint, {
        baseUrl: this.baseUrl, // set base url
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({ document }),
      });

      let startTime = Date.now();
      // execute the request
      let res = await httpRequest;

      // check for rate limit and delay for 5 seconds
      if (res.status === 429) {
        await httpService.delay(5000);
        startTime = Date.now();
        res = await httpRequest;
      }

      if (!res.ok) {
        throw new APIProviderError(`gptzero: HTTP ${res.status}`);
        // TODO: Do whatever necessary to be done here.
      }

      const data = res.data;
      const doc = data?.documents?.[0];
      if (!doc) {
        throw new ClassifierError("gptzero: empty scanned document");
      }

      // TODO: Map the HiveScanResult to the return model
      const result: AiTextDetectorResult = {
        ok: res.ok,
        provider: AiTextDetector.GPTZERO,
        version: apiVersion,
        external_id: requestId,
        scanAt: new Date(startTime),
        latencyMs: Date.now() - startTime,
        ai_detected: (doc.average_generated_prob || 0) > 0.5,
        ai_confidence: doc.average_generated_prob || 0,
        sentenceBreakdown: (doc.sentences || []).map((sentence) => ({
          sentence: sentence.sentence || "",
          confidence: sentence.generated_prob || 0,
        })),
        
        // ai_tools: data!.tools,
        // ai_scan_comment: data!.scan_comment,
        // human_detected: data!.human_detected,
        // human_confidence: data!.human_confidence,
      };

      return result;
    } catch (error) {
      throw new APIProviderError(`gptzero: HTTP ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
