#!/usr/bin/env node
// Creates the synthetic demo accounts in the Firebase Auth emulator.
//
// Safe to run repeatedly: existing accounts are reported and left unchanged.
// It only ever talks to an emulator on a loopback address, never to a real
// Firebase project. Role claims are not set here yet; they come from the
// `setUserRole` callable in week 2.
//
// Usage: npm run demo:users   (with the emulators running)

const DEFAULT_HOST = "127.0.0.1:9099";

/** Shared password for every demo account. Emulator only. */
const DEMO_PASSWORD = "fieldproof-demo";

/** Fictional people from docs/personas.md, all in the demo org `acme`. */
const DEMO_USERS = [
  { email: "luis.technician@acme-demo.example", displayName: "Luis (technician)", role: "technician" },
  { email: "mara.technician@acme-demo.example", displayName: "Mara (technician)", role: "technician" },
  { email: "priya.supervisor@acme-demo.example", displayName: "Priya (supervisor)", role: "supervisor" },
  { email: "daniel.client@acme-demo.example", displayName: "Daniel (client viewer)", role: "client_viewer" },
  { email: "ana.admin@acme-demo.example", displayName: "Ana (admin)", role: "admin" },
];

/** Returns the emulator base URL, refusing anything that is not loopback. */
function emulatorBaseUrl(host = process.env.FIREBASE_AUTH_EMULATOR_HOST || DEFAULT_HOST) {
  const url = new URL(`http://${host}`);
  const loopback = ["127.0.0.1", "localhost", "[::1]"];
  if (!loopback.includes(url.hostname)) {
    throw new Error(`Refusing to create demo users on non-loopback host "${host}".`);
  }
  return `${url.origin}/identitytoolkit.googleapis.com/v1`;
}

async function signUp(baseUrl, user) {
  const response = await fetch(`${baseUrl}/accounts:signUp?key=demo-api-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: user.email, password: DEMO_PASSWORD, displayName: user.displayName }),
  });
  if (response.ok) return "created";
  const body = await response.json().catch(() => ({}));
  if (body?.error?.message === "EMAIL_EXISTS") return "exists";
  throw new Error(`Sign-up failed for ${user.email}: ${response.status} ${body?.error?.message ?? ""}`.trim());
}

async function main() {
  const baseUrl = emulatorBaseUrl();
  for (const user of DEMO_USERS) {
    let outcome;
    try {
      outcome = await signUp(baseUrl, user);
    } catch (error) {
      if (error?.cause?.code === "ECONNREFUSED") {
        throw new Error("Auth emulator is not running. Start it with `npm run emulators` first.");
      }
      throw error;
    }
    console.log(`${outcome.padEnd(7)} ${user.email} (${user.role})`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
