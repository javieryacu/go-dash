---
description: Run unit tests and E2E tests for the project
---
# Run Tests

## Unit Tests (Vitest)

// turbo
1. Run all unit tests:
```bash
npm run test
```

// turbo
2. Run tests in watch mode during development:
```bash
npm run test:watch
```

// turbo
3. Generate coverage report:
```bash
npm run test:coverage
```

## E2E Tests (Playwright)

// turbo
4. Run E2E tests:
```bash
npm run test:e2e
```

// turbo
5. Run E2E tests with UI:
```bash
npm run test:e2e:ui
```

## Notes
- Unit tests are in `src/__tests__/`
- E2E tests are in `e2e/`
- Coverage threshold: 80%
