# ADR 0001: Offline-first on Firebase with append-only events

- **Status:** Accepted
- **Date:** 2026-11-25

## Context

Technicians work where there is often no signal, sometimes for a whole visit. They need to finish an inspection offline, including photos and a signature, and have it sync later without losing work. Two technicians may work on the same inspection, offline, at the same time. Supervisors need a web console. The project should run fully on a laptop and in CI without paid services.

Options considered:

1. **Custom REST API with a relational database and a hand-written client cache.** Full control, but we would have to build offline storage, retry, auth and push delivery ourselves for both a mobile app and a web console.
2. **A sync framework with a separate database (for example a CRDT library or a document database with replication).** Good merge semantics, but merging answers automatically is the opposite of what we want for inspection data: conflicting answers must be visible, not merged.
3. **Firebase (Auth, Firestore, Storage, Functions) with Flutter, writing answers as append-only events.** Firestore already persists documents and queued writes offline on the device, Storage supports resumable uploads, Functions run trusted logic, and the Local Emulator Suite runs all of it locally and in CI.

## Decision

We use option 3.

- **Clients:** one Flutter codebase family: `apps/mobile` (Android, iOS) and `apps/console` (web), sharing pure Dart code in `packages/fieldproof_core`. Dart pub workspaces with Melos scripts manage the repository.
- **Data:** Cloud Firestore with offline persistence. Inspection answers are **append-only event documents** in `orgs/{orgId}/inspections/{id}/events/{eventId}`; the event ID is a ULID generated on the device.
- **Trusted logic:** Cloud Functions (TypeScript) fold events into the inspection, detect conflicts, compute the authoritative score and set custom claims. Only functions write `status`, `result`, `score`, `revision` and conflict documents.
- **Access:** Firebase Authentication with `{orgId, role}` custom claims. Firestore and Storage rules deny by default and are tested against the emulators. App navigation guards are UX only.
- **Photos:** Cloud Storage resumable uploads, plus a local queue for files and upload state. A function validates each photo and strips EXIF/GPS metadata before marking it accepted.
- **Ordering and conflicts:** events are ordered by server time (`receivedAt`), never by device clocks. Each event carries the `baseRevision` the device last saw; two different answers to the same question that did not see each other create a conflict record instead of overwriting.
- **Environments:** weeks 1–4 use the Emulator Suite only; a separate staging project comes later.

## Consequences

**Positive**

- Offline document writes and their retries come from the Firestore SDK; we focus on the event protocol and conflict rules.
- A retried event write has the same ID and content, so it is harmless. Rebuilding state from the full event list makes the fold idempotent even when triggers are delivered more than once.
- Nothing is silently overwritten: every answer stays in the log, and conflicts are explicit documents.
- Everything, including rules tests, runs locally and in CI on the emulators with no paid credentials.

**Negative / risks**

- Cloud Functions cannot run Dart, so scoring exists twice: a Dart preview engine and a TypeScript authoritative engine. Mitigation: one set of golden JSON fixtures that both engines must pass in CI.
- Firestore cost scales with reads and writes, and an event per answer means many small writes. Mitigation: events go to a subcollection (not one hot document), no global counters, and reads/writes per inspection are measured and documented.
- Folding the full event list on every trigger costs more as inspections grow. Accepted for the MVP; incremental folding is a later optimization.
- Firestore's offline cache does not hold binary files, so photos need our own local queue (SQLite) and resumable upload handling.
- We depend on Firebase services and their pricing. Shared logic stays in plain Dart and TypeScript modules so it could move to another backend.

## Follow-ups

- Sync protocol spec in `docs/sync-protocol/` before offline writes are built.
- Rules tests for every collection as each one is added.
