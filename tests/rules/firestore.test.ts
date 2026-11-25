import { assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { claims, startRulesEnv } from "./env.js";

let env: RulesTestEnvironment;

// Paths the app will use later; until each gets its own rule, all are closed.
const paths = [
  "orgs/acme",
  "orgs/acme/sites/site-1",
  "orgs/acme/inspections/insp-1",
  "orgs/acme/inspections/insp-1/events/01JF0000000000000000000000",
  "users/tech-1",
  "anything/else",
];

beforeAll(async () => {
  env = await startRulesEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  // Seed through the Admin path so reads have something to deny.
  await env.withSecurityRulesDisabled(async (ctx) => {
    for (const path of paths) {
      await setDoc(doc(ctx.firestore(), path), { seeded: true });
    }
  });
});

const callers = [
  ["anonymous", () => env.unauthenticatedContext()],
  ["signed in without claims", () => env.authenticatedContext("user-1")],
  ["technician", () => env.authenticatedContext("tech-1", claims.technician)],
  ["supervisor", () => env.authenticatedContext("sup-1", claims.supervisor)],
  ["client viewer", () => env.authenticatedContext("client-1", claims.clientViewer)],
  ["admin", () => env.authenticatedContext("admin-1", claims.admin)],
] as const;

describe("Firestore rules deny by default", () => {
  it("lets the seed bypass rules, so denials below come from the rules", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      const snapshot = await getDoc(doc(ctx.firestore(), "orgs/acme"));
      expect(snapshot.data()).toEqual({ seeded: true });
    });
  });

  describe.each(callers)("%s", (_name, context) => {
    it.each(paths)("cannot read %s", async (path) => {
      await assertFails(getDoc(doc(context().firestore(), path)));
    });

    it.each(paths)("cannot create, update or delete %s", async (path) => {
      const db = context().firestore();
      await assertFails(setDoc(doc(db, `${path}-new`), { value: 1 }));
      await assertFails(updateDoc(doc(db, path), { value: 2 }));
      await assertFails(deleteDoc(doc(db, path)));
    });

    it("cannot list collections", async () => {
      const db = context().firestore();
      await assertFails(getDocs(collection(db, "orgs")));
      await assertFails(getDocs(collection(db, "orgs/acme/inspections/insp-1/events")));
    });
  });

  it("still lets the admin path read after client writes were denied", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await assertSucceeds(getDoc(doc(ctx.firestore(), "orgs/acme/inspections/insp-1")));
    });
  });
});
