import { APIProviderError } from '../../../../utils/errors.js';
import { httpService } from '../../../../utils/http-service.js';
import { AiImageDetector, type AiImageDetectorContract, type AiImageDetectorResult } from "../../ai-detector-contract.js";
import { HiveSyncResponse } from './hive-types.js';

export class HiveAiDetector implements AiImageDetectorContract {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = String(process.env.HIVE_BASE_URL || "");
    this.apiKey = String(process.env.HIVE_API_KEY || "");

    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Missing HIVE_API configurations.');
    }
  }

  async scanImage(imageUrl: string, requestId: string): Promise<AiImageDetectorResult> {
    try {
      const apiVersion = 'v2';
      const endpoint = `/${apiVersion}/task/sync`;
      const startTime = Date.now();
      const res = await httpService.post<HiveSyncResponse>(endpoint, {
        baseUrl: this.baseUrl, // set base url
        headers: {
          accept: 'application/json',
          authorization: `token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl, external_id: requestId }),
      });

      if (!res.ok) {
        throw new APIProviderError(`hive: HTTP ${res.status}`);
        // TODO: Do whatever necessary to be done here. or remove
      }

      // TODO: Map the HiveScanResult to the return model
      const result: AiImageDetectorResult = {
        ok: res.ok,
        imageUrl: imageUrl,
        provider: AiImageDetector.HIVE,
        version: apiVersion,
        external_id: res.data!.id || requestId,
        scanAt: res.data?.created_on ? new Date(res.data.created_on) : new Date(startTime),
        latencyMs: Date.now() - startTime,
      };

      // TODO: Set all the right values from the api
      if (res.data) {
        result.ok = res.data.status!.status!.message === 'SUCCESS';

        // ai detection
        const classes = res.data.status?.response?.output?.[0]?.classes ?? [];
        const aiClass = classes.find((entry) => entry.class === "ai_generated");
        const humanClass = classes.find((entry) => entry.class === "not_ai_generated");
        result.ai_confidence = aiClass?.score ?? 0;
        result.ai_detected = (aiClass?.score ?? 0) >= 0.5;
        result.human_confidence = humanClass?.score;
        result.frames = res.data.status?.response?.output?.map((frame) => ({
          time: frame.time,
          classes: frame.classes.map((classification) => ({
            class: classification.class,
            score: classification.score,
          })),
        }));

        // human detection
        // result.human_confidence = ai_report.human!.confidence;
        // result.human_confidence = ai_report.human!.confidence;

        // get generator ai tools and their confidence (if any)
        // result.ai_tools = tools;
      }

      return result;
    } catch (error) {
      throw new APIProviderError(`hive: HTTP ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}