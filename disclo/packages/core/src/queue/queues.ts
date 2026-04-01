import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../types.js";
import { getBullmqQueueOptions, requireRedisUrl } from "./redis-connection.js";

export function createQueue(name: keyof typeof QUEUE_NAMES): Queue {
  return new Queue(QUEUE_NAMES[name], getBullmqQueueOptions(requireRedisUrl()));
}
