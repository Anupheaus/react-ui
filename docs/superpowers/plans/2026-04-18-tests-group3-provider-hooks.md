# Test Coverage — Group 3: Provider Hooks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add unit tests for useLocale, useLogger, and useValidation — the three provider hooks that contain non-trivial logic.

**Architecture:** Each test uses `renderHook({ wrapper })` where the wrapper renders the relevant provider. `useValidation` requires a component-level test because `validate()` itself calls hooks internally. All test files are co-located next to their source.

**Tech Stack:** Vitest, @testing-library/react, TypeScript

---

## File Map

| Action | Path |
|---|---|
| CREATE | `src/providers/LocaleProvider/useLocale.tests.ts` |
| CREATE | `src/providers/LoggerProvider/useLogger.tests.ts` |
| CREATE | `src/providers/ValidationProvider/useValidation.tests.tsx` |

---

### Task 1: useLocale tests

**Files:**
- Create: `src/providers/LocaleProvider/useLocale.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { LocaleProvider } from './LocaleProvider';
import { useLocale } from './useLocale';
import { DateTime } from 'luxon';

const defaultSettings = {
  locale: 'en-GB',
  currency: 'GBP',
};

function wrapper({ children }: { children: ReactNode }) {
  return createElement(LocaleProvider, { settings: defaultSettings }, children);
}

describe('useLocale — isValidISODate', () => {
  it('returns true for a valid ISO string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate('2024-01-15T10:30:00Z')).toBe(true);
  });

  it('returns true for a Date object', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate(new Date())).toBe(true);
  });

  it('returns true for a DateTime object', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate(DateTime.now())).toBe(true);
  });

  it('returns false for undefined', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate(undefined)).toBe(false);
  });

  it('returns false for a non-ISO string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.isValidISODate('hello')).toBe(false);
  });
});

describe('useLocale — toDate', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.toDate(undefined)).toBeUndefined();
  });

  it('converts an ISO string to a DateTime', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const dt = result.current.toDate('2024-06-15T10:00:00Z');
    expect(DateTime.isDateTime(dt)).toBe(true);
    expect(dt?.year).toBe(2024);
  });

  it('converts a Date object to a DateTime', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const dt = result.current.toDate(new Date(2024, 5, 15));
    expect(DateTime.isDateTime(dt)).toBe(true);
  });

  it('returns undefined for a non-ISO string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.toDate('not a date')).toBeUndefined();
  });
});

describe('useLocale — formatDate', () => {
  it('returns undefined for undefined date', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatDate(undefined)).toBeUndefined();
  });

  it('formats using an explicit Luxon format string', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatDate('2024-06-15T00:00:00Z', { format: 'yyyy/MM/dd' });
    expect(formatted).toBe('2024/06/15');
  });

  it('uses shortDateFormat from settings when type is short', () => {
    function wrapperWithShort({ children }: { children: ReactNode }) {
      return createElement(LocaleProvider, { settings: { ...defaultSettings, shortDateFormat: 'dd-MM-yyyy' } }, children);
    }
    const { result } = renderHook(() => useLocale(), { wrapper: wrapperWithShort });
    const formatted = result.current.formatDate('2024-06-15T00:00:00Z', { type: 'short' });
    expect(formatted).toBe('15-06-2024');
  });

  it('uses longDateFormat from settings when type is long', () => {
    function wrapperWithLong({ children }: { children: ReactNode }) {
      return createElement(LocaleProvider, { settings: { ...defaultSettings, longDateFormat: 'dd MMMM yyyy' } }, children);
    }
    const { result } = renderHook(() => useLocale(), { wrapper: wrapperWithLong });
    const formatted = result.current.formatDate('2024-06-15T00:00:00Z');
    expect(formatted).toBe('15 June 2024');
  });
});

describe('useLocale — formatCurrency', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatCurrency(undefined)).toBeUndefined();
  });

  it('formats a number as currency and contains currency symbol', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatCurrency(1234.56);
    expect(formatted).toBeDefined();
    expect(formatted).toMatch(/£|GBP/);
  });
});

describe('useLocale — formatNumber', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatNumber(undefined)).toBeUndefined();
  });

  it('formats integer with 0 decimal places', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatNumber(1234);
    expect(formatted).not.toContain('.');
  });

  it('formats with 2 decimal places', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatNumber(1.5, 2);
    expect(formatted).toContain('.');
  });
});

describe('useLocale — formatPercentage', () => {
  it('returns undefined for undefined input', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    expect(result.current.formatPercentage(undefined)).toBeUndefined();
  });

  it('formats 0.5 as approximately 50%', () => {
    const { result } = renderHook(() => useLocale(), { wrapper });
    const formatted = result.current.formatPercentage(0.5);
    expect(formatted).toMatch(/50/);
    expect(formatted).toContain('%');
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/providers/LocaleProvider/useLocale.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/providers/LocaleProvider/useLocale.tests.ts
git -C C:/code/personal/react-ui commit -m "test(providers): add useLocale tests"
```

---

### Task 2: useLogger tests

**Files:**
- Create: `src/providers/LoggerProvider/useLogger.tests.ts`

- [ ] **Step 1: Write and run the tests**

`useLogger` returns the `Logger` from context (from `@anupheaus/common`). Wrap with `<LoggerProvider loggerName="test">`.

```typescript
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { LoggerProvider } from './LoggerProvider';
import { useLogger } from './useLogger';
import { Logger, InternalError } from '@anupheaus/common';

function wrapper({ children }: { children: ReactNode }) {
  return createElement(LoggerProvider, { loggerName: 'test' }, children);
}

describe('useLogger', () => {
  it('throws InternalError when called outside LoggerProvider', () => {
    // suppress console error from React for the thrown error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useLogger())).toThrow();
    spy.mockRestore();
  });

  it('returns a Logger instance inside LoggerProvider', () => {
    const { result } = renderHook(() => useLogger(), { wrapper });
    expect(result.current).toBeInstanceOf(Logger);
  });

  it('returns a sub-logger when subLogName is provided', () => {
    const { result: parent } = renderHook(() => useLogger(), { wrapper });
    const { result: child } = renderHook(() => useLogger('child'), { wrapper });
    expect(child.current).toBeInstanceOf(Logger);
    expect(child.current).not.toBe(parent.current);
  });

  it('returns the same logger when props do not change', () => {
    const { result, rerender } = renderHook(() => useLogger(), { wrapper });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/providers/LoggerProvider/useLogger.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/providers/LoggerProvider/useLogger.tests.ts
git -C C:/code/personal/react-ui commit -m "test(providers): add useLogger tests"
```

---

### Task 3: useValidation tests

**Files:**
- Create: `src/providers/ValidationProvider/useValidation.tests.tsx`

`validate()` calls hooks internally so tests must render a real component that calls `useValidation()` and `validate()` during render.

- [ ] **Step 1: Write and run the tests**

```tsx
import { act, render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { useValidation } from './useValidation';

// Test component that calls useValidation and exposes results
function ValidationTestComponent({
  value,
  isRequired,
  onResult,
}: {
  value: unknown;
  isRequired: boolean;
  onResult: (result: { error: unknown; enableErrors: () => void }) => void;
}) {
  const { validate, isValid, getErrors } = useValidation();
  const result = validate(({ validateRequired }) => validateRequired(value, isRequired));
  onResult(result);
  return <div data-testid="valid">{String(isValid)}</div>;
}

describe('useValidation — validateRequired', () => {
  it('returns no error when value is non-empty and isRequired is true', () => {
    let result: any;
    render(
      <ValidationTestComponent
        value="hello"
        isRequired
        onResult={r => { result = r; }}
      />
    );
    expect(result.error).toBeNull();
  });

  it('returns the default message when value is undefined and isRequired is true', () => {
    let result: any;
    const { rerender } = render(
      <ValidationTestComponent
        value={undefined}
        isRequired
        onResult={r => { result = r; }}
      />
    );
    // Errors only show after enableErrors is called
    act(() => { result.enableErrors(); });
    rerender(
      <ValidationTestComponent
        value={undefined}
        isRequired
        onResult={r => { result = r; }}
      />
    );
    expect(result.error).toBeTruthy();
  });

  it('returns no error when isRequired is false regardless of value', () => {
    let result: any;
    render(
      <ValidationTestComponent
        value={undefined}
        isRequired={false}
        onResult={r => { result = r; }}
      />
    );
    expect(result.error).toBeNull();
  });
});

describe('useValidation — isValid', () => {
  it('returns true when no errors are registered', () => {
    function ValidComponent({ onValid }: { onValid: (v: boolean) => void }) {
      const { isValid } = useValidation();
      onValid(isValid());
      return null;
    }
    let valid: boolean | undefined;
    render(<ValidComponent onValid={v => { valid = v; }} />);
    expect(valid).toBe(true);
  });
});

describe('useValidation — getErrors', () => {
  it('returns an empty array when there are no errors', () => {
    function NoErrorComponent({ onErrors }: { onErrors: (e: unknown[]) => void }) {
      const { getErrors } = useValidation();
      onErrors(getErrors());
      return null;
    }
    let errors: unknown[] | undefined;
    render(<NoErrorComponent onErrors={e => { errors = e; }} />);
    expect(errors).toHaveLength(0);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/providers/ValidationProvider/useValidation.tests.tsx
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/providers/ValidationProvider/useValidation.tests.tsx
git -C C:/code/personal/react-ui commit -m "test(providers): add useValidation tests"
```

---

### Task 4: Final verification

- [ ] **Run all provider hook tests**

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/providers
```

Expected: all 3 provider test files pass. Fix any failures before marking done.
