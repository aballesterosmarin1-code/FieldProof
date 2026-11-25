import { setGlobalOptions } from "firebase-functions/v2";
import { onCall } from "firebase-functions/v2/https";

import { buildHealth } from "./health.js";

// Every function runs in one EU region and is capped so a bug or abuse cannot
// scale costs without limit.
setGlobalOptions({ region: "europe-west1", maxInstances: 10 });

/** Liveness check for clients and CI. Callable with or without signing in. */
export const health = onCall((request) => buildHealth(request));
