import functionsTest from "firebase-functions-test";
import { afterAll, describe, expect, it } from "vitest";

import { buildHealth, SERVICE_NAME } from "../src/health.js";
import { health } from "../src/index.js";

// Offline mode: no project credentials, nothing leaves the machine.
const testEnv = functionsTest();

afterAll(() => {
  testEnv.cleanup();
});

describe("buildHealth", () => {
  const now = new Date("2026-11-25T10:00:00.000Z");

  it("reports ok with server time for anonymous callers", () => {
    expect(buildHealth({}, now, {})).toEqual({
      status: "ok",
      service: SERVICE_NAME,
      serverTime: "2026-11-25T10:00:00.000Z",
      authenticated: false,
      emulator: false,
    });
  });

  it("reports authenticated callers without exposing who they are", () => {
    const result = buildHealth(
      {
        auth: {
          uid: "tech-1",
          token: { org_id: "acme", role: "technician" } as never,
          rawToken: "raw-token",
        },
      },
      now,
      {},
    );

    expect(result.authenticated).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/tech-1|acme|technician|raw-token/);
  });

  it("detects the Functions emulator", () => {
    expect(buildHealth({}, now, { FUNCTIONS_EMULATOR: "true" }).emulator).toBe(
      true,
    );
  });
});

describe("health callable", () => {
  it("returns the health response through the callable wrapper", async () => {
    const wrapped = testEnv.wrap(health);
    const result = await wrapped({ data: {} } as never);

    expect(result).toMatchObject({ status: "ok", service: SERVICE_NAME });
    expect(Number.isNaN(Date.parse(result.serverTime))).toBe(false);
  });

  it("is deployed in the configured region", () => {
    expect(health.__endpoint.region).toEqual(["europe-west1"]);
    expect(health.__endpoint.callableTrigger).toBeDefined();
  });
});
