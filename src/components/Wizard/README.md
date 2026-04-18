# Wizard Component

## Overview

The Wizard component renders a multi-step workflow inside a draggable, resizable window. Steps are registered via context (mirroring the Tabs system) and rendered stacked in a CSS grid with slide transitions. Navigation (Back/Next/Save) is managed automatically by `Actions`.

## Usage

### 1. Define the wizard with createWizard

**Inline steps** (small wizards):

```tsx
const MyWizard = createWizard('MyWizard', ({ Wizard, Step, Actions, close }) => () => (
  <Wizard title="My Wizard" width={500}>
    <Step id="intro"><p>Welcome</p></Step>
    <Step id="details"><p>Fill in details</p></Step>
    <Step id="confirm"><p>Confirm</p></Step>
    <Actions />
  </Wizard>
));
```

**External step components** (large wizards):

```tsx
const DetailsStep = createWizardStep('DetailsStep', ({ id, setNextIsEnabled }) => (
  <div>Details — id is {id}</div>
));

const MyWizard = createWizard('MyWizard', ({ Wizard, Actions }) => () => (
  <Wizard title="My Wizard" width={600}>
    <DetailsStep />
    <DetailsStep id="custom-id" />
    <Actions />
  </Wizard>
));
```

### 2. Open the wizard with useWizard

```tsx
const { openMyWizard } = useWizard(MyWizard, 'my-wizard-id');
await openMyWizard();
```

### 3. Access navigation inside steps with useWizardStep

```tsx
function NestedComponent() {
  const { moveNext, moveBack, setNextIsEnabled, setBackIsEnabled } = useWizardStep();
  return <Button onClick={() => setNextIsEnabled(false)}>Disable Next</Button>;
}
```

## Actions behaviour

| Step position | Buttons rendered |
|---------------|-----------------|
| Single step | Save |
| First of many | Next → Save |
| Middle | Back → Next → Save |
| Last | Back → Save |

## Wizard Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Window title |
| `step` | `string` | Uncontrolled: default active step id. Controlled: active step id (requires `onStepChange`). |
| `onStepChange` | `(id: string) => void` | When provided with `step`, enables externally controlled navigation. |
| `children` | `ReactNode` | `Step`/`createWizardStep` children plus `Actions`. |
| All standard `Window` props | — | `className`, `icon`, `hideCloseButton`, `disableDrag`, `disableResize`, `width`, `height`, etc. |

## createWizard definition utils

| Util | Description |
|------|-------------|
| `Wizard` | The window-like container component |
| `Step` | Inline step — takes `id?` and `children` |
| `Actions` | Auto Back/Next/Save toolbar |
| `Action` | Custom action button (closes window with a value) |
| `OkButton` | Save/OK button |
| `id` | Wizard instance id |
| `close(response?)` | Close the wizard |
| `moveNext()` | Advance to next step |
| `moveBack()` | Return to previous step |
| `setNextIsEnabled(bool)` | Enable/disable Next button |
| `setBackIsEnabled(bool)` | Enable/disable Back button |

---

[← Back to Components](../README.md)
