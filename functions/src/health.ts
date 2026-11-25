import type { CallableRequest } from "firebase-functions/v2/https";

/** Name reported by the health callable. */
export const SERVICE_NAME = "fieldproof-functions";

/** Response of the `health` callable. */
export interface HealthResponse {
  status: "ok";
  service: typeof SERVICE_NAME;
  /** Server time as an ISO 8601 string, so clients never rely on device clocks. */
  serverTime: string;
  /** Whether the caller sent a valid Firebase Auth ID token. */
  authenticated: boolean;
  /** Whether the call reached the Local Emulator Suite rather than a real project. */
  emulator: boolean;
}

/**
 * Builds the health response. It deliberately reports no user ID, claims or
 * configuration, so it is safe to call without signing in.
 */
export function buildHealth(
  request: Pick<CallableRequest<unknown>, "auth">,
  now: Date = new Date(),
  env: NodeJS.ProcessEnv = process.env,
): HealthResponse {
  return {
    status: "ok",
    service: SERVICE_NAME,
    serverTime: now.toISOString(),
    authenticated: request.auth != null,
    emulator: env.FUNCTIONS_EMULATOR === "true",
  };
}
