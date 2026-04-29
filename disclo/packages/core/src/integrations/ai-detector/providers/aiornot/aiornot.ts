import { APIProviderError, ValidationError } from '../../../../utils/errors.js';
import { httpService } from '../../../../utils/http-service.js';
import { countWords } from '../../../../utils/string.helper.js';
import { AiImageDetector, AiTextDetectorResult, AiTextDetectorContract, AiImageDetectorContract, AiImageDetectorResult, AiTextDetector } from "../../ai-detector-contract.js";
import { AoNResponse } from './aiornot-types.js';

export class AiOrNotScanner implements AiTextDetectorContract, AiImageDetectorContract {
  private baseUrl: string;
  private apiKey: string;
  private minWords: number;

  constructor() {
    this.baseUrl = String(process.env.AIORNOT_BASE_URL || "");
    this.apiKey = String(process.env.AIORNOT_API_KEY || "");
    this.minWords = Number(process.env.AIORNOT_MIN_WORDS || 250); // convert to zero

    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Missing AIORNOT_API configurations.');
    }
  }

  async scanText(text: string, requestId: string): Promise<AiTextDetectorResult> {
    const wordCount = countWords(text);
    if (this.minWords && wordCount < this.minWords) {
      return {
        ok: false,
        insufficientText: true,
        provider: AiTextDetector.AIORNOT,
        external_id: requestId,
      };
    }

    try {
      const document = text.trim();
      const apiVersion = 'v2';
      const endpoint = `/${apiVersion}/text/sync`;
      const params = new URLSearchParams({
        include_annotations: 'true',
        external_id: requestId,
      });
      
      // do this to reuse the same request after rate limit
      const httpRequest = httpService.post<AoNResponse>(`${endpoint}?${params}`, {
        baseUrl: this.baseUrl, // set base url
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text: document }).toString(),
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
        throw new APIProviderError(`aiornot: HTTP - Failed to analyze text: ${res.status} ${res.statusText}`, {cause: res!.data!.detail});
      }

      // TODO: This is just a mock idea. Fix proper implementation later, or remove it.
      if (!res.data!.metadata!.word_count) {
        throw new APIProviderError("aiornot: empty scanned document", {cause: res.data!.detail});
      }

      // TODO: Map the AI or Not ScanResult to the return model
      const result: AiTextDetectorResult = {
        ok: res.ok,
        provider: AiTextDetector.AIORNOT,
        version: apiVersion,
        external_id: res.data!.id || requestId,
        scanAt: res.data?.created_at ? new Date(res.data.created_at) : new Date(startTime),
        latencyMs: Date.now() - startTime,
      };

      // TODO: Set all the right values from the api
      if (res.data) {
        // ai detection
        const ai_report = res.data.report!.ai_text!;
        
        result.ok = (ai_report != null && ai_report != undefined);
        result.ai_detected = ai_report!.is_detected;
        result.ai_confidence = ai_report!.confidence;

        result.insufficientText = res.data!.report!.ai_text!.annotations.length === 0;
        result.sentenceBreakdown = res.data!.report!.ai_text!.annotations.map((annotation) => ({
          sentence: annotation[1] as string,
          confidence: annotation[0] as number,
        }));

        // result.ai_scan_comment = ai_report.verdict;

        // // human detection
        // result.human_confidence = ai_report.human!.confidence;
        // result.human_confidence = ai_report.human!.confidence;
      }

      return result;
    } catch (error) {
      throw new APIProviderError(`aiornot: HTTP ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async scanImage(imageUrl: string, requestId: string): Promise<AiImageDetectorResult> {
    try {
      const apiVersion = 'v2';
      const endpoint = `/${apiVersion}/image/sync?external_id=${encodeURIComponent(requestId)}`;
      const startTime = Date.now();

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new ValidationError(`aiornot: failed to download image URL (${imageResponse.status})`);
      }
      const imageBlob = await imageResponse.blob();
      const formData = new FormData();
      formData.append("image", imageBlob, "image");

      const res = await httpService.post<AoNResponse>(endpoint, {
        baseUrl: this.baseUrl, // set base url
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new APIProviderError(`aiornot: HTTP ${res.status}`);
        // TODO: Do whatever necessary to be done here. or remove
      }

      // TODO: Map the HiveScanResult to the return model
      const result: AiImageDetectorResult = {
        ok: res.ok,
        imageUrl: imageUrl,
        provider: AiImageDetector.AIORNOT,
        version: apiVersion,
        external_id: res.data!.id || requestId,
        scanAt: res.data?.created_at ? new Date(res.data.created_at) : new Date(startTime),
        latencyMs: Date.now() - startTime,
      };

      // TODO: Set all the right values from the api
      if (res.data) {
        result.external_id = res.data.id;
        // ai detection
        const ai_report = res.data.report!.ai_generated!;
        
        result.ok = (ai_report != null && ai_report != undefined);
        result.ai_detected = ai_report.ai!.is_detected;
        result.ai_confidence = ai_report.ai!.confidence;
        result.ai_scan_comment = ai_report.verdict;

        // human detection
        result.human_confidence = ai_report.human!.confidence;
        result.human_confidence = ai_report.human!.confidence;

        // get generator ai tools and their confidence
        if (ai_report.generator) {
          const tools = Object.entries(ai_report.generator).reduce((acc, [platform, status]) => {
            if (status.is_detected) {
              acc[platform] = status.confidence;
            }
            return acc;
          }, {} as Record<string, number>);

          result.ai_tools = tools;
        }
      }

      return result;
    } catch (error) {
      throw new APIProviderError(`aiornot: HTTP ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}