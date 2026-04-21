# Wizard Component Design

**Date:** 2026-04-18  
**Status:** Approved

## Overview

A `Wizard` component built on the existing Windows infrastructure. Wizards are draggable, resizable windows with multi-step navigation. The API mirrors `createWindow`/`createDialog` in structure.

---

## Public API

### `createWizard`

```tsx
const MyWizard = createWizard('MyWizard', ({ Wizard, Step, Actions, Action, OkButton, id, close, moveNext, moveBack, setNextIsEnabled, setBackIsEnabled }) =>
  (title: string) => (
    <Wizard title={title}>
      <Step id="details">
        <div>Step one content</div>
      </Step>
      <Step id="confirm">
        <div>Step two content</div>
      </Step>
      <Actions />
    </Wizard>
  )
);
```

Definition utils provided to the factory function:

| Util | Type | Description |
|------|------|-------------|
| `Wizard` | Component | The window-like container. Accepts all standard `Window` props plus `step`, `onStepChange`. |
| `Step` | Component | Inline step — takes `id?` and `children`. Uses the same registration internals as `createWizardStep`. |
| `Actions` | Component | Wizard-aware actions toolbar. Auto-inserts Back/Next/Save. Accepts additional custom action children rendered before the wizard buttons. |
| `Action` | Component | Same as `WindowAction`. |
| `OkButton` | Component | Same as `WindowOkAction`. |
| `id` | `string` | The wizard instance id. |
| `close` | `(response?) => Promise<void>` | Closes the wizard. |
| `moveNext` | `() => void` | Advances to the next step. No-op on last step. |
| `moveBack` | `() => void` | Returns to the previous step. No-op on first step. |
| `setNextIsEnabled` | `(enabled: boolean) => void` | Enables/disables the Next button. |
| `setBackIsEnabled` | `(enabled: boolean) => void` | Enables/disables the Back button. |

### `Wizard` component props

| Prop | Type | Description |
|------|------|-------------|
| `step` | `string` | Uncontrolled: used as default active step id. Controlled: active step id (requires `onStepChange`). |
| `onStepChange` | `(id: string) => void` | When provided alongside `step`, enables externally controlled mode. |
| `title` | `ReactNode` | Window title. |
| All standard `Window` props | — | `className`, `icon`, `hideCloseButton`, `disableDrag`, `disableResize`, `width`, `height`, `minWidth`, `minHeight`, `isLoading`, `onClosing`, `onClosed`, etc. |

### `createWizardStep`

For reusable step components shared across wizards or too large to inline:

```tsx
const StepOne = createWizardStep('StepOne', ({ id, moveNext, moveBack, setNextIsEnabled, setBackIsEnabled }) => (
  <div>Step one content</div>
));

// Used as a child of Wizard — accepts an optional id prop override:
<StepOne id="custom-id" />
```

Definition utils provided:

| Util | Type | Description |
|------|------|-------------|
| `id` | `string` | The step's id (from `WizardStepIdContext` or `id` prop). |
| `moveNext` | `() => void` | Advances to the next step. |
| `moveBack` | `() => void` | Returns to the previous step. |
| `setNextIsEnabled` | `(enabled: boolean) => void` | Enables/disables Next. |
| `setBackIsEnabled` | `(enabled: boolean) => void` | Enables/disables Back. |

### `useWizard`

Parallel to `useWindow`. Same overloads (with id at hook level, without id, or no-arg for current window utils):

```tsx
const { openMyWizard, closeMyWizard } = useWizard(MyWizard, 'my-wizard-id');
await openMyWizard('Create Account');
```

### `useWizardStep`

For use inside any component nested within a step (equivalent to `useWindow()` no-arg form):

```tsx
function NestedComponent() {
  const { moveNext, moveBack, setNextIsEnabled, setBackIsEnabled } = useWizardStep();
}
```

Reads from `WizardContext`. Throws if called outside a wizard step.

---

## Actions Behaviour

When `<Actions />` is rendered inside a `Wizard`, it auto-inserts navigation buttons based on the active step's position:

| Position | Buttons rendered (left to right) |
|----------|----------------------------------|
| First step only | `[custom]` → **Next** → **Save** |
| Middle step | `[custom]` → **Back** → **Next** → **Save** |
| Last step only | `[custom]` → **Back** → **Save** |
| Only one step | `[custom]` → **Save** |

- **Back** is disabled when `setBackIsEnabled(false)` has been called.
- **Next** is disabled when `setNextIsEnabled(false)` has been called.
- **Save** always triggers the `OkButton` behaviour (validation + close).

---

## Internal Architecture

### Contexts

**`WizardStepIdContext`**  
Provided by `Wizard` wrapping each child individually via `React.Children.map`. Supplies a stable generated id unless the child element has an explicit `id` prop, in which case that takes precedence. Stability is maintained via a `Map<element, id>` ref so ids do not change across re-renders.

**`WizardRegistrationContext`**  
`{ isValid: boolean; upsertStep(props: StepRecord): void; removeStep(id: string): void }`  
Step components register themselves here via `useLayoutEffect` and return `null`. `isValid` is `false` outside a `Wizard` — registration throws a descriptive error.

**`WizardContext`**  
`{ state: DistributedState<string>; steps: StepRecord[]; isNextEnabled: boolean; isBackEnabled: boolean; moveNext(): void; moveBack(): void; setNextIsEnabled(v: boolean): void; setBackIsEnabled(v: boolean): void }`  
Consumed by `WizardStepContent`, `WizardActions`, and `useWizardStep`.

### Render structure

```
<Window>                                  ← standard draggable/resizable Window
  <WizardContext.Provider>
    <hidden>                              ← invisible, children render here for registration
      <WizardRegistrationContext.Provider>
        <WizardStepIdContext id="step-1">
          <StepOne />                     ← registers via upsertStep, returns null
        </WizardStepIdContext>
        <WizardStepIdContext id="step-2">
          <StepTwo />
        </WizardStepIdContext>
      </WizardRegistrationContext.Provider>
    </hidden>
    <wizard-steps css-grid>              ← display:grid, gridTemplateColumns/Rows: 1fr
      <WizardStepContent id="step-1" />  ← opacity + pointerEvents via CSS class
      <WizardStepContent id="step-2" />
    </wizard-steps>
    <WizardActions />
  </WizardContext.Provider>
</Window>
```

`WizardStepContent` mirrors `TabContent`: reads `DistributedState<string>` to set `isFocused`, applies `.is-visible` CSS class, uses slide-left/slide-right transitions on inactive steps.

### `Step` and `createWizardStep` relationship

`WizardStep` is the internal component that handles id resolution (`WizardStepIdContext` → `id` prop → generated) and registration. `Step` (from definition utils) is a thin wrapper around `WizardStep`. `createWizardStep` also wraps `WizardStep`, additionally injecting the definition utils (`moveNext`, `moveBack`, etc.) from `WizardContext` before rendering the user's definition function.

### Controlled vs uncontrolled

- **Uncontrolled:** `step` prop passed as initial value to `useDistributedState`. `Wizard` owns state from there.
- **Controlled:** `Wizard` calls `onStepChange` on every step change. A `useLayoutEffect` watching `step` prop syncs external changes back into the distributed state.

### `setNextIsEnabled` / `setBackIsEnabled` during render

Step definition functions (in `createWizardStep`) are render functions, not hook bodies, so they cannot call hooks directly. Instead, `WizardStep` accepts `isNextEnabled?: boolean` and `isBackEnabled?: boolean` as props. When a `createWizardStep` definition needs to control navigation state, it passes these as props to `WizardStep`. `WizardStep` then applies them to `WizardContext` state via `useLayoutEffect`, avoiding "update during render" warnings.

`StepRecord` type: `{ id: string; children: ReactNode }`.

---

## File Structure

```
src/components/Wizard/
  WizardModels.ts
  WizardContexts.ts
  createWizard.tsx
  createWizardStep.tsx
  useWizard.tsx
  useWizardStep.tsx
  Wizard/
    Wizard.tsx              ← Window wrapper; owns all context, state, registration
    WizardStep.tsx          ← base registration component; used by Step util and createWizardStep
    WizardStepContent.tsx   ← renders step content in stacked grid (mirrors TabContent)
    WizardActions.tsx       ← reads step list + active id; renders Back/Next/Save
  index.ts
  AGENTS.md
```

---

## Edge Cases

| Case | Behaviour |
|------|-----------|
| `createWizardStep` outside `Wizard` | Throws: `"WizardStep must be a child of Wizard"` |
| Zero or one step registered | `isFirst` and `isLast` both true; only Save rendered in Actions |
| `moveNext` on last step | No-op |
| `moveBack` on first step | No-op |
| Active step removed dynamically | Falls back to first registered step |
| `step` prop changed in controlled mode | `useLayoutEffect` syncs new value into distributed state |

---

## Stories & Tests

**`Wizard.stories.tsx`**
- Uncontrolled (no `step` prop)
- Controlled (`step` + `onStepChange`)
- Inline `Step` utils
- External `createWizardStep` components
- Disabled Next/Back via `setNextIsEnabled`/`setBackIsEnabled`
- Dynamically injected step

**`Wizard.tests.tsx`**
- Step registration and removal
- Navigation (`moveNext`, `moveBack`, boundary no-ops)
- Controlled mode sync
- `Actions` renders correct buttons per step position
- `useWizardStep` throws outside wizard
