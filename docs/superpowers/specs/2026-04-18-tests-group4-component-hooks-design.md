# Test Coverage — Group 4: Component Hooks

**Date:** 2026-04-18  
**Status:** Approved

## Goal

Add Vitest unit tests for the component hooks that expose meaningful state/logic contracts testable in isolation. Tests use `renderHook` + `act`. For hooks that return React components, render those components to verify behaviour end-to-end within the test.

---

## Skipped hooks

- `useDialog` — deeply wired to `WindowsManager`; no meaningful unit-test surface without full infrastructure
- `useDrawer` — same reason as `useDialog`
- `useSignInDialog` — thin wrapper over `useDialog`
- `useWindows` / `useWindow` — require full `WindowsManager` infrastructure
- `usePopupMenu` — DOM-position dependent, better covered by Storybook play tests
- `useModalLoader` — thin context accessor
- `useNotifications` — thin wrapper over `react-hot-toast`
- `useScroller` — thin context accessor
- `useColumns` — table column config, no state logic
- `useFormObserver` — thin observer hook, covered by `useForm` tests

---

## Files and test cases

### `src/components/Tabs/useTabs.tests.tsx`

- `selectedTabIndex` starts at `0`
- `selectTab(n)` sets `selectedTabIndex` to `n`
- `selectTab(fn)` receives current index and sets the returned value
- Selecting a tab that is already selected does not trigger unnecessary re-renders
- `Tabs` and `Tab` components returned are valid React components (smoke: render without error)

### `src/components/Expander/useExpander.tests.tsx`

- `isExpanded` starts `false` by default
- `isExpanded` starts `true` when `initialState: true` is passed
- `isExpanded` starts at the value returned by the initialiser function
- `toggle()` flips `false` → `true`
- `toggle()` flips `true` → `false`
- `setExpanded(true)` sets `isExpanded` to `true`
- `setExpanded(false)` sets `isExpanded` to `false`
- `onExpand` callback fires with the new value after each toggle
- `Expander` component is a valid React component (smoke: renders without error)

### `src/components/Ripple/useRipple.tests.tsx`

`useRipple` is primarily visual. Tests verify the stable API contract only.

- Returns `rippleTarget` (object with event handler props)
- Returns `Ripple` (valid React component — renders without error)
- Calling `rippleTarget.onMouseDown` with a synthetic event does not throw

### `src/components/Form/useForm.tests.tsx`

`useForm` depends on `useNotifications` (which needs `NotificationsProvider`) and `useFields`. Wrapper: render a component that provides `NotificationsProvider` and calls `useForm`.

- `Field` component is returned and renders without error
- `getIsDirty()` returns `false` initially
- After a field update via `onChange`, `getIsDirty()` returns `true`
- `cancel()` resets dirty state to `false`
- `cancel()` restores the original data via `onChange`/`setData`
- `save()` is a no-op when `getIsDirty()` is `false`
- `save()` calls `onSave` with current data when dirty
- `save()` resets `getIsDirty()` to `false` after saving
- `Form` component renders children wrapped in `FormContext.Provider`
