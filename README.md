# FirstProject

Playwright + TypeScript UI test automation, built for the RedRover school
TypeScript/Testing course (Fall 2026). Tests target the public practice site
[automationexercise.com](https://www.automationexercise.com).

## Tech stack

- [`@playwright/test`](https://playwright.dev/) ^1.64.1
- TypeScript (via `@types/node`)
- Chromium only (other browser projects left commented out in the config)

## Structure

- `tests/example.spec.ts` - default Playwright scaffold test, untouched.
- `tests/myTests.spec.ts` - six CSS-locator/assertion exercises, written
  directly against `page`.
- `pages/`, `fixtures/pages.ts`, `tests/pom.spec.ts` - the same six checks
  rewritten with:
  - **Page Object Model** - `HomePage.ts` / `ProductDetailsPage.ts` hold the
    locators and actions.
  - **Fixtures** - `fixtures/pages.ts` hands each test ready-made Page
    Objects and blocks ad requests before it runs.
  - **Parallel execution** - `test.describe.configure({ mode: "parallel" })`.
- `playwright.config.ts` - `baseURL` set to the target site, one local retry
  + screenshot-on-failure for flaky runs, `list` + `html` reporters.

## Running the tests

```bash
npm install
npm test
```

Run one file:

```bash
npx playwright test tests/myTests.spec.ts
```

UI mode / HTML report:

```bash
npx playwright test --ui
npm run report
```

## Known notes

- The target site sometimes serves a "heavy load / queue full" page or a
  mixed-content font warning under concurrent/parallel traffic - unrelated to
  the assertions, and covered by the config's retry.
