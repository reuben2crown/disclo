import pino from "pino";

let rootLogger: pino.Logger | null = null;

export function getLogger(): pino.Logger {
  if (rootLogger) {
    return rootLogger;
  }
  const level =
    (process.env.LOG_LEVEL as pino.Level | undefined) ?? ("info" as pino.Level);
  rootLogger = pino({
    level,
    base: { service: "disclo" },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
  return rootLogger;
}

export function createChildLogger(bindings: Record<string, string>): pino.Logger {
  return getLogger().child(bindings);
}

/** Request/job correlation id for structured logs (INFRA-05). */
export function loggerWithCorrelation(correlationId: string): pino.Logger {
  return getLogger().child({ correlationId });
}
