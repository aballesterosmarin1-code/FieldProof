# Personas

All people and companies below are fictional and are used for design, seed data and tests.

## Luis — technician

- Inspects fire extinguishers and HVAC units for Northwind Facility Services, 6–10 sites a day.
- Works in basements and plant rooms with no signal; often wears gloves.
- Uses a mid-range Android phone with limited storage.
- **Needs:** see today's assignments offline, scan an asset's QR code to open its checklist, answer quickly with large controls, take photos that are not lost if the app is killed, know what has and has not synced.
- **Frustrations:** retyping paper forms in the evening; losing photos when an upload fails; not knowing whether the office received his work.

## Mara — technician

- Works with Luis on large sites and sometimes on the same inspection.
- **Needs:** split a long checklist with a colleague without overwriting each other's answers; be told clearly when an answer conflicts.
- **Scenario:** in "Quarterly extinguisher check — Building C", Mara and Luis both answer item 7 while offline, with different values. After syncing, both answers are kept and a conflict is recorded for the supervisor.

## Priya — supervisor

- Plans the week's inspections for a team of eight technicians.
- Works at a desk in the web console.
- **Needs:** assign inspections with due dates, see submitted, conflicting and overdue work in separate queues, compare conflicting answers side by side with photos, and approve a report knowing exactly what the client will see.
- **Frustrations:** chasing technicians for missing photos; finding out about overwritten answers only after a client complains.

## Daniel — client viewer

- Facilities manager at a client that owns three of the inspected buildings.
- **Needs:** read approved reports and download the PDF for his own sites only.
- **Must never see:** drafts, conflicts, internal notes or other clients' sites.

## Ana — admin

- Operations lead who maintains checklist templates and scoring rules.
- **Needs:** edit a template, publish a new version without changing past inspections, and manage users and their roles.
- **Risk to design for:** a published template version must be immutable, so old reports keep the questions and rules they were scored with.
