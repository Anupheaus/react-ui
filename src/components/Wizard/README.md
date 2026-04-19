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

## Progress Indicator

When `showProgress` is set on the `Wizard`, a panel is rendered to the left of the step content (and behind the action bar, full-height). Each step is represented by a circle:

| State | Appearance |
|-------|-----------|
| Current | Filled blue circle |
| Completed | Filled pastel-green circle |
| Future | Grey outline circle |

Completed-step circles are clickable — clicking one navigates directly back to that step (steps after it revert to future). Future steps are not clickable.

Assign a `label` prop to each `Step` (or `createWizardStep` instance) to show a text label alongside the circle.

```tsx
const MyWizard = createWizard('MyWizard', ({ Wizard, Step, Actions }) => () => (
  <Wizard title="Setup" width={620} height={420} showProgress>
    <Step id="account" label="Account details"><p>...</p></Step>
    <Step id="prefs" label="Preferences"><p>...</p></Step>
    <Step id="review" label="Review"><p>...</p></Step>
    <Actions />
  </Wizard>
));
```

## Actions Props

`Actions` accepts all [`ActionsToolbar`](../ActionsToolbar/README.md) props except `isSaveReadOnly` (controlled by the wizard). `onSave` and `saveLabel` apply only on the **last step** — on earlier steps the wizard always uses Next internally. Use the remaining props to add a Delete button, confirmation dialogs, loading state, etc.

## Actions behaviour

The `Actions` toolbar uses a single primary button that doubles as Next or Save depending on step position. Clicking it runs form validation before advancing or closing.

| Step position | Buttons rendered |
|---------------|-----------------|
| Single step | Save |
| First of many | Next |
| Middle | Back → Next |
| Last | Back → Save |

## Wizard Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Window title |
| `step` | `string` | Uncontrolled: default active step id. Controlled: active step id (requires `onStepChange`). |
| `onStepChange` | `(id: string) => void` | When provided with `step`, enables externally controlled navigation. |
| `showProgress` | `boolean` | Shows a step-progress panel on the left listing all steps with coloured circles and connecting lines. |
| `allowMaximizeButton` | `boolean` | Show the maximise button (hidden by default). |
| `children` | `ReactNode` | `Step`/`createWizardStep` children plus `Actions`. |
| All standard `Window` props | — | `className`, `icon`, `hideCloseButton`, `disableDrag`, `disableResize`, `width`, `height`, etc. |

## createWizardStep definition utils

The function passed to `createWizardStep` receives:

| Util | Description |
|------|-------------|
| `id` | Step instance id |
| `moveNext()` | Advance to next step |
| `moveBack()` | Return to previous step |
| `setNextIsEnabled(bool)` | Enable/disable Next button |
| `setBackIsEnabled(bool)` | Enable/disable Back button |

## createWizard definition utils

| Util | Description |
|------|-------------|
| `Wizard` | The window-like container component |
| `Step` | Inline step — takes `id?`, `label?`, and `children`. `label` is shown in the progress panel when `showProgress` is set. |
| `Actions` | Auto Back/Next/Save toolbar — accepts `children` to prepend custom buttons |
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
