# Mobile bottom-sheet dialogs & windows — Design

**Date:** 2026-06-14
**Status:** Ready for Development

## Summary

On mobile devices, windows and dialogs should render as a bottom-sheet that slides up
from the bottom of the screen and is only as tall as its content (capped), instead of
rendering as a floating, draggable window. Additionally, `useWindow` should behave like
`useDialog` on mobile, since multiple floating windows are not viable on a phone.

Desktop and tablet behaviour is unchanged. The trigger is strictly `device === 'mobile'`.

## Background

The current architecture:

- `Window` ([src/components/Windows/Window/Window.tsx](../../../src/components/Windows/Window/Window.tsx))
  renders the actual window chrome (title bar, content, resizer) and is used by **both**
  windows and dialogs. `Dialog` ([src/components/Dialog/Dialog.tsx](../../../src/components/Dialog/Dialog.tsx))
  is a thin wrapper over `Window`.
- `useWindow` and `useDialog` are near-identical; they differ mainly in which manager type
  they target — `'windows'` vs `'dialogs'` — via `WindowsManager.getManagerForType`.
- The `Dialogs` container ([src/components/Dialog/Dialogs.tsx](../../../src/components/Dialog/Dialogs.tsx))
  blurs the background and disables interaction behind it (modal, single-instance feel);
  the `Windows` container lets multiple windows float freely.
- `device` is exposed reactively. `useDevice`
  ([src/theme/useDevice/useDevice.ts](../../../src/theme/useDevice/useDevice.ts)) is built on
  `useSyncExternalStore` over media queries, and `useStyles()` surfaces the same value via
  `ThemeContext`. **`device` can change at runtime without a remount** (resize across the
  mobile breakpoint, tablet rotation, Storybook device simulation).

Because `device` is reactive, **conditionally calling a hook** based on it (e.g.
`if (device === 'mobile') return useDialog(...)`) is a rules-of-hooks violation: it would
work until the viewport crosses the breakpoint, then crash. All `device`-driven branching
must therefore be in values/closures, never in hook-call ordering.

## Goals

1. On mobile, windows and dialogs render as a bottom-anchored sheet: slides up from the
   bottom, full width, height sized to content (capped, scroll beyond), rounded top corners.
2. On mobile, `useWindow` routes to the dialogs manager so windows behave like dialogs
   (modal, blurred background, single-instance).
3. Everything else stays the same. No change for `web` or `tablet`.

## Non-goals

- Migrating an already-open window from the windows manager to the dialogs manager when the
  viewport is resized into the mobile breakpoint mid-life. The redirect applies at `open()`
  time only. (Irrelevant on real phones; only observable via resize/simulation after open.)
- Drag-to-dismiss gestures or a grab handle on the sheet. Dismissal is via the existing
  close button. Keep it simple.
- Reusing the MUI `Drawer` component (see Rejected alternative).

## Design

### Part 1 — `Window` renders as a bottom-sheet on mobile

All changes in [Window.tsx](../../../src/components/Windows/Window/Window.tsx).

- Read `device` from `useStyles()`. Compute `isMobile = device === 'mobile'`.
- When mobile, add an `is-mobile` class to the window element.
- **Layout is class-driven (createStyles), not inline styles** — consistent with the
  project rule against inline `style` props. The absolute positional inline `style`
  produced by `useWindowDimensions` is **not applied** when mobile, so the `is-mobile`
  class fully owns layout:
  - Pinned to the bottom: `left: 0; right: 0; bottom: 0; top: auto`.
  - Full width: `min-width: 0; width: 100%; max-width: 100%`.
  - Height sized to content: `height: auto`, capped at `max-height: 85vh`; the content
    area scrolls when content exceeds the cap.
  - Rounded top corners only: `border-top-left-radius: 16px; border-top-right-radius: 16px`
    (matches the existing `Drawer` bottom-sheet styling).
- **Entrance/exit animation:** in the `is-mobile` variants of the existing
  `preparing` / `prepared` / `is-visible` states, replace the `scale(0.7)` transform with
  `translateY(100%) → translateY(0)`. The window slides up on open and slides down on
  close. The existing visibility-timing machinery (`preparationClassName`,
  `isVisible`, `useWindowEvents`) is reused unchanged; only the visual transform differs.
- **Force-off desktop affordances on mobile**, regardless of incoming props:
  hide the maximize button, disable drag, disable resize. Title bar and close button
  remain as configured by the caller.

Because `Window` is shared by windows and dialogs, this single change covers `useDialog`
content and `useWindow`-redirected content on mobile. `Dialog` itself needs no change.

### Part 2 — `useWindow` routes to the dialogs manager on mobile

All changes in [useWindow.tsx](../../../src/components/Windows/useWindow.tsx).

- Call `useDevice()` once, unconditionally, in the main (args-provided) branch — the same
  place existing hooks like `useId` are called. (The no-arg in-content branch returns early
  and is a stable, separate call site, so this introduces no rules-of-hooks risk.)
- A `managerId` provided to `useWindow` (or resolved from `WindowsManagerContext`) is a
  **windows-type** id and cannot be reused for type `'dialogs'`. So on mobile the dialogs
  manager is resolved independently, the same way `useDialog` does it — via
  `DialogsManagerContext` (defaulting to the dialogs default manager). Change `getManager`
  to branch on device:

  ```ts
  const device = useDevice();
  const contextDialogsManagerId = useContext(DialogsManagerContext);
  // existing: effectiveManagerId = providedManagerId ?? useContext(WindowsManagerContext)
  const getManager = () => device === 'mobile'
    ? WindowsManager.getManagerForType('dialogs', contextDialogsManagerId)
    : WindowsManager.getManagerForType('windows', effectiveManagerId);
  ```

- `open()` argument semantics are unchanged on both platforms — only the target manager
  differs. The window renders inside the `Dialogs` container (modal, blurred,
  single-instance) and, via Part 1, as a bottom-sheet.
- **No Dialogs container on mobile:** `getManagerForType('dialogs', ...)` already throws a
  clear, actionable error (*"No default dialogs manager found. Ensure a Dialogs component is
  mounted."*). No additional handling required.

## Rejected alternative

**Render mobile content through the MUI `Drawer` component** instead of restyling `Window`.
Rejected: it bypasses the window machinery (validation, form-dirty guarding, actions
toolbar, manager lifecycle, title handling), all of which would need re-wiring. Restyling
`Window` via `device` keeps all of it intact and is materially lower-risk.

## Affected files

- `src/components/Windows/Window/Window.tsx` — mobile bottom-sheet styling + force-off
  drag/resize/maximize on mobile.
- `src/components/Windows/useWindow.tsx` — device-based manager routing.

## Testing

- Window/Dialog stories under mobile-simulated device: verify bottom-anchored sheet,
  slide-up on open, slide-down on close, content-sized height with `85vh` cap + scroll,
  rounded top corners, no drag/resize/maximize.
- `web` and `tablet`: verify unchanged (floating window, drag/resize/maximize as before).
- `useWindow` on mobile opens into the dialogs manager (modal/blurred). On desktop it still
  opens into the windows manager.
- `useWindow` on mobile with no `Dialogs` container mounted throws the clear error.
