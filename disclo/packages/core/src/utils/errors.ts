/** Base class for all Disclo domain errors (typed, serializable). */
export class DiscloError extends Error {
  readonly code: string;
  readonly httpStatus: number;

  constructor(
    message: string,
    code: string,
    httpStatus = 500,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export class ClassifierError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "CLASSIFIER_ERROR", 502, options);
  }
}

export class AdapterError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "ADAPTER_ERROR", 502, options);
  }
}

export class PlanError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "PLAN_ERROR", 403, options);
  }
}

export class ValidationError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "VALIDATION_ERROR", 400, options);
  }
}

export class BillingError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "BILLING_ERROR", 402, options);
  }
}

export class EvidenceError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "EVIDENCE_ERROR", 409, options);
  }
}

export class APIProviderError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "API_PROVIDER_ERROR", 502, options);
  }
}

export class AIModelError extends DiscloError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, "AI_MODEL_ERROR", 502, options);
  }
}