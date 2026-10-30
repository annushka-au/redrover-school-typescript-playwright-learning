# FirstProject

A Playwright + TypeScript UI test automation project, built as part of the
RedRover school TypeScript/Testing course (Fall 2026). Tests run against the
public practice site [automationexercise.com](https://www.automationexercise.com).

## Tech stack

- [`@playwright/test`](https://playwright.dev/) ^1.64.1 - test runner and
  browser automation
- TypeScript (via `@types/node`)
- Chromium (the only browser project currently enabled in the config)

## How the project was created

This started from Playwright's own scaffold (`npm init playwright@latest`),
which generates `package.json`, `playwright.config.ts`, `.gitignore`, and a
default `tests/example.spec.ts`. From there:

### `playwright.config.ts` - modified from the default scaffold

- `use.baseURL` set to `https://www.automationexercise.com`, so every test
  can call `page.goto("/some-path")` with a relative path instead of writing
  the full URL each time.
- `use.viewport` set to `{ width: 1920, height: 1000 }` (scaffold default is
  smaller).
- Only the `chromium` project is active; the `firefox`, `webkit`, mobile, and
  branded-browser projects are left commented out (scaffold defaults).
- Everything else (`testDir`, `fullyParallel`, `retries`, `reporter: 'html'`,
  `trace: 'on-first-retry'`) is unchanged from the scaffold.

### `tests/example.spec.ts` - untouched

The default scaffold test Playwright generates (checks the Playwright docs
site's title and a "Get started" link). Left as-is as a reference/sanity
check; not related to this project's actual target site.

### `tests/myTests.spec.ts` - the actual project, written from scratch

Five tests against automationexercise.com, in one `test.describe` block:

1. **`verify page title`** - loads the homepage, asserts the page title
   equals `"Automation Exercise"`.
2. **`verify homepage`** - asserts the "Home" nav link has the expected
   highlighted color (`rgb(255, 165, 0)`).
3. **`verify logo`** - asserts the homepage logo image's `src` attribute.
4. **`verify product overlay`** - hovers the first product card and asserts
   its overlay's background color.
5. **`verify correct category`** - navigates directly to a specific product
   page (`/product_details/1`) and asserts the displayed category text.

### Bugs found and fixed while writing test 5

Test 5 originally tried to reach the product page by clicking a homepage
link rather than navigating directly, which surfaced two real bugs before
settling on the current approach:

- `page.locator(...).click` was referenced without calling it (`click()`
  missing) and without `await`, so the click never actually happened.
- The selector string itself was malformed (`"'a[href='/product_details/1']"`
  had a stray leading quote), which once the `click()` call was added,
  produced a CSS parse error (`Unexpected token "/"`).
- Even after fixing both of those, clicking through the homepage proved
  unreliable - the site's Google "Vignette" interstitial ad can intercept
  the click and redirect to a `#google_vignette` fragment instead of the
  product page. Since this test's actual job is to verify category text
  on the product page (not to verify the homepage link works), the fix was
  to navigate directly with `page.goto("/product_details/1")` instead of
  clicking through - removing an unrelated, flaky failure point.

## Running the tests

```bash
npm install
npx playwright test
```

Run a single file:

```bash
npx playwright test tests/myTests.spec.ts
```

Interactive UI mode (step through tests, inspect each action):

```bash
npx playwright test --ui
```

View the HTML report after a run:

```bash
npx playwright show-report
```

## Known notes

- The target site occasionally logs a browser console warning
  (`Mixed Content: ... insecure stylesheet ... fonts.googleapis.com`) - this
  comes from the site itself (an `http://` font stylesheet on an `https://`
  page) and does not affect any of the assertions above.
