# Mobile bottom-sheet dialogs & windows — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On mobile devices, render windows and dialogs as a bottom-sheet that slides up from the bottom and is only as tall as its content, and make `useWindow` behave like `useDialog` on mobile.

**Architecture:** Two independent changes. (1) `useWindow` reads the reactive `device` value once (via `useDevice()`) and routes `open()` to the dialogs manager when `device === 'mobile'`. (2) The shared `Window` component, which renders both windows and dialogs, gains a `device`-driven `is-mobile` style variant that pins it to the bottom as a content-height sheet and slides it up; on mobile it also force-disables drag/resize/maximize. Desktop and tablet are untouched.

**Tech Stack:** React, TypeScript, TSS (`createStyles`), Storybook (webpack5), Vitest + @testing-library/react.

**Spec:** [docs/superpowers/specs/2026-06-14-mobile-dialog-bottom-sheet-design.md](../specs/2026-06-14-mobile-dialog-bottom-sheet-design.md)

---

## File structure

- **Modify** `src/components/Windows/useWindow.tsx` — device-based manager routing (Task 1).
- **Create** `src/components/Windows/useWindow.tests.tsx` — routing unit tests (Task 1).
- **Modify** `src/components/Windows/Window/Window.tsx` — `is-mobile` bottom-sheet styling + force-off drag/resize/maximize on mobile (Task 2).
- **Modify** `src/components/Dialog/Dialog.stories.tsx` — add a mobile bottom-sheet story for visual verification (Task 3).

Each task is committed independently.

---

## Task 1: `useWindow` routes to the dialogs manager on mobile

**Files:**
- Modify: `src/components/Windows/useWindow.tsx`
- Test: `src/components/Windows/useWindow.tests.tsx` (create)

Context you need:
- `WindowsManager.getManagerForType(type, managerId?)` ([src/components/Windows/WindowsManager.ts:84](../../../src/components/Windows/WindowsManager.ts)) returns the manager for a type; with no `managerId` it uses the default for that type (`'windows-default'` / `'dialogs-default'`) and **throws a clear error if none is mounted** (`No default dialogs manager found. Ensure a Dialogs component is mounted.`).
- `WindowsManager.getOrCreate(id, instanceId, type)` registers a manager. `manager.open({...})` adds the window **synchronously** (only the returned promise awaits the open animation), so `manager.has(id)` is true immediately after calling the hook's `openXxx` without awaiting.
- `useDevice()` ([src/theme/useDevice/useDevice.ts:29](../../../src/theme/useDevice/useDevice.ts)) returns the current `DeviceType` and is backed by `useSyncExternalStore`. In tests with no `matchMedia` it returns `'web'`; to force a device, wrap the hook in a `ThemeContext.Provider` is **not** enough for `useDevice` (it reads media queries, not context). Instead, the test mocks `useDevice` directly with `vi.mock` (see test below).
- `DialogsManagerContext` ([src/components/Windows/WindowsContexts.ts:26](../../../src/components/Windows/WindowsContexts.ts)) defaults to `undefined`.

- [ ] **Step 1: Write the failing test**

Create `src/components/Windows/useWindow.tests.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

// Control the device the hook sees. Each test sets currentDevice before rendering.
let currentDevice: 'web' | 'tablet' | 'mobile' = 'web';
vi.mock('../../theme/useDevice', () => ({
  useDevice: () => currentDevice,
}));

import { useWindow } from './useWindow';
import { createWindow } from './createWindow';
import { WindowsManager, WINDOWS_DEFAULT_ID, DIALOGS_DEFAULT_ID } from './WindowsManager';

const RoutingTestWindow = createWindow('RoutingTestWindow', () => () => null);

function createDefaultManagers() {
  WindowsManager.getOrCreate(WINDOWS_DEFAULT_ID, 'uw-test-windows', 'windows');
  WindowsManager.getOrCreate(DIALOGS_DEFAULT_ID, 'uw-test-dialogs', 'dialogs');
}

beforeEach(() => {
  currentDevice = 'web';
  WindowsManager.remove(WINDOWS_DEFAULT_ID);
  WindowsManager.remove(DIALOGS_DEFAULT_ID);
});

afterEach(() => {
  WindowsManager.remove(WINDOWS_DEFAULT_ID);
  WindowsManager.remove(DIALOGS_DEFAULT_ID);
});

describe('useWindow device routing', () => {
  it('opens into the windows manager on web', async () => {
    createDefaultManagers();
    currentDevice = 'web';
    const { result } = renderHook(() => useWindow(RoutingTestWindow));
    await act(async () => { await (result.current as any).openRoutingTestWindow('rt-web'); });
    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).has('rt-web')).toBe(true);
    expect(WindowsManager.get(DIALOGS_DEFAULT_ID).has('rt-web')).toBe(false);
  });

  it('opens into the dialogs manager on mobile', async () => {
    createDefaultManagers();
    currentDevice = 'mobile';
    const { result } = renderHook(() => useWindow(RoutingTestWindow));
    await act(async () => { await (result.current as any).openRoutingTestWindow('rt-mobile'); });
    expect(WindowsManager.get(DIALOGS_DEFAULT_ID).has('rt-mobile')).toBe(true);
    expect(WindowsManager.get(WINDOWS_DEFAULT_ID).has('rt-mobile')).toBe(false);
  });

  it('throws a clear error on mobile when no dialogs manager is mounted', async () => {
    WindowsManager.getOrCreate(WINDOWS_DEFAULT_ID, 'uw-test-windows', 'windows');
    currentDevice = 'mobile';
    const { result } = renderHook(() => useWindow(RoutingTestWindow));
    await expect((result.current as any).openRoutingTestWindow('rt-none'))
      .rejects.toThrow(/No default dialogs manager found/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run src/components/Windows/useWindow.tests.tsx`
Expected: the `'opens into the dialogs manager on mobile'` test FAILS (window lands in the windows manager because routing isn't implemented yet). The web test may pass already.

- [ ] **Step 3: Implement device-based routing**

In `src/components/Windows/useWindow.tsx`:

Add the imports — extend the existing `react` import to include `useContext` (already present) and add `useDevice` and `DialogsManagerContext`:

```tsx
import { useDevice } from '../../theme/useDevice';
```

Add `DialogsManagerContext` to the existing import from `./WindowsContexts`:

```tsx
import { WindowRenderContext, WindowsManagerContext, DialogsManagerContext } from './WindowsContexts';
```

In the body, after the existing line `const effectiveManagerId = providedManagerId ?? contextManagerId;`, add:

```tsx
  const device = useDevice();
  const contextDialogsManagerId = useContext(DialogsManagerContext);
```

Replace the existing `getManager`:

```tsx
  const getManager = () => WindowsManager.getManagerForType('windows', effectiveManagerId);
```

with:

```tsx
  const getManager = () => device === 'mobile'
    ? WindowsManager.getManagerForType('dialogs', contextDialogsManagerId)
    : WindowsManager.getManagerForType('windows', effectiveManagerId);
```

Leave everything else (the no-arg early-return branch, `openWindow`, `closeWindow`, the `dialogOnly` guard, etc.) unchanged.

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm exec vitest run src/components/Windows/useWindow.tests.tsx`
Expected: all three tests PASS.

- [ ] **Step 5: Typecheck**

Run: `pnpm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Windows/useWindow.tsx src/components/Windows/useWindow.tests.tsx
git commit -m "feat(windows): route useWindow to the dialogs manager on mobile"
```

---

## Task 2: `Window` renders as a bottom-sheet on mobile

**Files:**
- Modify: `src/components/Windows/Window/Window.tsx`

Context you need:
- `useStyles()` returns `device` alongside `css`/`join` ([src/theme/createStyles.tsx:23](../../../src/theme/createStyles.tsx)).
- The window element's entrance/exit is driven by classes: base `.window` (`transform: scale(0.7); opacity: 0`), `.preparing`, `.prepared`, and `.is-visible` (`transform: scale(1); opacity: 1`). See current styles in [Window.tsx:27-109](../../../src/components/Windows/Window/Window.tsx).
- The inline `style` (absolute `top/left/width/height`) comes from `useWindowDimensions`. On mobile we will **not** apply it, letting the `is-mobile` class own layout (keeps us off inline styles, per the project rule).
- Project rule: **no inline `style` props** — all new styling goes through `createStyles`. (See `feedback_no_inline_styles` in user memory.)

This task is verified visually in Task 3 (Storybook), since it is purely presentational CSS. There is no unit test step here.

- [ ] **Step 1: Add `device` to the destructured styles**

In `Window.tsx`, change:

```tsx
  const { css, join } = useStyles();
```

to:

```tsx
  const { css, join, device } = useStyles();
  const isMobile = device === 'mobile';
```

- [ ] **Step 2: Add the `is-mobile` bottom-sheet styles**

In the `createStyles` call in `Window.tsx`, add these rules **inside** the `window: { ... }` style object, after the existing `'&.is-maximized'` block (so they sit alongside the other `&.` state selectors). Use the literal values below:

```tsx
    '&.is-mobile': {
      top: 'auto !important',
      bottom: '0 !important',
      left: '0 !important',
      right: '0 !important',
      width: '100% !important',
      maxWidth: '100% !important',
      minWidth: '0 !important',
      height: 'auto !important',
      minHeight: '0 !important',
      maxHeight: '85vh',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transform: 'translateY(100%)',

      '&.preparing': {
        transform: 'translateY(0)',
        opacity: 0,
      },
      '&.prepared': {
        transform: 'translateY(100%)',
        opacity: 0,
      },
      '&.is-visible': {
        transform: 'translateY(0)',
        opacity: 1,
      },
      '&.is-maximized': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
    },
```

Note: the `!important` flags are required because they override the inline `top/left/width/height` that `useWindowDimensions` may still set (we also stop passing that inline style in Step 4, but `!important` keeps the layout correct even if a value slips through, e.g. `width` set into state).

- [ ] **Step 3: Apply the `is-mobile` class to the window element**

In the `join(...)` call on the `<Flex ... tagName="window">`, add `isMobile && 'is-mobile'`. The call becomes:

```tsx
      className={join(
        css.window,
        preparationClassName,
        isVisible && preparationClassName == null && 'is-visible',
        allowIsMaximized && isMaximized && 'is-maximized',
        shouldStopTransitions && 'stop-transitions',
        !isFocused && 'is-not-focused',
        isMobile && 'is-mobile',
        className,
      )}
```

- [ ] **Step 4: Stop applying the absolute inline position on mobile**

Change:

```tsx
      style={style}
```

to:

```tsx
      style={isMobile ? undefined : style}
```

- [ ] **Step 5: Force-off drag, resize and maximize on mobile**

Change the existing draggable calculation:

```tsx
  const isDraggable = !disableDrag && !isMaximized;
```

to:

```tsx
  const isDraggable = !disableDrag && !isMaximized && !isMobile;
```

For the maximize button, the title bar renders it when `!hideMaximizeButton`. Introduce a mobile-aware flag right after `isMobile` is defined (Step 1):

```tsx
  const hideMaximize = hideMaximizeButton || isMobile;
```

Then in the title bar `endAdornment`, replace both `!hideMaximizeButton` occurrences with `!hideMaximize`:

```tsx
            {!hideMaximize && !isMaximized && <Button variant="hover" onClick={maximizeWindow} size="small"><Icon name="window-maximize" size="small" /></Button>}
            {!hideMaximize && isMaximized && <Button variant="hover" size="small" onClick={restoreWindow}><Icon name="window-restore" size="small" /></Button>}
```

For the resizer, change:

```tsx
          <WindowResizer isEnabled={!isMaximized && !disableResize} windowElementRef={windowElementRef} onResizingStart={handleResizingStart} onResizingEnd={handleResizingEnd} />
```

to:

```tsx
          <WindowResizer isEnabled={!isMaximized && !disableResize && !isMobile} windowElementRef={windowElementRef} onResizingStart={handleResizingStart} onResizingEnd={handleResizingEnd} />
```

- [ ] **Step 6: Typecheck and lint**

Run: `pnpm run typecheck`
Expected: no errors.

Run: `pnpm run lint`
Expected: no new errors in `Window.tsx`.

- [ ] **Step 7: Commit**

```bash
git add src/components/Windows/Window/Window.tsx
git commit -m "feat(windows): render windows as a bottom-sheet on mobile"
```

---

## Task 3: Mobile bottom-sheet story + visual verification

**Files:**
- Modify: `src/components/Dialog/Dialog.stories.tsx`

Context you need:
- Storybook stories can force a device with `parameters: { device: 'mobile' }`; the global `StorybookDeviceDecorator` ([src/Storybook/StorybookDeviceDecorator.tsx:19](../../../src/Storybook/StorybookDeviceDecorator.tsx)) reads it and renders children through `StorybookDeviceProvider`, which sets `useStyles().device` to `'mobile'`.
- The existing `Default` story already wires up a `Dialogs` container, `TestDialogDefinition`, and an Open button. Reuse that machinery.

- [ ] **Step 1: Add a mobile story**

In `src/components/Dialog/Dialog.stories.tsx`, after the existing `Default` story, add:

```tsx
export const MobileBottomSheet: Story = {
  args: {},
  parameters: { device: 'mobile' },
  render: () => {
    const { css } = useStyles();
    const { openTestDialog } = useDialog(TestDialogDefinition);

    const onOpen = useBound(async () => {
      await openTestDialog(123, 'This dialog should slide up from the bottom as a sheet on mobile.');
    });

    return (
      <Flex tagName="dialog-test" valign="top" align="left" isVertical>
        <Flex gap={4}>
          <Button onClick={onOpen}>Open</Button>
        </Flex>
        <StorybookComponent width={390} height={700} showComponentBorders>
          <Dialogs shouldBlurBackground>
            <Flex tagName="background" className={css.background} />
            <Flex className={css.text}>This should be blurred behind the sheet!</Flex>
          </Dialogs>
        </StorybookComponent>
      </Flex>
    );
  },
};
```

- [ ] **Step 2: Start Storybook**

Use the preview tooling (`preview_start`) pointing at the Storybook dev server (`pnpm start`, port 6006), or run `pnpm start` and open `http://localhost:6006`.

- [ ] **Step 3: Verify the bottom-sheet visually**

Navigate to the **Dialog → MobileBottomSheet** story, click **Open**, then confirm via `preview_snapshot` / `preview_screenshot`:
- The dialog is anchored to the **bottom** of the 390×700 frame, full width.
- It is only as tall as its content (not full height), with **rounded top corners**.
- It **slid up** from the bottom on open (re-open to observe the animation).
- The background behind it is blurred.
- There is **no maximize button** and the dialog cannot be dragged or resized.

If any are wrong, fix `Window.tsx` (Task 2) and re-verify. Capture a screenshot as proof.

- [ ] **Step 4: Verify web/tablet are unchanged**

Switch the Device toolbar (or a separate `Default` story) to **web**: confirm the dialog still renders centred as a normal window with its usual chrome. Tablet behaves the same as web for this feature.

- [ ] **Step 5: Commit**

```bash
git add src/components/Dialog/Dialog.stories.tsx
git commit -m "test(dialog): add mobile bottom-sheet story"
```

- [ ] **Step 6 (optional): Update image snapshots**

If the Storybook image-snapshot suite is being run for this branch, regenerate snapshots so the new story is captured:

Run: `pnpm run storybook:update-snapshots`
Expected: a new snapshot for `components-dialog--mobile-bottom-sheet` is created. Commit it:

```bash
git add __image_snapshots__
git commit -m "test(dialog): add mobile bottom-sheet image snapshot"
```

---

## Final verification

- [ ] Run the full unit test suite: `pnpm exec vitest run` — expected: all pass.
- [ ] `pnpm run typecheck` — expected: no errors.
- [ ] `pnpm run lint` — expected: no new errors.
- [ ] Manually confirm in Storybook: a dialog on `mobile` is a bottom-sheet; on `web`/`tablet` it is a normal centred window; a `useWindow`-opened window on `mobile` appears modal/blurred (dialogs container) as a bottom-sheet.
```
