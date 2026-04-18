# Test Coverage — Group 2: Core Standalone Hooks

**Date:** 2026-04-18  
**Status:** Approved

## Goal

Add Vitest unit tests for all hooks in `src/hooks/` that contain meaningful testable logic. Each test file lives next to its source (co-located). All tests use `renderHook` + `act` from `@testing-library/react`. Timing-based hooks use `vi.useFakeTimers()` / `vi.runAllTimers()`.

---

## Skipped hooks (no meaningful unit-test surface)

- `useDrag` — pointer event simulation not reliable in jsdom
- `useOnResize` — ResizeObserver not implemented in jsdom
- `useEventIsolator` — DOM event capture/prevention, better in Storybook play tests
- `useBrowserInfo` — reads navigator UA; jsdom always reports same string, nothing to assert
- `useDragAndDrop` — commented out in source
- `usePromise` — commented out in source
- `useRecaptcha` — requires external reCAPTCHA script
- `useFileUploader` — requires file system / FormData interaction
- `useAPIGridRequest` — complex API request hook, covered by integration tests

---

## Files and test cases

### `src/hooks/useOnMount/useOnMount.tests.ts`
- Calls the delegate exactly once after mount
- Does not call the delegate before mount

### `src/hooks/useOnChange/useOnChange.tests.ts`
- Does not call the delegate on the initial render
- Calls the delegate when a dependency changes
- Calls the delegate again on each subsequent change
- Does not call the delegate when dependencies are the same

### `src/hooks/useOnUnmount/useOnUnmount.tests.ts`
- Calls the optional delegate when component unmounts
- Works with no delegate provided
- `hasUnmounted()` returns false before unmount
- `hasUnmounted()` returns true after unmount

### `src/hooks/useBooleanState/useBooleanState.tests.ts`
- Initialises to `false` by default
- Accepts a custom initial value of `true`
- `setTrue()` sets state to `true`
- `setFalse()` sets state to `false`
- `setFlag` (raw setter) sets arbitrary value
- Toggling true→false→true works correctly

### `src/hooks/useToggleState/useToggleState.tests.ts`
- Initialises to `false` by default
- Accepts initial value `true`
- Accepts an initialiser function
- `toggle()` flips false → true
- `toggle()` flips true → false
- Multiple toggles cycle state correctly

### `src/hooks/useUpdatableState/useUpdatableState.tests.ts`
- Returns the initial value on first render
- Setter updates the value and triggers re-render
- Re-initialises when dependencies change (calls delegate with previous state)
- Does not re-initialise when dependencies are the same
- Setter with updater function receives current state

### `src/hooks/useSyncState/useSyncState.tests.ts`
- Initialises to `undefined` with no argument
- Initialises via factory function
- `setState(value)` updates state synchronously
- `setState(fn)` receives current state and sets result
- `getState()` returns current state
- `setState` with same deep-equal value does not trigger re-render

### `src/hooks/useForceUpdate/useForceUpdate.tests.ts`
- Returns a stable function reference across renders
- Calling the returned function triggers a re-render
- Does not trigger re-render after component unmounts

### `src/hooks/useDebounce/useDebounce.tests.ts`
Uses `vi.useFakeTimers()`.
- Does not call the delegate immediately
- Calls the delegate after the specified delay
- Resets the timer when called again before delay expires
- `longestMs` option: fires after longestMs even if calls keep coming
- Does not call the delegate after component unmounts

### `src/hooks/useTimeout/useTimeout.tests.ts`
Uses `vi.useFakeTimers()`.
- Calls delegate after specified timeout
- `cancelTimeout()` prevents the delegate from firing
- Re-runs timeout when dependencies change
- `triggerOnUnmount: true` fires delegate on unmount if timeout is pending
- Does not fire after unmount when `triggerOnUnmount` is false

### `src/hooks/useInterval/useInterval.tests.ts`
Uses `vi.useFakeTimers()`.
- Calls delegate repeatedly on the interval
- `cancelInterval()` stops future calls
- Re-sets interval when dependencies change
- `triggerOnUnmount: true` fires delegate on unmount if interval is running
- Cleans up interval on unmount

### `src/hooks/useId/useId.tests.ts`
- Returns a non-empty string
- Returns a stable ID across re-renders when no id is provided
- Returns the provided id when one is passed
- Updates to a new provided id when the prop changes

### `src/hooks/useObservable/useObservable.tests.ts`
- `get()` returns the initial value
- `set(value)` updates the value
- `set(fn)` receives current value and sets result
- `onChange` callback fires when value changes
- `onChange` does not fire when value is the same reference
- Updates when dependency array changes

### `src/hooks/useDistributedState/useDistributedState.tests.ts`
- `get()` returns the initial value
- `set(value)` updates state
- `getAndObserve()` triggers re-render on state change
- `modify(fn)` applies updater function
- `onChange(fn)` fires when state changes
- Multiple components sharing the same `state` ref receive updates
- Does not re-run factory when dependencies are the same

### `src/hooks/useSet/useSet.tests.ts`
`useSet()` returns `useRef(() => new Set()).current` — i.e. the `Set` directly, not a ref wrapper.
- Returns a `Set` instance
- Returns the same `Set` reference across re-renders (identity stable)

### `src/hooks/useMap/useMap.tests.ts`
`useMap()` returns `useRef(() => new Map()).current` — i.e. the `Map` directly.
- Returns a `Map` instance
- Returns the same `Map` reference across re-renders (identity stable)

### `src/hooks/useRef/useRef.tests.ts`
- Returns a ref with the value produced by the initialiser
- Returns the same ref object across re-renders
- Does not re-run the initialiser on re-render

### `src/hooks/useCallbacks/useCallbacks.tests.ts`
Note: `register` is itself a hook (calls `useRef`, `useBound`, `useLayoutEffect`, `useEffect`) so it must be called during render inside a component. Tests require a wrapper component that calls both `useCallbacks()` and `register()` during render.
- `invoke()` calls all registered callbacks with the provided arguments
- A callback registered via `register` is called when `invoke` fires
- After a component using `register` unmounts, its callback is no longer invoked
- Multiple components can register callbacks on the same `useCallbacks` instance via a shared `state` ref

### `src/hooks/useBatchUpdates/useBatchUpdates.tests.ts`
- Batches multiple state updates into a single re-render
- `onComplete` callback fires after the batch is committed
- Works with zero updates (no-op)

### `src/hooks/useDOMRef/useDOMRef.tests.ts`
- `onConnected` callback fires when a DOM element is attached
- `onDisconnected` callback fires when the element is detached
- `ref` can be passed to a rendered element

### `src/hooks/useAsync/useAsync.tests.ts`
- `isLoading` is `false` before trigger, `true` while pending, `false` after resolve
- `response` is `undefined` initially, populated after resolve
- `cancel()` prevents the response from being applied
- Cancels the in-flight request when trigger is called again before previous resolves
- `error` is populated when the delegate throws
- `manuallyTriggered: true` does not auto-fire
- Does not update state after component unmounts

### `src/hooks/useItems/useItems.tests.ts`
- Calls `onRequest` with initial pagination params
- Populates `items` from the response callback
- `refresh()` triggers a new request with the same pagination
- `isLoading` is true while request is in flight
- `error` is set when `onRequest` throws
- Handles static `items` prop (no `onRequest`) by rendering them directly
