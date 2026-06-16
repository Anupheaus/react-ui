# Wizard Inline Mode — Design

**Date:** 2026-06-16
**Status:** Approved (pending spec review)

## Goal

Allow a wizard created with `createWizard` to be rendered **inline** in the page —
in place, without the dialog/window chrome — in addition to its current
dialog behaviour. A single wizard definition must work both ways with no
behavioural drift between modes.

The inline renderer is exposed as an additional deconstructable from the
existing `useWizard` hook:

```tsx
const { openAccountWizard, InlineAccountWizard } = useWizard(AccountWizard);

// dialog (unchanged):
openAccountWizard();

// inline:
return <InlineAccountWizard args={[userId]} onClose={response => setDone(response)} />;
```

## Decisions (from brainstorming)

- **Naming:** the inline component is keyed `Inline${Name}` on the hook return,
  consistent with the existing `open${Name}` / `close${Name}` convention and
  collision-free when multiple wizards are used in one component.
- **Completion:** a single `onClose(response)` callback prop. Final-step Save and
  any `close(response)` / `OkButton` / `Action value=...` inside the definition all
  fire `onClose`. The consumer decides what happens next (unmount, navigate, etc.).
- **Header:** the inline component renders the wizard's `title`/`icon` as a plain
  header (no close button, no drag/resize) when provided.
- **Args:** passed as the same positional tuple the definition takes, via an
  `args` prop.
- **Window-lifecycle callbacks** (`onClosing` / `onClosed` / `onFocus`) and
  drag/resize/maximize are window concepts and are ignored in inline mode.

## Current architecture (relevant coupling)

- `createWizard(name, definition)` registers a **window definition** with the
  windows manager and returns a `ReactUIWindow`. The definition is also attached
  to the returned component (`component.definition = wizardDefinition`).
- `useWizard` is currently a direct re-export of `useWindow`. `useWindow` returns
  dynamically-named methods: `open${Name}`, `close${Name}`, `focus${Name}`,
  `restore${Name}`, `maximize${Name}`.
- Dialog render path: manager → `WindowRenderer` provides `WindowRenderContext`
  (`id`, `managerId`, `close`, `setTitle`, `title`) and portals content into the
  manager DOM → `WizardContentComponent` builds the wizard utils and renders the
  definition → `<Wizard>` → `<Window>`.
- `<Wizard>` (`src/components/Wizard/Wizard/Wizard.tsx`) renders `<Window>` as its
  root. All step-management (`WizardContext`, step registration, validators,
  next/back) lives **inside** the Window and is already independent of it.
- `WizardActions` reads `WindowRenderContext.close` and `useWindowValidation()`,
  and renders `WindowActions`.
- `<Window>` provides the content infrastructure the wizard relies on:
  `UIState isLoading`, `WindowValidationProvider onCheckIsValid={isValid}`,
  `FormObserver`, `ValidateSection`, plus the chrome (Titlebar with
  close/maximize buttons, absolute positioning, drag, resize, maximize, the
  "preparing" transition via `useResizeObserver`).
- **`WindowAction`** (exposed to definitions as `Action`/`OkButton`) is the one
  piece that does **not** use the context `close` — it calls
  `WindowsManager.get(managerId).close(id, value)` directly. In dialog mode the
  context `close` is exactly `manager.close(windowId, response)`
  (`WindowRenderer.tsx:31`), so redirecting `WindowAction` to the context `close`
  is behaviour-preserving and is required for inline mode.

## Design

### 1. Render-mode context

Add to `src/components/Wizard/WizardContexts.ts`:

```ts
export interface WizardRenderModeContextProps { mode: 'dialog' | 'inline'; }
export const WizardRenderModeContext =
  createContext<WizardRenderModeContextProps>({ mode: 'dialog' });
```

Default `'dialog'` keeps every existing usage unchanged.

### 2. Inline renderer component

A component built per-wizard from the same `wizardDefinition`, attached to the
wizard at `createWizard` time (e.g. `component.Inline`). It:

- Generates a stable `id` (via `useId`).
- Provides a `WindowRenderContext` value:
  - `id`
  - `managerId`: a sentinel (e.g. the generated id); never dereferenced because
    `WindowAction` will use the context `close` (see §5).
  - `close(response)`: `async` wrapper that calls the `onClose` prop.
  - `setTitle` / `title`: local state so `useWindow().setTitle` keeps working.
- Provides `WizardRenderModeContext` with `mode: 'inline'`.
- Renders the **shared** `WizardContentComponent` with `args` (defaulting to `[]`)
  and the wizard definition.

Reusing `WizardContentComponent` guarantees `Wizard`, `Step`, `Actions`,
`Action`, `OkButton`, validators and next/back behave identically to dialog mode.

Props (`InlineWizardProps<Args, CloseResponseType>`):

```ts
interface InlineWizardProps<Args extends unknown[], CloseResponseType> {
  args?: Args;
  onClose?(response?: CloseResponseType): void;
  className?: string;
}
```

`args` is typed as the wizard's positional tuple and defaults to `[]`. (A future
refinement could make `args` required when the tuple is non-empty; out of scope.)

### 3. `<Wizard>` branches on mode

`<Wizard>` reads `WizardRenderModeContext`:

- `'dialog'` → renders `<Window>` exactly as today (no change to behaviour).
- `'inline'` → renders `<WizardInlineShell>`.

The wizard-context providers and layout (step indicator, steps, other children)
are unchanged and become the `children` of whichever shell is used. Window-only
props (`hideCloseButton`, `disableDrag`, `disableResize`, `allowMaximizeButton`,
`initialPosition`, `onClosing`, `onClosed`, `onFocus`) are ignored by the inline
shell.

### 4. `WizardInlineShell`

New component (`src/components/Wizard/Wizard/WizardInlineShell.tsx`) reproducing
only the **content** infrastructure of `Window` — no chrome:

- `UIState isLoading`
- `useValidation()` → `WindowValidationProvider onCheckIsValid={isValid}` +
  `ValidateSection id={\`wizard-inline-validation-${id}\`}`
- `FormObserver` (via `useFormObserver`)
- Optional header: `<Titlebar icon title />` with **no** end adornment buttons and
  **no** drag props, rendered only when `title` or `icon` is provided.
- Root container: flex column. Honors `width` / `height` / `minWidth` /
  `minHeight` as plain CSS when provided; otherwise fills its parent (`flex: auto`).
- No portal, no absolute positioning, no `useResizeObserver`, no "preparing"
  transition, no drag/resize/maximize.

### 5. `WindowAction` change (only Windows-file edit)

```ts
const { id, managerId, close } = useContext(WindowRenderContext);
const manager = WindowsManager.get(managerId);
const doClose = close ?? ((resp?: unknown) => manager.close(id, resp));
// handleClick: if (value != null) await doClose(value);
```

Uses the context `close` when present (always, in both modes) and keeps the
manager fallback for safety. Behaviour-preserving in dialog mode.

### 6. `useWizard` becomes a wrapper

`useWizard` stops being a bare re-export of `useWindow`. It calls `useWindow` for
the existing methods and augments the return with the inline component under the
`Inline${Name}` key:

```ts
return { ...windowApi, [`Inline${wizard.name}`]: wizard.Inline };
```

Return type augments `UseWindowApiCommands` with a template-literal key:

```ts
type UseWizardApiCommands<Name, Args, CloseResponseType> =
  UseWindowApiCommands<Name, Args, CloseResponseType>
  & { [K in `Inline${Name}`]: ComponentType<InlineWizardProps<Args, CloseResponseType>> };
```

(Equivalent `WithId` overload mirrors the existing `useWindow` overloads.)

## Completion flow

- Final-step Save in `WizardActions`: `isLast ? (onSave ? onSave() : close('ok')) : moveNext()`.
- `close` resolves from `WindowRenderContext`; inline maps it to `onClose('ok')`.
- `Action value="x"` / `OkButton` → `WindowAction` → context `close('x')` →
  `onClose('x')` inline.

## Testing

- New Storybook story file demonstrating an inline wizard rendered directly on the
  page (no `<Windows />` host), exercising next/back, validation gating, and
  `onClose` firing on final Save.
- Because inline mode skips the Window's `useResizeObserver` / "preparing"
  machinery, it sidesteps the known ResizeObserver gap in preview/jsdom that makes
  dialog-mode wizards hard to test. Inline-mode play tests and assertions should
  run in jsdom and render in preview.
- Verify dialog mode is byte-for-byte unchanged (existing stories/tests still pass,
  including the `WindowAction` redirect).

## Files

**New**
- `src/components/Wizard/Wizard/WizardInlineShell.tsx`
- inline renderer (either `src/components/Wizard/createInlineWizard.tsx` or inline
  within `createWizard.tsx`)
- inline Storybook story + tests

**Edited**
- `src/components/Wizard/WizardContexts.ts` — add `WizardRenderModeContext`
- `src/components/Wizard/Wizard/Wizard.tsx` — branch on render mode
- `src/components/Wizard/createWizard.tsx` — build/attach inline component
- `src/components/Wizard/useWizard.tsx` — wrapper returning `Inline${Name}`
- `src/components/Wizard/WizardModels.ts` — `InlineWizardProps`, hook return types
- `src/components/Windows/Window/WindowAction.tsx` — use context `close`

## Out of scope (YAGNI)

- A separate fully-headless hook (state/nav only, no rendering).
- Per-mode prop divergence beyond what is described.
- Migrating existing dialog usages.
- Inline support for window-lifecycle callbacks, drag, resize, maximize.
