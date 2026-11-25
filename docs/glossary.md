# Glossary

Terms used in code, documents and the UI. Wire names (the strings stored in Firestore and tokens) are in `code` and are defined in `packages/fieldproof_core`.

| Term | Meaning |
|---|---|
| **Organization (org)** | A maintenance company using FieldProof. Every document belongs to exactly one org, and users only see their own org's data. |
| **Role** | A user's role in an org: `technician`, `supervisor`, `client_viewer` or `admin`. Issued as a custom claim by a Cloud Function, never chosen by the client. |
| **Client** | A customer of the org who owns sites. Client viewers are users who belong to a client. |
| **Site** | A building or location where assets are inspected. Has an area label, not precise coordinates. |
| **Asset** | One piece of equipment at a site (extinguisher, HVAC unit, elevator, forklift). Belongs to exactly one site. |
| **QR token** | A random token printed on an asset's QR label. It is not the serial number, so a label does not reveal asset details. |
| **Checklist template** | The questions, required photos and scoring rules for one type of inspection. |
| **Template version** | A published snapshot of a template. Immutable once published; every inspection records the version it used. |
| **Question** | One checklist item, with a type (yes/no, choice, number, text, photo, signature). |
| **Scoring rule** | `{id, when: {questionId, operator, value}, severity, action}`. Applied to answers to produce failures and a result. |
| **Severity** | How serious a rule failure is (for example minor, major, critical). Any critical failure fails the inspection and severity sets the re-inspection interval. |
| **Inspection** | One run of a template version on one asset, assigned to one or more technicians with a due date. |
| **Assignment** | The link between an inspection and its technicians. Technicians only see inspections assigned to them. |
| **Inspection status** | `assigned` → `in_progress` → `submitted` → `approved`. Written only by Cloud Functions. |
| **Event** | An append-only record in `inspections/{id}/events`, one of `answer`, `note`, `photo_ref`, `signature` or `submit`. Events are never edited. |
| **Event ID** | A ULID generated on the device, so a retried write of the same event is recognised as the same event. |
| **Revision** | A counter on the inspection that increases each time the server folds new events into it. |
| **Base revision** (`baseRevision`) | The inspection revision the device last saw when it wrote an event. Used to tell whether two answers were made without seeing each other. |
| **Received at** (`receivedAt`) | Server time when an event was written. Orders events; device clocks are never trusted. |
| **Fold** | Rebuilding an inspection's state from its full event list in server order. Running it again gives the same result. |
| **Conflict** | Recorded when two authors answer the same question with different values and neither had seen the other's answer. Blocks submission until a supervisor resolves it. Identical answers are not a conflict. |
| **Resolution** | A supervisor's choice for a conflict, written as a new event so replaying the log reproduces it. |
| **Preview score** | The result computed on the device by the Dart engine. Shown as "preview"; never authoritative. |
| **Authoritative score** | The result computed by the TypeScript engine in Cloud Functions. Always wins. |
| **Golden fixture** | A shared JSON case (template, answers, expected result) that both scoring engines must pass. |
| **Re-inspection date** | Completion date plus a number of days set by the worst severity, computed in the org's timezone. |
| **Pending queue** | Events and photos on the device that the server has not yet confirmed. |
| **Report** | The approved, read-only summary of an inspection, with a PDF and content hash, visible to client viewers. |
| **Draft** | A suggested report narrative or photo tags waiting for supervisor approval. Never visible to clients. |
| **Emulator Suite** | The Firebase Local Emulator Suite (Auth, Firestore, Storage, Functions) used for development and CI. |
