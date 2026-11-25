# Local setup

Everything runs locally on the Firebase Local Emulator Suite. No real Firebase project, paid credentials or model keys are needed, and the project ID `demo-fieldproof` makes the Firebase tools refuse to reach any real resource.

## Requirements

| Tool | Version | Used for |
|---|---|---|
| Flutter | 3.47 or newer (CI pins 3.50.1), Dart 3.13+ | Mobile app, web console, `fieldproof_core` |
| Node.js | 22 | Cloud Functions, Firebase CLI, rules tests |
| Java | 21 | Firestore and Storage emulators |
| Chrome | any recent | Running the web console with `flutter run -d chrome` |

The Firebase CLI is a dev dependency (`firebase-tools`), so `npm install` is enough; no global install is needed. The first emulator start downloads the emulator binaries to `~/.cache/firebase/emulators`.

## First run

```bash
flutter pub get                     # whole Dart workspace (apps + packages)
npm install                         # Firebase CLI and rules test tooling
npm --prefix functions install      # Cloud Functions dependencies
dart run melos run check            # Dart: format check, analyze, tests
npm --prefix functions run check    # Functions: typecheck, tests, build
npm run test:rules                  # Firestore and Storage rules tests
```

## Emulator workflow

```bash
npm run emulators
```

This builds the functions and starts Auth, Functions, Firestore and Storage. The Emulator UI is at <http://127.0.0.1:4000>.

| Emulator | Address |
|---|---|
| Emulator UI | 127.0.0.1:4000 |
| Auth | 127.0.0.1:9099 |
| Functions | 127.0.0.1:5001 |
| Firestore | 127.0.0.1:8080 |
| Storage | 127.0.0.1:9199 |
| Hub | 127.0.0.1:4400 |

Notes:

- Emulator data is kept in memory and lost when the emulators stop.
- After changing function code, run `npm run functions:build` in another terminal; the Functions emulator reloads the built code.
- Rules files (`firebase/firestore.rules`, `firebase/storage.rules`) reload automatically while the emulators run.
- `npm run test:rules` starts its own Firestore and Storage emulators with `firebase emulators:exec` and stops them afterwards, so stop `npm run emulators` first if the ports are busy.
- To check the functions are up, call the `health` callable:

  ```bash
  curl -s -X POST -H 'content-type: application/json' -d '{"data":{}}' \
    http://127.0.0.1:5001/demo-fieldproof/europe-west1/health
  ```

## Demo accounts

With the emulators running, create the synthetic demo accounts in the Auth emulator:

```bash
npm run demo:users
```

The script only talks to an emulator on a loopback address and can be run repeatedly; existing accounts are left unchanged. All accounts use the password `fieldproof-demo` and belong to the fictional demo org `acme` (see [personas](personas.md)).

| Email | Persona | Intended role |
|---|---|---|
| `luis.technician@acme-demo.example` | Luis | technician |
| `mara.technician@acme-demo.example` | Mara | technician |
| `priya.supervisor@acme-demo.example` | Priya | supervisor |
| `daniel.client@acme-demo.example` | Daniel | client viewer |
| `ana.admin@acme-demo.example` | Ana | admin |

Role claims are not assigned yet: until the `setUserRole` callable lands (week 2), these accounts can sign in but the deny-by-default rules give them no access. The `.example` domain is reserved, so these addresses can never reach a real inbox.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request:

| Job | Steps |
|---|---|
| Flutter analyze and tests | `flutter pub get --enforce-lockfile`, `dart run melos run check`, web console build |
| Cloud Functions | `npm ci`, `npm run check` (typecheck, Vitest, build) |
| Security rules | `npm ci`, `npm run test:rules` on the Firestore and Storage emulators, demo accounts script run twice on the Auth emulator |

CI needs no secrets and no Firebase project.
