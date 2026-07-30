// Type-safe XHR helpers that automatically manage headers (Accept, Content-Type),
// enable credentials, and return strongly-typed responses (no `any`).

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ApiErrorBody =
  | { error?: string; message?: string; [key: string]: unknown }
  | string;

export class ApiError extends Error {
  status: number;
  body?: ApiErrorBody;

  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface XhrRequestOptions<Body> {
  body?: Body;
  /**
   * Additional headers to merge with defaults.
   * Note: default headers are { Accept: 'application/json' } and Content-Type when body is present.
   */
  headers?: Record<string, string>;
  timeoutMs?: number;
}

/**
 * Internal helper: merge default headers with user headers.
 * - If body is provided, set Content-Type: application/json (unless user overrides)
 * - Always set Accept: application/json (unless user overrides)
 */
function buildHeaders(hasBody: boolean, extra?: Record<string, string>) {
  const defaults: Record<string, string> = {
    Accept: "application/json",
  };
  if (hasBody) defaults["Content-Type"] = "application/json";

  return {
    ...defaults,
    ...(extra ?? {}),
  };
}

export function xhrRequest<Response, Body = undefined>(
  method: ApiMethod,
  url: string,
  options: XhrRequestOptions<Body> = {}
): Promise<Response> {
  const { body, headers: extraHeaders, timeoutMs } = options;
  const headers = buildHeaders(body !== undefined, extraHeaders);

  return new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    try {
      xhr.open(method, url, true);
    } catch {
      return reject(new ApiError("Invalid URL or method", 0));
    }

    xhr.withCredentials = true;

    // apply headers
    for (const key of Object.keys(headers)) {
      const value = headers[key];
      // only set header if value is not undefined/null
      if (value !== undefined && value !== null) {
        xhr.setRequestHeader(key, value);
      }
    }

    if (typeof timeoutMs === "number" && timeoutMs > 0) {
      xhr.timeout = timeoutMs;
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;

      const status = xhr.status;
      const raw = xhr.responseText ?? "";

      // Try parse JSON; if fails, pass raw text
      const contentType = xhr.getResponseHeader("content-type") ?? "";
      let parsed: Response | ApiErrorBody;
      if (contentType.includes("application/json")) {
        try {
          parsed = JSON.parse(raw) as Response;
        } catch {
          // malformed JSON
          return reject(
            new ApiError("Failed to parse JSON response", status, raw)
          );
        }
      } else {
        // non-json (string or empty)
        parsed = raw as unknown as ApiErrorBody;
      }

      if (status >= 200 && status < 300) {
        return resolve(parsed as Response);
      } else {
        const message =
          typeof parsed === "string" || parsed === null || parsed === undefined
            ? String(parsed) // If parsed is string, null, or undefined, convert to string
            : (parsed && typeof parsed === 'object' && 'error' in parsed && parsed.error) || // Check for 'error' property if parsed is an object
              (parsed && typeof parsed === 'object' && 'message' in parsed && parsed.message) || // Check for 'message' property if parsed is an object
              "Request failed"; // Fallback message
        return reject(new ApiError(message, status, parsed as ApiErrorBody));
      }
    };

    xhr.onerror = () => reject(new ApiError("Network error", 0));
    xhr.ontimeout = () => reject(new ApiError("Request timeout", 0));

    if (body !== undefined) {
      try {
        xhr.send(JSON.stringify(body));
      } catch {
        reject(new ApiError("Failed to send request body", 0));
      }
    } else {
      xhr.send();
    }
  });
}

/**
 * Convenience typed helpers: they automatically set default headers and credentials.
 * You can optionally pass extra headers via the last argument.
 *
 * Usage:
 *   const articles = await apiGet<ArticleListItemDTO[]>("/api/articles");
 *   const res = await apiPost<{ success: true }, ArticleCreateDTO>("/api/articles", payload);
 */

export function apiGet<Response>(
  url: string,
  headers?: Record<string, string>,
  timeoutMs?: number
) {
  return xhrRequest<Response>("GET", url, { headers, timeoutMs });
}

export function apiPost<Response, Body = unknown>(
  url: string,
  body: Body,
  headers?: Record<string, string>,
  timeoutMs?: number
) {
  return xhrRequest<Response, Body>("POST", url, { body, headers, timeoutMs });
}

export function apiPut<Response, Body = unknown>(
  url: string,
  body: Body,
  headers?: Record<string, string>,
  timeoutMs?: number
) {
  return xhrRequest<Response, Body>("PUT", url, { body, headers, timeoutMs });
}

export function apiDelete<Response>(
  url: string,
  headers?: Record<string, string>,
  timeoutMs?: number
) {
  return xhrRequest<Response>("DELETE", url, { headers, timeoutMs });
}
