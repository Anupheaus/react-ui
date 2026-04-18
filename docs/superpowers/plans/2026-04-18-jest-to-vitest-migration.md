# Jest → Vitest Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Jest with Vitest as the unit test runner, keeping all 4 existing tests green and co-located next to their source files.

**Architecture:** Install Vitest + supporting packages, create `vitest.config.ts` at the repo root, create a unified setup file at `src/tests/setup.ts`, add a globals declaration file at `src/tests/globals.d.ts`, update the one test file that uses Jest-specific globals (`jest.fn()` → `vi.fn()`), update `package.json` scripts, then delete the old `tests/jest/` directory.

**Tech Stack:** Vitest 3, @vitest/ui, @vitest/coverage-v8, vite-tsconfig-paths, @testing-library/jest-dom, @testing-library/react, jsdom

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| CREATE | `vitest.config.ts` | Vitest config (replaces `tests/jest/jest.config.js`) |
| CREATE | `src/tests/setup.ts` | Unified setup file (replaces `tests/jest/setup.js` + `tests/jest/startup.ts`) |
| CREATE | `src/tests/globals.d.ts` | TypeScript global type declarations for Vitest globals |
| MODIFY | `src/providers/EmailProvider/EmailProvider.tests.tsx` | Replace `jest.fn()` / `jest.Mock` with `vi.fn()` / `Mock` |
| MODIFY | `package.json` | Update scripts |
| DELETE | `tests/jest/jest.config.js` | Removed |
| DELETE | `tests/jest/setup.js` | Removed |
| DELETE | `tests/jest/startup.ts` | Removed |

---

### Task 1: Install Vitest packages and remove Jest packages

**Files:**
- Modify: `package.json` (automatically updated by pnpm)

- [ ] **Step 1: Install Vitest and supporting packages**

```bash
pnpm -C C:/code/personal/react-ui add -D vitest @vitest/ui @vitest/coverage-v8 vite-tsconfig-paths
```

Expected output: packages added successfully with no errors.

- [ ] **Step 2: Remove Jest packages**

```bash
pnpm -C C:/code/personal/react-ui remove jest jest-environment-jsdom @swc/jest @types/jest
```

Expected output: packages removed successfully with no errors.

- [ ] **Step 3: Verify the right packages are present**

```bash
pnpm -C C:/code/personal/react-ui list vitest @vitest/ui @vitest/coverage-v8 vite-tsconfig-paths --depth=0
```

Expected: all four packages listed under devDependencies.

- [ ] **Step 4: Commit**

```bash
git -C C:/code/personal/react-ui add package.json pnpm-lock.yaml
git -C C:/code/personal/react-ui commit -m "chore(test): install vitest, remove jest"
```

---

### Task 2: Create vitest.config.ts

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create the config file**

Create `vitest.config.ts` at the repo root with this exact content:

```typescript
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    include: ['src/**/*.tests.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: [
        'src/**/*.stories.*',
        'src/**/*.tests.*',
        'src/**/index.ts',
        'src/**/index.tsx',
        'src/Storybook/**',
      ],
      reportsDirectory: 'coverage/vitest',
    },
  },
});
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add vitest.config.ts
git -C C:/code/personal/react-ui commit -m "chore(test): add vitest.config.ts"
```

---

### Task 3: Create setup file and globals declaration

**Files:**
- Create: `src/tests/setup.ts`
- Create: `src/tests/globals.d.ts`

- [ ] **Step 1: Create the setup file**

Create `src/tests/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest';
import { TextDecoder, TextEncoder } from 'util';
import React from 'react';
import ReactDOM from 'react-dom';

Object.assign(globalThis, { TextEncoder, TextDecoder, React, ReactDOM });
```

- [ ] **Step 2: Create the globals declaration file**

Create `src/tests/globals.d.ts`:

```typescript
/// <reference types="vitest/globals" />
```

This file is picked up by TypeScript because `tsconfig.json` includes `src/**/*`, making `describe`, `it`, `expect`, `vi`, and `Mock` available as globals in all test files without explicit imports.

- [ ] **Step 3: Commit**

```bash
git -C C:/code/personal/react-ui add src/tests/setup.ts src/tests/globals.d.ts
git -C C:/code/personal/react-ui commit -m "chore(test): add vitest setup and globals declaration"
```

---

### Task 4: Update EmailProvider.tests.tsx

This is the only test file that uses Jest-specific globals (`jest.fn()`, `jest.Mock`). The other three test files use only `describe`/`it`/`expect` which are identical in Vitest.

**Files:**
- Modify: `src/providers/EmailProvider/EmailProvider.tests.tsx`

- [ ] **Step 1: Replace jest.fn() with vi.fn() and jest.Mock with Mock**

Replace the entire file content with:

```typescript
import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createEmail } from './createEmail';
import { EmailProvider } from './EmailProvider';
import { useEmail } from './useEmail';

describe('createEmail', () => {
  it('returns a token with the given name and definition', () => {
    const definition = () => () => null;
    const token = createEmail('OrderEmail', definition as never);
    expect(token.name).toBe('OrderEmail');
    expect(token.definition).toBe(definition);
  });
});

describe('EmailProvider', () => {
  it('renders its children', () => {
    render(
      <EmailProvider onSend={vi.fn()}>
        <span>child content</span>
      </EmailProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});

const TestEmail = createEmail('TestEmail', ({ Email, Body }) =>
  (name: string) => (
    <Email subject={`Hello ${name}`}>
      <Body>
        <p>Content for {name}</p>
      </Body>
    </Email>
  )
);

function makeWrapper(onSend: Mock) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <EmailProvider onSend={onSend}>{children}</EmailProvider>;
  };
}

describe('useEmail', () => {
  it('renders the template to HTML and calls onSend', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('World', { to: 'test@example.com' });
    });

    expect(onSend).toHaveBeenCalledTimes(1);
    const payload = onSend.mock.calls[0][0];
    expect(payload.html).toContain('Content for World');
    expect(payload.to).toBe('test@example.com');
    expect(payload.props).toEqual(['World']);
  });

  it('uses the subject from the Email component', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Alice', { to: 'a@b.com' });
    });

    expect(onSend.mock.calls[0][0].subject).toBe('Hello Alice');
  });

  it('overrides subject with send-time subject when provided', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Alice', { to: 'a@b.com', subject: 'Override Subject' });
    });

    expect(onSend.mock.calls[0][0].subject).toBe('Override Subject');
  });

  it('passes all send-time props through to onSend', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Bob', {
        to: ['a@b.com', 'c@d.com'],
        cc: 'cc@b.com',
        bcc: 'bcc@b.com',
        from: 'sender@b.com',
        alias: 'Sender Name',
        replyTo: 'reply@b.com',
      });
    });

    expect(onSend).toHaveBeenCalledWith(expect.objectContaining({
      to: ['a@b.com', 'c@d.com'],
      cc: 'cc@b.com',
      bcc: 'bcc@b.com',
      from: 'sender@b.com',
      alias: 'Sender Name',
      replyTo: 'reply@b.com',
    }));
  });

  it('throws when email() is called outside EmailProvider', () => {
    const { result } = renderHook(() => useEmail(TestEmail));
    expect(() => result.current('Bob', { to: 'a@b.com' })).toThrow(
      'useEmail must be used within an <EmailProvider>'
    );
  });

  it('propagates onSend rejection to the caller', async () => {
    const error = new Error('send failed');
    const onSend = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });
    await act(async () => {
      await expect(result.current('World', { to: 'a@b.com' })).rejects.toThrow('send failed');
    });
  });
});
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/providers/EmailProvider/EmailProvider.tests.tsx
git -C C:/code/personal/react-ui commit -m "chore(test): replace jest.fn with vi.fn in EmailProvider tests"
```

---

### Task 5: Update package.json scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update the scripts section**

In `package.json`, replace the three Jest scripts:

```json
"test": "jest -c ./tests/jest/jest.config.js --colors --watchAll --runInBand",
"test-specific": "jest \"useOnUnmount\" --ci -c ./tests/jest/jest.config.js --colors --watchAll --runInBand",
"test-ci": "jest --ci -c ./tests/jest/jest.config.js --runInBand",
```

With these Vitest equivalents:

```json
"test": "vitest",
"test:filter": "vitest --reporter=verbose",
"test:ci": "vitest run",
"test:ui": "vitest --ui",
"test:coverage": "vitest run --coverage",
```

`test:filter` replaces `test-specific` — pass the filter pattern as an argument: `pnpm test:filter useOnUnmount`.

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add package.json
git -C C:/code/personal/react-ui commit -m "chore(test): update package.json scripts for vitest"
```

---

### Task 6: Delete the tests/jest directory

**Files:**
- Delete: `tests/jest/jest.config.js`
- Delete: `tests/jest/setup.js`
- Delete: `tests/jest/startup.ts`

- [ ] **Step 1: Delete the directory**

```bash
rm -rf C:/code/personal/react-ui/tests
```

- [ ] **Step 2: Commit the deletion**

```bash
git -C C:/code/personal/react-ui add -A
git -C C:/code/personal/react-ui commit -m "chore(test): remove tests/jest directory"
```

---

### Task 7: Verify all tests pass

- [ ] **Step 1: Run the full test suite**

```bash
pnpm -C C:/code/personal/react-ui test:ci
```

Expected: all 4 test files run, all tests pass, exit code 0. Output looks like:

```
 ✓ src/theme/hoistMediaQueries.tests.ts (7)
 ✓ src/components/Windows/Windows.tests.tsx (4)
 ✓ src/components/Selector/SelectorButton.tests.tsx (7)
 ✓ src/providers/EmailProvider/EmailProvider.tests.tsx (7)

 Test Files  4 passed (4)
      Tests  25 passed (25)
```

- [ ] **Step 2: If any test fails, check for remaining jest.* globals**

```bash
grep -r "jest\." C:/code/personal/react-ui/src --include="*.tests.*"
```

Replace any remaining `jest.fn()` → `vi.fn()`, `jest.spyOn()` → `vi.spyOn()`, `jest.mock()` → `vi.mock()`.

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git -C C:/code/personal/react-ui add -A
git -C C:/code/personal/react-ui commit -m "chore(test): fix remaining jest globals after vitest migration"
```
