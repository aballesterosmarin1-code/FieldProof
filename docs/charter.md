# FieldProof charter

## Problem

Maintenance technicians inspect fire extinguishers, HVAC units, elevators and forklifts in basements and remote sites where the signal is weak or absent. Paper forms and spreadsheets lose photos, get retyped in the office, and reports reach the client days later. When two technicians work the same job, the last person to save often overwrites the other without anyone noticing.

## Goal

A technician can complete a checklist, take photos and sign off with no connectivity. When the signal returns, the work syncs without losing or silently overwriting anything. A supervisor reviews and approves every report before a client sees it.

## Users

| Role | Where | Main jobs |
|---|---|---|
| Technician | Mobile app (Android, iOS) | Find assigned inspections, scan asset QR codes, answer checklists, take photos, sign off |
| Supervisor | Web console | Assign inspections, resolve conflicts, review drafts, approve reports |
| Client viewer | Web console | Read approved reports for their own sites |
| Admin | Web console | Manage checklist templates, scoring rules and users |

Details and scenarios: [personas](personas.md). Terms: [glossary](glossary.md).

## In scope (MVP)

- Sign-in, organizations and roles enforced by security rules
- Sites, assets and offline QR lookup
- Versioned checklist templates with deterministic scoring and re-inspection dates
- Assignments with due dates
- Offline inspection runner with photos, notes and signature
- Sync built on append-only answer events with client-generated IDs
- Explicit conflict records with supervisor resolution
- Photo pipeline with server-side validation and EXIF/GPS removal
- Submission, review queue and push notifications without sensitive content

Later: drafted report narratives and photo tag suggestions that a supervisor must approve, approved PDF reports, the client viewer area, and hardening.

## Out of scope

- Certified compliance or regulatory inspection records
- Live location tracking or precise site coordinates
- Payments, invoicing and IoT sensors
- A public iOS build (needs macOS and an Apple developer account); the demo uses an Android test build and the web console

## Success criteria

These are test targets for the project, not claimed production performance.

- No answer is lost across offline/online cycles in sync tests.
- Conflicting concurrent answers always produce a conflict record; identical answers never do.
- The Dart preview and TypeScript authoritative scoring engines agree on every golden fixture.
- Every approved report has a human approver.
- Security rules deny by default, and every collection has rules tests.
- Cold start and runner frame times are measured on a named mid-range Android device.

## Constraints

- All companies, sites, assets, people and photos are synthetic or staged.
- Local development and CI run on the Firebase Local Emulator Suite; no paid credentials or live project are needed.
- Client code never decides access: navigation guards are a convenience, rules and functions enforce it.

## Key decisions

- [ADR 0001: Offline-first on Firebase with append-only events](adr/0001-offline-first-on-firebase.md)
