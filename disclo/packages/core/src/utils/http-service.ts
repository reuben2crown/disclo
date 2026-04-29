type HttpOptions = RequestInit & {
  params?: Record<string, string>;
  baseUrl?: string;
};

export interface HttpResponse<T> extends Response {
  data?: T;
}

async function http<T>(path: string, options: HttpOptions = {}): Promise<HttpResponse<T>> {
  // 1. Destructure early to separate custom options from native RequestInit
  const { params, baseUrl, headers: userHeaders, ...rest } = options;

  // 2. Validate/Fallback for Base URL
  const activeBaseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
  if (!activeBaseUrl && !path.startsWith('http')) {
    throw new Error('HTTP Service: Base URL is missing and path is not absolute.');
  }

  try {
    // 3. Handle Headers safely (RequestInit headers can be string[][], Headers, or Record)
    const headers = new Headers(userHeaders);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    // 4. Construct URL safely
    const sanitizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${activeBaseUrl}${sanitizedPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // 5. Execute Fetch
    const response = await fetch(url.toString(), {
      ...rest,
      headers,
    });

    // 6. Parse response body when JSON is available
    const contentType = response.headers.get("content-type") ?? "";
    let data: T | undefined;
    if (contentType.includes("application/json")) {
      data = (await response.json()) as T;
    }

    // 7. Return response and parsed payload for caller-side handling
    const responseWithData = response as HttpResponse<T>;
    responseWithData.data = data;
    return responseWithData;
  } catch (error) {
    // Use a logger or re-throw for the caller to handle
    throw error;
  }
}

export const httpService = {
  get: <T>(path: string, options?: HttpOptions) =>
    http<T>(path, { ...options, method: 'GET' }),

  post: <T>(
    path: string,
    bodyOrOptions?: unknown | HttpOptions,
    maybeOptions?: HttpOptions,
  ) => {
    const looksLikeRequestInit =
      !!bodyOrOptions &&
      typeof bodyOrOptions === "object" &&
      ("baseUrl" in (bodyOrOptions as object) ||
        "headers" in (bodyOrOptions as object) ||
        "body" in (bodyOrOptions as object) ||
        "params" in (bodyOrOptions as object));

    if (looksLikeRequestInit) {
      return http<T>(path, { ...(bodyOrOptions as HttpOptions), method: "POST" });
    }

    return http<T>(path, {
      ...(maybeOptions ?? {}),
      method: "POST",
      body: bodyOrOptions === undefined ? undefined : JSON.stringify(bodyOrOptions),
    });
  },

  put: <T>(path: string, body: unknown, options?: HttpOptions) =>
    http<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(path: string, options?: HttpOptions) =>
    http<T>(path, { ...options, method: 'DELETE' }),

  delay: (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

};
