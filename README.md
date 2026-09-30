# Real World Tests - Playwright

E2E and API tests for [RealWorld (Conduit)](https://demo.realworld.show/) (`BASE_URL` / `API_URL` match `.env.example` and GitHub Actions).

## Setup

- Node.js 18+, npm 9+
- `npm install && npx playwright install`
- `cp .env.example .env`

## Commands

| Command                                  | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| `npm test`                               | Full run                                 |
| `npm run test:api`                       | `tests/api`                              |
| `npm run test:ui-only`                   | `tests/ui`                               |
| `npm run test:ui`                        | Playwright UI mode                       |
| `npm run test:debug`                     | Debug mode                               |
| `npm run test:smoke` / `test:regression` | Grep `@smoke` / `@regression` (see Tags) |
| `npm run lint` / `lint:fix`              | ESLint                                   |
| `npm run format`                         | Prettier                                 |
| `npx playwright show-report`             | HTML report after a run                  |

## What we test

| Layer          | Specs                                                                              | Covers                                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **UI (guest)** | `checkHomePage`, `checkNavigationComponents`, `articlesGrid`, `checkRegistration`  | Home, nav, feed, registration                                                                                                 |
| **UI (auth)**  | `checkLogin`, `checkHomePage`, `checkArticle`, `checkSettings`, **`checkProfile`** | Login form, logged-in home, create/delete article, settings + password change, **profile + favorites (API setup, UI assert)** |
| **API**        | `checkUserApi`, `checkArticleApi`                                                  | Login, current/updated user, articles, comments, status codes                                                                 |
| **Contract**   | **`contract.spec`**                                                                | **Zod** validates registration and create-article **JSON shape** (`UserSchema`, `ArticleSchema`)                              |

### Profile & hybrid tests (`checkProfile.spec.ts`)

Uses **`uiAuth`** + **`ApiHelper`** (`helpers/api.helper.ts`): data is prepared via **API** (create article, favorite by tag with `limit`), assertions run in **UI** on `ProfilePage` (`pages/profile.page.ts`).

### Helpers vs API client

|          | `api/clients/apiClient.ts`                   | `helpers/api.helper.ts`                                           |
| -------- | -------------------------------------------- | ----------------------------------------------------------------- |
| Use      | Raw HTTP in API tests and fixtures           | Reusable **steps** for UI tests                                   |
| Examples | `loginUser`, `getListArticles`, `updateUser` | `userCreatesArticle`, `getArticles`, `addToUserFavoritesArticles` |

### Contract tests (`tests/api/contract.spec.ts`)

Not business flows — they assert the **API response matches schemas** in `schemas/` after register / create article. Fast guard against backend contract drift.

## Tags

Every test has a layer tag (`@ui` / `@api`) and `@regression`. A core set of 8 tests also has `@smoke` (login, registration, article creation, home page, navigation, articles grid).

| Command                             | Runs                    |
| ----------------------------------- | ----------------------- |
| `npm run test:smoke`                | `@smoke` only           |
| `npm run test:regression`           | all `@regression` tests |
| `npx playwright test --grep "@api"` | API layer               |

Tags are set in the test title options: `base('name', { tag: ['@smoke', '@regression', '@ui'] }, async ...)`.

## Documentation

- [docs/TEST_CASES.md](docs/TEST_CASES.md) — manual test cases (positive, negative, boundary, edge) for settings and login
- [docs/TODO.md](docs/TODO.md) — what is still to be done (negative, boundary and edge scenarios, improvements)

## Project layout

```
api/clients/     ApiClient
fixtures/        authFixtures (UI), apiFixtures (API)
helpers/         ApiHelper — UI test data setup
pages/           POM (+ profile.page.ts, components/)
schemas/         Zod (contract tests)
tests/api/       HTTP + contract
tests/ui/        E2E
utils/           createTestUser, createArticleData
docs/            Test cases, TODO list
.github/workflows/playwright.yml
```

Auth in tests: **`uiAuth` / `registrationHelper`** (fixtures). Do not rely on `storageState.json` (not in `playwright.config`).

## Fixtures (short)

One **spec file = one runner** — no mixing `@playwright/test` `test()` and fixture `base()` in the same file.

| Scenario       | Import                                        | Declare tests with                                    |
| -------------- | --------------------------------------------- | ----------------------------------------------------- |
| Guest UI       | `test`, `expect` from `@playwright/test`      | `test(...)`                                           |
| UI + auth      | `expect` + `test as base` from `authFixtures` | `base(...)` — optional `uiAuth`, `registrationHelper` |
| API / contract | `test as base` from `apiFixtures`             | `base(...)` — `apiClient`, `testUser` (per test)      |

| Fixture              | Scope | Role                                                                            |
| -------------------- | ----- | ------------------------------------------------------------------------------- |
| `registrationHelper` | test  | Register user via API (e.g. login form test)                                    |
| `uiAuth`             | test  | JWT in `localStorage`, open app logged in                                       |
| `apiClient`          | test  | HTTP client                                                                     |
| `testUser`           | test  | Fresh registered user per test (tests that change the user cannot break others) |

`base` is just an alias for the extended `test` from fixture files.

## CI

On push/PR to `main` / `master`: `npm ci` → **`npm run lint`** → Playwright browsers → `playwright test` → artifact `playwright-report/` (30 days).

Env on runner: `BASE_URL`, `API_URL`, `TEST_USER_NEW_PASSWORD` in workflow (no `.env` file). CI runs with one worker; the demo site is unstable under parallel load.

## Debugging

- Config: trace on first retry, video/screenshot on failure (`playwright.config.ts`).
- Local: `npm test` → `npx playwright show-report` or `npx playwright show-trace path/to/trace.zip`.
- CI: download `playwright-report` from Actions.

Force trace: `npx playwright test checkLogin --trace on`.
