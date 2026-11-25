import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";

/** The demo project ID; `demo-` projects never reach real Firebase resources. */
export const PROJECT_ID = "demo-fieldproof";

const repoRoot = resolve(import.meta.dirname, "../..");

/**
 * Starts a rules test environment against the running emulators, using the
 * rules files from the repository. Hosts and ports come from the
 * `FIRESTORE_EMULATOR_HOST` / `FIREBASE_STORAGE_EMULATOR_HOST` variables that
 * `firebase emulators:exec` sets.
 */
export function startRulesEnv(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(repoRoot, "firebase/firestore.rules"), "utf8"),
    },
    storage: {
      rules: readFileSync(resolve(repoRoot, "firebase/storage.rules"), "utf8"),
    },
  });
}

/** Custom claims for a signed-in user, shaped like the future role claims. */
export const claims = {
  technician: { org_id: "acme", role: "technician" },
  supervisor: { org_id: "acme", role: "supervisor" },
  clientViewer: { org_id: "acme", role: "client_viewer" },
  admin: { org_id: "acme", role: "admin" },
} as const;
