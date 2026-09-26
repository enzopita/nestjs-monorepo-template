import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ApiError, createFetcher } from "./fetcher";

const statusSchema = z.object({ status: z.enum(["ok", "error"]) });

function recordingFetch(response: Response) {
  const calls: { url: string; init: RequestInit }[] = [];

  const fetchFn = async (url: string, init: RequestInit) => {
    calls.push({ url, init });

    return response;
  };

  return { calls, fetchFn };
}

describe("createFetcher", () => {
  it("prefixes the API origin and sends the session cookie without the schema", async () => {
    const { calls, fetchFn } = recordingFetch(Response.json({ status: "ok" }));
    const request = createFetcher("https://api.x.com", fetchFn);

    await request("/health/live", { method: "GET", schema: statusSchema });

    expect(calls).toEqual([
      { url: "https://api.x.com/health/live", init: { method: "GET", credentials: "include" } },
    ]);
  });

  it("returns the response parsed by the schema", async () => {
    const { fetchFn } = recordingFetch(Response.json({ status: "ok", extra: 1 }));
    const request = createFetcher("https://api.x.com", fetchFn);

    await expect(request("/health/live", { method: "GET", schema: statusSchema })).resolves.toEqual(
      { status: "ok" },
    );
  });

  it("rejects a response that does not match the schema", async () => {
    const { fetchFn } = recordingFetch(Response.json({ status: "maybe" }));
    const request = createFetcher("https://api.x.com", fetchFn);

    await expect(
      request("/health/live", { method: "GET", schema: statusSchema }),
    ).rejects.toBeInstanceOf(z.ZodError);
  });

  it("resolves without a value when the operation has no response schema", async () => {
    const { fetchFn } = recordingFetch(new Response(null, { status: 204 }));
    const request = createFetcher("https://api.x.com", fetchFn);

    await expect(request("/items/1", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("throws an ApiError with the status and parsed body on non-2xx", async () => {
    const { fetchFn } = recordingFetch(Response.json({ status: "error" }, { status: 503 }));
    const request = createFetcher("https://api.x.com", fetchFn);

    const result = request("/health/ready", { method: "GET", schema: statusSchema });

    await expect(result).rejects.toBeInstanceOf(ApiError);
    await expect(result).rejects.toMatchObject({ status: 503, body: { status: "error" } });
  });
});
