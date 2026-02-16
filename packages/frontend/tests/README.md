# Playwright Tests

End-to-end and integration tests using Playwright.

## Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Debug mode
npm run test:debug

# Run with coverage
npm run test:coverage
```

## Test Structure

Tests are located in the `tests/e2e/` directory with the `.spec.ts` extension.

## Configuration

Playwright configuration is defined in `playwright.config.ts` with support for:
- Multiple browsers (Chrome, Firefox, Safari)
- Mobile viewports (iPhone 12, Pixel 5)
- Local dev server auto-start
- HTML reports

See https://playwright.dev/docs/intro for more information.
