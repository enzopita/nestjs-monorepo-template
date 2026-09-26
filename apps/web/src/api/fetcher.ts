import { z } from "zod";

import { env } from "@/env";

type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

const errorBodySchema = z.union([z.json(), z.string()]).optional();

export type ErrorBody = z.infer<typeof errorBodySchema>;

export class ApiError<TBody = ErrorBody> extends Error {
  constructor(
    readonly status: number,
    readonly body: TBody,
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
  // Orval passes the response's Zod schema (includeZodSchemaInArguments) and
  // omits it only for operations without a JSON body to validate.
  function request<T>(path: string, options: RequestOptions & { schema: z.ZodType<T> }): Promise<T>;
  function request<T extends void>(path: string, options: RequestOptions): Promise<T | undefined>;
  async function request<T>(
    path: string,
    { schema, ...init }: RequestOptions & { schema?: z.ZodType<T> },
  ): Promise<T | undefined> {
    // The API lives on another origin, so session cookies must be sent explicitly.
    const response = await fetchFn(`${baseUrl}${path}`, { ...init, credentials: "include" });
    const text = await response.text();

    if (!response.ok) throw new ApiError(response.status, parseErrorBody(text));

    return schema?.parse(text === "" ? undefined : JSON.parse(text));
  }

  return request;
}

// Orval types query and mutation errors with this: customFetch throws ApiError
// carrying the error response body declared in the spec.
export type ErrorType<TBody> = ApiError<TBody>;

// Mutator used by the Orval-generated client (see orval.config.ts).
export const customFetch = createFetcher(env.VITE_API_URL, (url, init) => fetch(url, init));
