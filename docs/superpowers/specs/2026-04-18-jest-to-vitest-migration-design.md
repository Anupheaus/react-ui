# Jest → Vitest Migration Design

**Date:** 2026-04-18  
**Status:** Approved

---

## Overview

Migrate the existing Jest test infrastructure to Vitest. Goals: faster test runs, better TypeScript/ESM support, co-located test files, and a visual test UI. No test logic changes required — existing tests use plain `describe`/`it`/`expect` which Vitest supports natively.

---

## Architecture

### Config

Replace `tests/jest/jest.config.js` with `vitest.config.ts` at the repo root. The old `tests/jest/` directory is deleted entirely.

```
vitest.config.ts          ← new, at repo root
src/tests/setup.ts        ← replaces tests/jest/setup.js + tests/jest/startup.ts
```

`vitest.config.ts` settings:
- `environment: 'jsdom'`
- `globals: true` — keeps `describe`/`it`/`expect` without explicit imports
- `include: ['src/**/*.tests.ts?(x)']` — matches existing naming convention
- `setupFiles: ['src/tests/setup.ts']`
- `coverage` block: provider `v8`, includes `src/**`, excludes `**/*.stories.*`, `**/*.tests.*`, `**/index.ts?(x)`, `src/Storybook/**`

### Setup File

`src/tests/setup.ts` consolidates the two Jest setup files:
- `import '@testing-library/jest-dom/vitest'` — Vitest-compatible DOM matchers
- Sets `global.TextEncoder` / `global.TextDecoder` from `util`
- Sets `global.React` and `global.ReactDOM` (kept for any tests that rely on globals)

### Test File Locations

All 4 existing test files are already co-located next to their source — no moves required:

| Test file | Source file |
|---|---|
| `src/theme/hoistMediaQueries.tests.ts` | `src/theme/hoistMediaQueries.ts` |
| `src/components/Windows/Windows.tests.tsx` | `src/components/Windows/` |
| `src/components/Selector/SelectorButton.tests.tsx` | `src/components/Selector/SelectorButton*` |
| `src/providers/EmailProvider/EmailProvider.tests.tsx` | `src/providers/EmailProvider/` |

New test files written going forward live next to their source file, named `<SourceFile>.tests.ts(x)`.

---

## Package Changes

### Remove
- `jest`
- `jest-environment-jsdom`
- `@swc/jest`
- `@types/jest`
- `jest-image-snapshot` — kept (used by Storybook test-runner, not Jest)
- `@types/jest-image-snapshot` — kept (same reason)

### Add
- `vitest` — test runner
- `@vitest/ui` — browser-based test dashboard (`pnpm test:ui`)
- `@vitest/coverage-v8` — native V8 coverage, no Babel overhead
- `@vitejs/plugin-react` — needed by Vitest for JSX transform

### Keep
- `@testing-library/jest-dom` — still used; import path changes to `/vitest`
- `@testing-library/react` — unchanged
- All Storybook, Playwright, and snapshot packages — unchanged

---

## Scripts

| Old script | New script |
|---|---|
| `"test": "jest -c ./tests/jest/jest.config.js --colors --watchAll --runInBand"` | `"test": "vitest"` |
| `"test-specific": "jest \"useOnUnmount\" --ci ..."` | `"test:filter": "vitest --reporter=verbose"` (pass pattern as arg) |
| `"test-ci": "jest --ci ..."` | `"test:ci": "vitest run"` |
| _(new)_ | `"test:ui": "vitest --ui"` |
| _(new)_ | `"test:coverage": "vitest run --coverage"` |

---

## Coverage Strategy

Two complementary coverage sources:

| Source | Tool | What it covers |
|---|---|---|
| Storybook test-runner | `@storybook/addon-coverage` + Istanbul | Visual components exercised via play functions |
| Vitest | `@vitest/coverage-v8` | Hooks, providers, utilities, pure logic |

Both output to `coverage/` but in separate subdirectories (`coverage/storybook/` and `coverage/vitest/`) to avoid conflicts.

---

## Error Handling / Edge Cases

- `globals: true` means `describe`/`it`/`expect` are available without imports — matches current Jest behaviour so existing tests need zero changes.
- `@testing-library/jest-dom/vitest` provides the same matchers (`toBeInTheDocument`, etc.) as the Jest version.
- The `jsdom` environment is set globally; individual test files can override with `@vitest-environment node` comment if needed.
- SWC is not used by Vitest — Vitest uses esbuild internally, which handles TypeScript natively. `@swc/jest` is removed; `@swc/core` stays as it is a direct dependency of the Storybook SWC compiler addon.

---

## File Tree Delta

```
DELETE  tests/jest/jest.config.js
DELETE  tests/jest/setup.js
DELETE  tests/jest/startup.ts
DELETE  tests/jest/              (directory)

ADD     vitest.config.ts
ADD     src/tests/setup.ts
```
