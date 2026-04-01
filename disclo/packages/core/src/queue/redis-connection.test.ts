import { describe, expect, it } from "vitest";
import {
  BULLMQ_PREFIX,
  getBullmqQueueOptions,
} from "./redis-connection.js";

describe("BullMQ shared Redis namespacing", () => {
  it("uses disclo_ prefix for all queue keys", () => {
    expect(BULLMQ_PREFIX).toBe("disclo_");
    const opts = getBullmqQueueOptions("rediss://default:x@localhost:6379");
    expect(opts.prefix).toBe("disclo_");
    expect(opts.connection).toBeDefined();
  });
});
