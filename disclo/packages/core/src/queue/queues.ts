import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../types.js";
import { getBullmqConnectionFromUrl, requireRedisUrl } from "./redis-connection.js";

export function createQueue(name: keyof typeof QUEUE_NAMES): Queue {
  const connection = getBullmqConnectionFromUrl(requireRedisUrl());
  return new Queue(QUEUE_NAMES[name], { connection });
}
