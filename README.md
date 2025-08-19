# PrestaShop Playwright E2E Test Suite

End-to-end (E2E) test automation for the PrestaShop demo using Playwright and the Page Object Model (POM).

## Prerequisites

- Node.js v18 or newer
- npm v9 or newer

## Project Directory Structure

```
PrestaShop-Playwright/
├── fixtures/
│   └── registeredUser.json
├── page/
│   ├── AuthPage.js
│   ├── HomePage.js
│   ├── ProductPage.js
│   └── RegisterPage.js
├── playwright-report/
├── test-results/
├── tests/
│   ├── product-purchase.spec.js
│   ├── user-login.spec.js
│   └── user-registration.spec.js
├── utils/
│   └── testData.js
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

## Project Structure

- `fixtures/` — Generated user credentials
- `page/` — Page Object Model classes
- `playwright-report/` — Playwright HTML report
- `tests/` — Test files
- `utils/` — Test data utilities
- `package.json`, `package-lock.json` — Project manifest and lockfile
- `playwright.config.js` — Playwright configuration
- `README.md` — Project documentation

## Setup

```bash
git clone <your-repo-url>
cd PrestaShop-Playwright
npm install
npx playwright install
```

## Running Tests

- Run all tests (default: Chromium):
  ```bash
  npx playwright test
  ```
- Run a specific test file:
  ```bash
  npx playwright test tests/product-purchase.spec.js
  ```
- Run in headed mode (for debugging):
  ```bash
  npx playwright test --headed
  ```

## View HTML Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Notes

- Registration test generates credentials in `fixtures/registeredUser.json`.
- Each test has a global timeout of 60 seconds (see `playwright.config.js`).

## Troubleshooting

- If you see errors about missing credentials, run the registration test first.
- For flaky iframe or selector issues, check your network and try increasing timeouts.

## Useful Playwright Commands

- Update Playwright: `npx playwright install`
- Debug a test: `npx playwright test --debug`
- Run in headed mode: `npx playwright test --headed`

## Assumptions and Limitations

- **'Test case 1 success: Valid email and password' failing**
- The failure occurs because I’m unable to log in and verify that the “Sign Out” link is visible. This may be due to the PrestaShop demo site frequently resetting its data for each new browser instance. Even after registering manually and logging in, the behavior is inconsistent—sometimes it works for a while, but other times it immediately shows “Authentication Failed.”

- **E2E Product Purchase flow failing**
- The failure is due to the "Place order" button being disabled during the test run.
