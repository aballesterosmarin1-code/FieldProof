import { assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { deleteObject, getBytes, getMetadata, listAll, ref, uploadBytes } from "firebase/storage";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

import { claims, startRulesEnv } from "./env.js";

let env: RulesTestEnvironment;

const photo = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]); // smallest JPEG markers
const paths = [
  "orgs/acme/inspections/insp-1/photos/photo-1.jpg",
  "orgs/acme/reports/report-1.pdf",
  "public/logo.png",
];

beforeAll(async () => {
  env = await startRulesEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearStorage();
  await env.withSecurityRulesDisabled(async (ctx) => {
    for (const path of paths) {
      await uploadBytes(ref(ctx.storage(), path), photo, { contentType: "image/jpeg" });
    }
  });
});

const callers = [
  ["anonymous", () => env.unauthenticatedContext()],
  ["signed in without claims", () => env.authenticatedContext("user-1")],
  ["technician", () => env.authenticatedContext("tech-1", claims.technician)],
  ["supervisor", () => env.authenticatedContext("sup-1", claims.supervisor)],
  ["admin", () => env.authenticatedContext("admin-1", claims.admin)],
] as const;

describe("Storage rules deny by default", () => {
  it("lets the seed bypass rules, so denials below come from the rules", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await assertSucceeds(getMetadata(ref(ctx.storage(), paths[0]!)));
    });
  });

  describe.each(callers)("%s", (_name, context) => {
    it.each(paths)("cannot read %s", async (path) => {
      const storage = context().storage();
      await assertFails(getBytes(ref(storage, path)));
      await assertFails(getMetadata(ref(storage, path)));
    });

    it.each(paths)("cannot upload over or delete %s", async (path) => {
      const storage = context().storage();
      await assertFails(uploadBytes(ref(storage, path), photo, { contentType: "image/jpeg" }));
      await assertFails(deleteObject(ref(storage, path)));
    });

    it("cannot upload new objects or list folders", async () => {
      const storage = context().storage();
      await assertFails(
        uploadBytes(ref(storage, "orgs/acme/inspections/insp-1/photos/new.jpg"), photo, {
          contentType: "image/jpeg",
        }),
      );
      await assertFails(listAll(ref(storage, "orgs/acme")));
    });
  });
});
