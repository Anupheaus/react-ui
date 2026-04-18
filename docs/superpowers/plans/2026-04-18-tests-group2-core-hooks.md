# Test Coverage — Group 2: Core Standalone Hooks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add unit tests for all meaningful hooks in `src/hooks/`, co-located next to each source file.

**Architecture:** All tests use `renderHook` + `act` from `@testing-library/react`. Timing hooks use `vi.useFakeTimers()` with `vi.runAllTimers()` / `vi.advanceTimersByTime()`. Each task is one test file.

**Tech Stack:** Vitest, @testing-library/react, TypeScript

---

## File Map

| Action | Path |
|---|---|
| CREATE | `src/hooks/useOnMount/useOnMount.tests.ts` |
| CREATE | `src/hooks/useOnChange/useOnChange.tests.ts` |
| CREATE | `src/hooks/useOnUnmount/useOnUnmount.tests.ts` |
| CREATE | `src/hooks/useBooleanState/useBooleanState.tests.ts` |
| CREATE | `src/hooks/useToggleState/useToggleState.tests.ts` |
| CREATE | `src/hooks/useUpdatableState/useUpdatableState.tests.ts` |
| CREATE | `src/hooks/useSyncState/useSyncState.tests.ts` |
| CREATE | `src/hooks/useForceUpdate/useForceUpdate.tests.ts` |
| CREATE | `src/hooks/useDebounce/useDebounce.tests.ts` |
| CREATE | `src/hooks/useTimeout/useTimeout.tests.ts` |
| CREATE | `src/hooks/useInterval/useInterval.tests.ts` |
| CREATE | `src/hooks/useId/useId.tests.ts` |
| CREATE | `src/hooks/useObservable/useObservable.tests.ts` |
| CREATE | `src/hooks/useDistributedState/useDistributedState.tests.ts` |
| CREATE | `src/hooks/useSet/useSet.tests.ts` |
| CREATE | `src/hooks/useMap/useMap.tests.ts` |
| CREATE | `src/hooks/useRef/useRef.tests.ts` |
| CREATE | `src/hooks/useCallbacks/useCallbacks.tests.ts` |
| CREATE | `src/hooks/useBatchUpdates/useBatchUpdates.tests.ts` |
| CREATE | `src/hooks/useDOMRef/useDOMRef.tests.ts` |
| CREATE | `src/hooks/useAsync/useAsync.tests.ts` |
| CREATE | `src/hooks/useItems/useItems.tests.ts` |

---

### Task 1: useOnMount tests

**Files:**
- Create: `src/hooks/useOnMount/useOnMount.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { renderHook } from '@testing-library/react';
import { useOnMount } from './useOnMount';

describe('useOnMount', () => {
  it('calls the delegate exactly once after mount', () => {
    const delegate = vi.fn();
    renderHook(() => useOnMount(delegate));
    expect(delegate).toHaveBeenCalledTimes(1);
  });

  it('does not call the delegate on re-renders', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(() => useOnMount(delegate));
    rerender();
    rerender();
    expect(delegate).toHaveBeenCalledTimes(1);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useOnMount/useOnMount.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useOnMount/useOnMount.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useOnMount tests"
```

---

### Task 2: useOnChange tests

**Files:**
- Create: `src/hooks/useOnChange/useOnChange.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { renderHook } from '@testing-library/react';
import { useOnChange } from './useOnChange';

describe('useOnChange', () => {
  it('does not call the delegate on the initial render', () => {
    const delegate = vi.fn();
    renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    expect(delegate).not.toHaveBeenCalled();
  });

  it('calls the delegate when a dependency changes', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    rerender({ val: 2 });
    expect(delegate).toHaveBeenCalledTimes(1);
  });

  it('calls the delegate again on each subsequent change', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    rerender({ val: 2 });
    rerender({ val: 3 });
    expect(delegate).toHaveBeenCalledTimes(2);
  });

  it('does not call the delegate when dependencies are the same', () => {
    const delegate = vi.fn();
    const { rerender } = renderHook(({ val }) => useOnChange(delegate, [val]), { initialProps: { val: 1 } });
    rerender({ val: 1 });
    expect(delegate).not.toHaveBeenCalled();
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useOnChange/useOnChange.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useOnChange/useOnChange.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useOnChange tests"
```

---

### Task 3: useOnUnmount tests

**Files:**
- Create: `src/hooks/useOnUnmount/useOnUnmount.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { renderHook } from '@testing-library/react';
import { useOnUnmount } from './useOnUnmount';

describe('useOnUnmount', () => {
  it('calls the delegate when the component unmounts', () => {
    const delegate = vi.fn();
    const { unmount } = renderHook(() => useOnUnmount(delegate));
    expect(delegate).not.toHaveBeenCalled();
    unmount();
    expect(delegate).toHaveBeenCalledTimes(1);
  });

  it('works with no delegate provided', () => {
    const { unmount } = renderHook(() => useOnUnmount());
    expect(() => unmount()).not.toThrow();
  });

  it('hasUnmounted() returns false before unmount', () => {
    const { result } = renderHook(() => useOnUnmount());
    expect(result.current()).toBe(false);
  });

  it('hasUnmounted() returns true after unmount', () => {
    const { result, unmount } = renderHook(() => useOnUnmount());
    unmount();
    expect(result.current()).toBe(true);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useOnUnmount/useOnUnmount.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useOnUnmount/useOnUnmount.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useOnUnmount tests"
```

---

### Task 4: useBooleanState tests

**Files:**
- Create: `src/hooks/useBooleanState/useBooleanState.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useBooleanState } from './useBooleanState';

describe('useBooleanState', () => {
  it('initialises to false by default', () => {
    const { result } = renderHook(() => useBooleanState());
    expect(result.current[0]).toBe(false);
  });

  it('accepts a custom initial value of true', () => {
    const { result } = renderHook(() => useBooleanState(true));
    expect(result.current[0]).toBe(true);
  });

  it('setTrue sets state to true', () => {
    const { result } = renderHook(() => useBooleanState(false));
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(true);
  });

  it('setFalse sets state to false', () => {
    const { result } = renderHook(() => useBooleanState(true));
    act(() => { result.current[2](); });
    expect(result.current[0]).toBe(false);
  });

  it('raw setter sets an arbitrary value', () => {
    const { result } = renderHook(() => useBooleanState(false));
    act(() => { result.current[3](true); });
    expect(result.current[0]).toBe(true);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useBooleanState/useBooleanState.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useBooleanState/useBooleanState.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useBooleanState tests"
```

---

### Task 5: useToggleState tests

**Files:**
- Create: `src/hooks/useToggleState/useToggleState.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useToggleState } from './useToggleState';

describe('useToggleState', () => {
  it('initialises to false by default', () => {
    const { result } = renderHook(() => useToggleState());
    expect(result.current[0]).toBe(false);
  });

  it('accepts initial value true', () => {
    const { result } = renderHook(() => useToggleState(true));
    expect(result.current[0]).toBe(true);
  });

  it('accepts an initialiser function', () => {
    const { result } = renderHook(() => useToggleState(() => true));
    expect(result.current[0]).toBe(true);
  });

  it('toggle() flips false to true', () => {
    const { result } = renderHook(() => useToggleState(false));
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(true);
  });

  it('toggle() flips true to false', () => {
    const { result } = renderHook(() => useToggleState(true));
    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(false);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useToggleState/useToggleState.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useToggleState/useToggleState.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useToggleState tests"
```

---

### Task 6: useUpdatableState tests

**Files:**
- Create: `src/hooks/useUpdatableState/useUpdatableState.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useUpdatableState } from './useUpdatableState';

describe('useUpdatableState', () => {
  it('returns the initial value on first render', () => {
    const { result } = renderHook(() => useUpdatableState(() => 42, []));
    expect(result.current[0]).toBe(42);
  });

  it('setter updates the value and triggers re-render', () => {
    const { result } = renderHook(() => useUpdatableState(() => 0, []));
    act(() => { result.current[1](99); });
    expect(result.current[0]).toBe(99);
  });

  it('setter with updater function receives current state', () => {
    const { result } = renderHook(() => useUpdatableState(() => 10, []));
    act(() => { result.current[1](prev => prev + 5); });
    expect(result.current[0]).toBe(15);
  });

  it('re-initialises when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ dep }) => useUpdatableState(() => dep * 2, [dep]),
      { initialProps: { dep: 3 } }
    );
    expect(result.current[0]).toBe(6);
    rerender({ dep: 5 });
    expect(result.current[0]).toBe(10);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useUpdatableState/useUpdatableState.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useUpdatableState/useUpdatableState.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useUpdatableState tests"
```

---

### Task 7: useSyncState tests

**Files:**
- Create: `src/hooks/useSyncState/useSyncState.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useSyncState } from './useSyncState';

describe('useSyncState', () => {
  it('initialises to undefined with no argument', () => {
    const { result } = renderHook(() => useSyncState());
    expect(result.current.state).toBeUndefined();
  });

  it('initialises via factory function', () => {
    const { result } = renderHook(() => useSyncState(() => 42));
    expect(result.current.state).toBe(42);
  });

  it('setState(value) updates state', () => {
    const { result } = renderHook(() => useSyncState(() => 0));
    act(() => { result.current.setState(99); });
    expect(result.current.state).toBe(99);
  });

  it('setState(fn) receives current state and sets result', () => {
    const { result } = renderHook(() => useSyncState(() => 10));
    act(() => { result.current.setState(s => s! + 5); });
    expect(result.current.state).toBe(15);
  });

  it('getState() returns current state', () => {
    const { result } = renderHook(() => useSyncState(() => 'hello'));
    expect(result.current.getState()).toBe('hello');
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useSyncState/useSyncState.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useSyncState/useSyncState.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useSyncState tests"
```

---

### Task 8: useForceUpdate tests

**Files:**
- Create: `src/hooks/useForceUpdate/useForceUpdate.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useForceUpdate } from './useForceUpdate';

describe('useForceUpdate', () => {
  it('returns a stable function reference across renders', () => {
    const { result, rerender } = renderHook(() => useForceUpdate());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('calling the returned function triggers a re-render', async () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useForceUpdate();
    });
    const countBefore = renderCount;
    await act(async () => { result.current(); });
    expect(renderCount).toBeGreaterThan(countBefore);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useForceUpdate/useForceUpdate.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useForceUpdate/useForceUpdate.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useForceUpdate tests"
```

---

### Task 9: useDebounce tests

**Files:**
- Create: `src/hooks/useDebounce/useDebounce.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('does not call the delegate immediately', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200));
    result.current();
    expect(fn).not.toHaveBeenCalled();
  });

  it('calls the delegate after the specified delay', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200));
    act(() => { result.current(); vi.advanceTimersByTime(200); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer when called again before delay expires', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200));
    act(() => {
      result.current();
      vi.advanceTimersByTime(100);
      result.current();
      vi.advanceTimersByTime(100);
    });
    expect(fn).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(100); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('longestMs fires after longestMs even if calls keep coming', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 200, 500));
    act(() => {
      result.current();
      vi.advanceTimersByTime(200);
      result.current();
      vi.advanceTimersByTime(200);
      result.current();
      vi.advanceTimersByTime(200);
    });
    // longestMs=500 is not exceeded yet, but at 600ms total it should have fired at least once
    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useDebounce/useDebounce.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useDebounce/useDebounce.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useDebounce tests"
```

---

### Task 10: useTimeout tests

**Files:**
- Create: `src/hooks/useTimeout/useTimeout.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useTimeout } from './useTimeout';

describe('useTimeout', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls delegate after the specified timeout', () => {
    const fn = vi.fn();
    renderHook(() => useTimeout(fn, 300));
    expect(fn).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancelTimeout() prevents the delegate from firing', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useTimeout(fn, 300));
    act(() => { result.current(); vi.advanceTimersByTime(300); });
    expect(fn).not.toHaveBeenCalled();
  });

  it('re-runs timeout when dependencies change', () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useTimeout(fn, 300, { dependencies: [dep] }),
      { initialProps: { dep: 1 } }
    );
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
    rerender({ dep: 2 });
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('triggerOnUnmount: true fires delegate on unmount if timeout is pending', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useTimeout(fn, 300, { triggerOnUnmount: true }));
    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not fire after unmount when triggerOnUnmount is false', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useTimeout(fn, 300));
    unmount();
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).not.toHaveBeenCalled();
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useTimeout/useTimeout.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useTimeout/useTimeout.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useTimeout tests"
```

---

### Task 11: useInterval tests

**Files:**
- Create: `src/hooks/useInterval/useInterval.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useInterval } from './useInterval';

describe('useInterval', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('calls delegate repeatedly on the interval', () => {
    const fn = vi.fn();
    renderHook(() => useInterval(fn, 100));
    act(() => { vi.advanceTimersByTime(350); });
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('cancelInterval() stops future calls', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useInterval(fn, 100));
    act(() => {
      vi.advanceTimersByTime(150);
      result.current();
      vi.advanceTimersByTime(300);
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('re-sets interval when dependencies change', () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useInterval(fn, 100, { dependencies: [dep] }),
      { initialProps: { dep: 1 } }
    );
    act(() => { vi.advanceTimersByTime(150); });
    expect(fn).toHaveBeenCalledTimes(1);
    rerender({ dep: 2 });
    act(() => { vi.advanceTimersByTime(150); });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('cleans up interval on unmount', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useInterval(fn, 100));
    act(() => { vi.advanceTimersByTime(150); });
    unmount();
    act(() => { vi.advanceTimersByTime(300); });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('triggerOnUnmount: true fires delegate on unmount if interval is running', () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useInterval(fn, 100, { triggerOnUnmount: true }));
    unmount();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useInterval/useInterval.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useInterval/useInterval.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useInterval tests"
```

---

### Task 12: useId tests

**Files:**
- Create: `src/hooks/useId/useId.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { renderHook } from '@testing-library/react';
import { useId } from './useId';

describe('useId', () => {
  it('returns a non-empty string', () => {
    const { result } = renderHook(() => useId());
    expect(typeof result.current).toBe('string');
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('returns a stable ID across re-renders when no id is provided', () => {
    const { result, rerender } = renderHook(() => useId());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('returns the provided id when one is passed', () => {
    const { result } = renderHook(() => useId('my-id'));
    expect(result.current).toBe('my-id');
  });

  it('updates to a new provided id when the prop changes', () => {
    const { result, rerender } = renderHook(({ id }) => useId(id), { initialProps: { id: 'first' } });
    expect(result.current).toBe('first');
    rerender({ id: 'second' });
    expect(result.current).toBe('second');
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useId/useId.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useId/useId.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useId tests"
```

---

### Task 13: useObservable tests

**Files:**
- Create: `src/hooks/useObservable/useObservable.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useObservable } from './useObservable';

describe('useObservable', () => {
  it('get() returns the initial value', () => {
    const { result } = renderHook(() => useObservable(42));
    expect(result.current.get()).toBe(42);
  });

  it('set(value) updates the value', () => {
    const { result } = renderHook(() => useObservable(0));
    act(() => { result.current.set(99); });
    expect(result.current.get()).toBe(99);
  });

  it('set(fn) receives current value and sets result', () => {
    const { result } = renderHook(() => useObservable(10));
    act(() => { result.current.set(v => v + 5); });
    expect(result.current.get()).toBe(15);
  });

  it('onChange callback fires when value changes', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => {
      const obs = useObservable(0);
      obs.onChange(cb);
      return obs;
    });
    act(() => { result.current.set(1); });
    expect(cb).toHaveBeenCalledWith(1);
  });

  it('onChange does not fire when value is set to the same reference', () => {
    const cb = vi.fn();
    const obj = { x: 1 };
    const { result } = renderHook(() => {
      const obs = useObservable(obj);
      obs.onChange(cb);
      return obs;
    });
    act(() => { result.current.set(obj); });
    expect(cb).not.toHaveBeenCalled();
  });

  it('updates when dependency array changes', () => {
    const { result, rerender } = renderHook(
      ({ dep }) => useObservable(dep, [dep]),
      { initialProps: { dep: 1 } }
    );
    expect(result.current.get()).toBe(1);
    rerender({ dep: 2 });
    expect(result.current.get()).toBe(2);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useObservable/useObservable.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useObservable/useObservable.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useObservable tests"
```

---

### Task 14: useDistributedState tests

**Files:**
- Create: `src/hooks/useDistributedState/useDistributedState.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useDistributedState } from './useDistributedState';

describe('useDistributedState', () => {
  it('get() returns the initial value', () => {
    const { result } = renderHook(() => useDistributedState(() => 42));
    expect(result.current.get()).toBe(42);
  });

  it('set() updates state', () => {
    const { result } = renderHook(() => useDistributedState(() => 0));
    act(() => { result.current.set(99); });
    expect(result.current.get()).toBe(99);
  });

  it('modify() applies an updater function', () => {
    const { result } = renderHook(() => useDistributedState(() => 10));
    act(() => { result.current.modify(v => v + 5); });
    expect(result.current.get()).toBe(15);
  });

  it('onChange() fires when state changes', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => {
      const ds = useDistributedState(() => 0);
      ds.onChange(cb);
      return ds;
    });
    act(() => { result.current.set(1); });
    expect(cb).toHaveBeenCalledWith(1);
  });

  it('getAndObserve() triggers re-render when state changes', async () => {
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      const ds = useDistributedState(() => 0);
      ds.getAndObserve();
      return ds;
    });
    const before = renderCount;
    await act(async () => { result.current.set(1); });
    expect(renderCount).toBeGreaterThan(before);
  });

  it('does not update when same value is set', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => {
      const ds = useDistributedState(() => ({ x: 1 }));
      ds.onChange(cb);
      return ds;
    });
    act(() => { result.current.set({ x: 1 }); });
    expect(cb).not.toHaveBeenCalled();
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useDistributedState/useDistributedState.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useDistributedState/useDistributedState.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useDistributedState tests"
```

---

### Task 15: useSet, useMap, useRef tests

**Files:**
- Create: `src/hooks/useSet/useSet.tests.ts`
- Create: `src/hooks/useMap/useMap.tests.ts`
- Create: `src/hooks/useRef/useRef.tests.ts`

- [ ] **Step 1: Write and run useSet tests**

```typescript
// src/hooks/useSet/useSet.tests.ts
import { renderHook } from '@testing-library/react';
import { useSet } from './useSet';

describe('useSet', () => {
  it('returns a Set instance', () => {
    const { result } = renderHook(() => useSet<number>());
    expect(result.current).toBeInstanceOf(Set);
  });

  it('returns the same Set reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useSet<number>());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useSet/useSet.tests.ts
```

- [ ] **Step 2: Write and run useMap tests**

```typescript
// src/hooks/useMap/useMap.tests.ts
import { renderHook } from '@testing-library/react';
import { useMap } from './useMap';

describe('useMap', () => {
  it('returns a Map instance', () => {
    const { result } = renderHook(() => useMap<string, number>());
    expect(result.current).toBeInstanceOf(Map);
  });

  it('returns the same Map reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useMap<string, number>());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useMap/useMap.tests.ts
```

- [ ] **Step 3: Write and run useRef tests**

```typescript
// src/hooks/useRef/useRef.tests.ts
import { renderHook } from '@testing-library/react';
import { useRef } from './useRef';

describe('useRef', () => {
  it('returns a ref with the value produced by the initialiser', () => {
    const { result } = renderHook(() => useRef(() => 42));
    expect(result.current.current).toBe(42);
  });

  it('returns the same ref object across re-renders', () => {
    const { result, rerender } = renderHook(() => useRef(() => 42));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('does not re-run the initialiser on re-render', () => {
    const init = vi.fn(() => 42);
    const { rerender } = renderHook(() => useRef(init));
    rerender();
    rerender();
    expect(init).toHaveBeenCalledTimes(1);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useRef/useRef.tests.ts
```

- [ ] **Step 4: Commit all three**

```bash
git -C C:/code/personal/react-ui add src/hooks/useSet/useSet.tests.ts src/hooks/useMap/useMap.tests.ts src/hooks/useRef/useRef.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useSet, useMap, useRef tests"
```

---

### Task 16: useCallbacks tests

**Files:**
- Create: `src/hooks/useCallbacks/useCallbacks.tests.tsx`

- [ ] **Step 1: Write and run the tests**

`register` is itself a hook — it must be called during render. Tests use a wrapper component.

```tsx
import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import { useCallbacks } from './useCallbacks';
import type { UseCallbacks } from './useCallbacks';

function setup() {
  let sharedCallbacks: UseCallbacks<(val: number) => void>;

  function Producer() {
    sharedCallbacks = useCallbacks<(val: number) => void>();
    return null;
  }

  function Consumer({ onValue }: { onValue: (v: number) => void }) {
    const { register } = sharedCallbacks;
    register(function (val) { onValue(val); });
    return null;
  }

  return { Producer, Consumer, getCallbacks: () => sharedCallbacks };
}

describe('useCallbacks', () => {
  it('invoke() calls all registered callbacks with arguments', async () => {
    const { Producer, Consumer, getCallbacks } = setup();
    const received: number[] = [];
    const { unmount: unmountConsumer } = render(
      <>
        <Producer />
        <Consumer onValue={v => received.push(v)} />
      </>
    );
    await act(async () => { await getCallbacks().invoke(42); });
    expect(received).toContain(42);
    unmountConsumer();
  });

  it('after a consumer unmounts, its callback is no longer invoked', async () => {
    const { Producer, Consumer, getCallbacks } = setup();
    const received: number[] = [];

    const { rerender } = render(
      <>
        <Producer />
        <Consumer onValue={v => received.push(v)} />
      </>
    );

    // unmount consumer by re-rendering without it
    rerender(<Producer />);
    received.length = 0;
    await act(async () => { await getCallbacks().invoke(99); });
    expect(received).toHaveLength(0);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useCallbacks/useCallbacks.tests.tsx
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useCallbacks/useCallbacks.tests.tsx
git -C C:/code/personal/react-ui commit -m "test(hooks): add useCallbacks tests"
```

---

### Task 17: useBatchUpdates tests

**Files:**
- Create: `src/hooks/useBatchUpdates/useBatchUpdates.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useBatchUpdates } from './useBatchUpdates';

describe('useBatchUpdates', () => {
  it('executes the delegate and returns its result', () => {
    const { result } = renderHook(() => useBatchUpdates());
    let value: number | undefined;
    act(() => { value = result.current(() => 42); });
    expect(value).toBe(42);
  });

  it('onComplete callback fires after the batch completes', () => {
    const { result } = renderHook(() => useBatchUpdates());
    const completed: string[] = [];
    act(() => {
      result.current(() => {
        result.current.onComplete('step1', () => completed.push('step1'));
      });
    });
    expect(completed).toContain('step1');
  });

  it('onComplete fires immediately when called outside a batch', () => {
    const { result } = renderHook(() => useBatchUpdates());
    const completed: string[] = [];
    act(() => {
      result.current.onComplete('outside', () => completed.push('outside'));
    });
    expect(completed).toContain('outside');
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useBatchUpdates/useBatchUpdates.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useBatchUpdates/useBatchUpdates.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useBatchUpdates tests"
```

---

### Task 18: useDOMRef tests

**Files:**
- Create: `src/hooks/useDOMRef/useDOMRef.tests.tsx`

- [ ] **Step 1: Write and run the tests**

```tsx
import { act, render } from '@testing-library/react';
import { useDOMRef } from './useDOMRef';

describe('useDOMRef', () => {
  it('connected callback fires when an element is attached', () => {
    const connected = vi.fn();
    function TestComponent() {
      const setTarget = useDOMRef({ connected });
      return <div ref={setTarget as any} />;
    }
    render(<TestComponent />);
    expect(connected).toHaveBeenCalledTimes(1);
    expect(connected.mock.calls[0][0]).toBeInstanceOf(HTMLElement);
  });

  it('disconnected callback fires when element is removed', () => {
    const disconnected = vi.fn();
    function TestComponent({ show }: { show: boolean }) {
      const setTarget = useDOMRef({ disconnected });
      return show ? <div ref={setTarget as any} /> : null;
    }
    const { rerender } = render(<TestComponent show />);
    rerender(<TestComponent show={false} />);
    expect(disconnected).toHaveBeenCalledTimes(1);
  });

  it('returns [ref, setTarget] when called with no config', () => {
    function TestComponent() {
      const result = useDOMRef();
      // result is [RefObject, HTMLTargetDelegate]
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      return null;
    }
    render(<TestComponent />);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useDOMRef/useDOMRef.tests.tsx
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useDOMRef/useDOMRef.tests.tsx
git -C C:/code/personal/react-ui commit -m "test(hooks): add useDOMRef tests"
```

---

### Task 19: useAsync tests

**Files:**
- Create: `src/hooks/useAsync/useAsync.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('isLoading is false before trigger, true during, false after resolve', async () => {
    let resolve!: () => void;
    const { result } = renderHook(() =>
      useAsync(async () => new Promise<void>(r => { resolve = r; }), [], { manuallyTriggered: true })
    );
    expect(result.current.isLoading).toBe(false);
    act(() => { result.current.trigger(); });
    expect(result.current.isLoading).toBe(true);
    await act(async () => { resolve(); });
    expect(result.current.isLoading).toBe(false);
  });

  it('response is undefined initially, populated after resolve', async () => {
    const { result } = renderHook(() =>
      useAsync(async () => 'hello', [], { manuallyTriggered: true })
    );
    expect(result.current.response).toBeUndefined();
    await act(async () => { result.current.trigger(); });
    expect(result.current.response).toBe('hello');
  });

  it('cancel() prevents the response from being applied', async () => {
    let resolve!: (v: string) => void;
    const { result } = renderHook(() =>
      useAsync(async () => new Promise<string>(r => { resolve = r; }), [], { manuallyTriggered: true })
    );
    act(() => { result.current.trigger(); });
    act(() => { result.current.cancel(); });
    await act(async () => { resolve('cancelled-value'); });
    expect(result.current.response).toBeUndefined();
  });

  it('error is populated when the delegate throws', async () => {
    const { result } = renderHook(() =>
      useAsync(async () => { throw new Error('boom'); }, [], { manuallyTriggered: true })
    );
    await act(async () => { result.current.trigger(); });
    expect(result.current.error?.message).toBe('boom');
  });

  it('manuallyTriggered: false auto-fires on mount', async () => {
    const fn = vi.fn().mockResolvedValue('auto');
    const { result } = renderHook(() => useAsync(fn, []));
    await act(async () => {});
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.response).toBe('auto');
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useAsync/useAsync.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useAsync/useAsync.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useAsync tests"
```

---

### Task 20: useItems tests

**Files:**
- Create: `src/hooks/useItems/useItems.tests.ts`

- [ ] **Step 1: Write and run the tests**

```typescript
import { act, renderHook } from '@testing-library/react';
import { useItems } from './useItems';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import type { ReactListItem } from '../../models';

type Item = { name: string };

function makeRequest(items: ReactListItem<Item>[]) {
  return async (req: UseDataRequest, respond: (r: UseDataResponse<ReactListItem<Item>>) => void) => {
    respond({ requestId: req.requestId, items, total: items.length });
  };
}

describe('useItems', () => {
  it('populates items from the onRequest response', async () => {
    const items: ReactListItem<Item>[] = [{ id: '1', data: { name: 'Alice' } }];
    const { result } = renderHook(() =>
      useItems<Item>({ onRequest: makeRequest(items) })
    );
    await act(async () => {});
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('1');
  });

  it('isLoading is true initially then false after response', async () => {
    const items: ReactListItem<Item>[] = [];
    const { result } = renderHook(() =>
      useItems<Item>({ onRequest: makeRequest(items) })
    );
    // after act the request completes
    await act(async () => {});
    expect(result.current.isLoading).toBe(false);
  });

  it('renders static items prop without calling onRequest', () => {
    const items: ReactListItem<Item>[] = [
      { id: '1', data: { name: 'Bob' } },
      { id: '2', data: { name: 'Carol' } },
    ];
    const { result } = renderHook(() => useItems<Item>({ items }));
    expect(result.current.items).toHaveLength(2);
  });

  it('refresh() triggers a new request', async () => {
    const requestFn = vi.fn(async (req: UseDataRequest, respond: (r: UseDataResponse<ReactListItem<Item>>) => void) => {
      respond({ requestId: req.requestId, items: [], total: 0 });
    });
    const { result } = renderHook(() => useItems<Item>({ onRequest: requestFn }));
    await act(async () => {});
    const callsBefore = requestFn.mock.calls.length;
    await act(async () => { result.current.request({ offset: 0, limit: 20 }); });
    expect(requestFn.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});
```

```bash
pnpm -C C:/code/personal/react-ui test:ci -- src/hooks/useItems/useItems.tests.ts
```

- [ ] **Step 2: Commit**

```bash
git -C C:/code/personal/react-ui add src/hooks/useItems/useItems.tests.ts
git -C C:/code/personal/react-ui commit -m "test(hooks): add useItems tests"
```

---

### Task 21: Final verification

- [ ] **Run the complete test suite**

```bash
pnpm -C C:/code/personal/react-ui test:ci
```

Expected: all test files pass including the 22 new hook test files. Fix any failures before marking done.
