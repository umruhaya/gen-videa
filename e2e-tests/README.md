# Testing

## Pre Rquisites

Make sure that the Development Server is started for web client to effectively test the ui
```bash
# from root of directory
cd web-client
pnpm proxy

# in another terminal
cd web-client
pnpm dev
```

## Getting Started

```bash
# install browser for playwright
pnpm exec playwright install
# run the test cases
pnpm exec playwright test
```

nside that directory, you can run several commands:

Runs the end-to-end tests: `pnpm exec playwright test`

Starts the interactive UI mode: `pnpm exec playwright test --ui`

Runs the tests only on Desktop Chrome: `pnpm exec playwright test --project=chromium`

Runs the tests in a specific file: `pnpm exec playwright test example`

Runs the tests in debug mode: `pnpm exec playwright test --debug`

Auto generate tests with Codegen: `pnpm exec playwright codegen`

We suggest that you begin by typing:
   `pnpm exec playwright test`

### File Structure
- .\tests\example.spec.ts - Example end-to-end test
- .\playwright.config.ts - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨

Happy hacking! 🎭