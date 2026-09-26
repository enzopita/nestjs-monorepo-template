import { z } from "zod";

import { env } from "@/env";

type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

// JSON values already include strings, so a non-JSON body fits as its raw text.
const errorBodySchema = z.json().optional();

export type ErrorBody = z.infer<typeof errorBodySchema>;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ErrorBody,
  ) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
  }
}

function parseErrorBody(text: string): ErrorBody {
  if (text === "") return undefined;

  try {
    return errorBodySchema.parse(JSON.parse(text));
  } catch {
    return text;
  }
}

type RequestOptions = Omit<RequestInit, "credentials">;

export function createFetcher(baseUrl: string, fetchFn: FetchFn) {
  // z.url() accepts a trailing slash; Orval paths start with one.
  const origin = baseUrl.replace(/\/+$/, "");

  // Orval passes the response's Zod schema (includeZodSchemaInArguments) and
  // omits it only for operations without a JSON body to validate.
  function request<T>(path: string, options: RequestOptions & { schema: z.ZodType<T> }): Promise<T>;
  function request<T extends void>(path: string, options: RequestOptions): Promise<T | undefined>;
  async function request<T>(
    path: string,
    { schema, ...init }: RequestOptions & { schema?: z.ZodType<T> },
  ): Promise<T | undefined> {
    // The API lives on another origin, so session cookies must be sent explicitly.
    const response = await fetchFn(`${origin}${path}`, { ...init, credentials: "include" });
    const text = await response.text();

    if (!response.ok) throw new ApiError(response.status, parseErrorBody(text));

    return schema?.parse(text === "" ? undefined : JSON.parse(text));
  }

  return request;
}

// Orval types query and mutation errors with this. Error bodies are not validated
// and failures are not only ApiError (network, abort, schema mismatch), so the
// spec's error body type is not trusted: narrow with `instanceof ApiError`, then
// parse `body` with the generated error schema.
export type ErrorType<_TBody> = Error;

// Mutator used by the Orval-generated client (see orval.config.ts).
export const customFetch = createFetcher(env.VITE_API_URL, (url, init) => fetch(url, init));
