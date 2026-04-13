# Form

A form management system built around the `useForm` hook. It provides a data-bound `Form` container component, a `Field` renderer, a `useField` hook for individual field binding, and save/cancel lifecycle management with optional notifications.

## `useForm`

The primary entry point. Call it with your data object and callbacks; it returns everything needed to render and manage the form.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | `T` | No | The current data object to bind fields to |
| `hideNotifications` | `boolean` | No | Suppress the default success toast on save/cancel (default: `false`) |
| `onChange` | `(data: T) => PromiseMaybe<void>` | No | Called whenever a field value changes. If provided, you manage state externally; otherwise internal state is used |
| `onSave` | `(data: T) => PromiseMaybe<void>` | No | Called when `save()` is invoked and the form is dirty |

### Return value

| Property | Type | Description |
|----------|------|-------------|
| `Form` | `Component` | Wrapper component that provides form context to its children |
| `Field` | `Component` | Renders any field component bound to a property on the data object — see `useFields` |
| `useField` | `hook` | Binds a single named property to a component — see `useFields` |

## `useFormActions`

A hook for components rendered inside a `<Form>` that need to trigger form-level actions.

```tsx
const { isInForm, save, cancel } = useFormActions();
```

### Return value

| Property | Type | Description |
|----------|------|-------------|
| `isInForm` | `boolean` | `true` when the hook is called inside a `<Form>` context |
| `save` | `() => PromiseMaybe<void>` | Saves the form if dirty; shows a success notification unless `hideNotifications` is set |
| `cancel` | `() => PromiseMaybe<void>` | Discards changes and resets to original data; shows a notification unless `hideNotifications` is set |

## `useFormObserver`

A hook for observing the dirty state of one or more `useForm` instances rendered beneath a `<FormObserver>` wrapper.

```tsx
const { FormObserver, getIsDirty } = useFormObserver();
```

### Return value

| Property | Type | Description |
|----------|------|-------------|
| `FormObserver` | `Component` | Wrap around one or more `<Form>` subtrees to track their dirty state |
| `getIsDirty` | `() => boolean` | Returns `true` if any child `Form` is currently dirty |

## Usage

### Basic controlled form

```tsx
import { useForm } from '@anupheaus/react-ui';

interface Person {
  name: string;
  age: number;
}

function PersonForm({ person, onSave }: { person: Person; onSave(p: Person): void }) {
  const { Form, Field } = useForm<Person>({
    data: person,
    onSave,
  });

  return (
    <Form>
      <Field component={Text} field="name" label="Name" />
      <Field component={Number} field="age" label="Age" />
      <SaveButton />
    </Form>
  );
}
```

### Accessing save/cancel from a child component

```tsx
import { useFormActions } from '@anupheaus/react-ui';

function SaveButton() {
  const { save, cancel, isInForm } = useFormActions();
  if (!isInForm) return null;
  return (
    <>
      <Button onClick={save}>Save</Button>
      <Button onClick={cancel}>Cancel</Button>
    </>
  );
}
```

### Observing dirty state across multiple forms

```tsx
import { useFormObserver } from '@anupheaus/react-ui';

function Page() {
  const { FormObserver, getIsDirty } = useFormObserver();

  return (
    <FormObserver>
      <PersonForm />
      <AddressForm />
      <Button onClick={() => console.log('dirty?', getIsDirty())}>Check</Button>
    </FormObserver>
  );
}
```

## Architecture

| File | Purpose |
|------|---------|
| `useForm.tsx` | Core hook — creates `Form`, `Field`, and `useField`; manages dirty tracking, save, and cancel |
| `useFormActions.ts` | Consumer hook — reads `FormContext` to expose `save`, `cancel`, `isInForm` |
| `FormContext.ts` | React context carrying `isReal`, `save`, and `cancel` |
| `Observer/useFormObserver.tsx` | Multi-form dirty tracking via a separate `FormObserverContext` |
| `Observer/FormObserverContext.ts` | Context for aggregating dirty state from multiple forms |

---

[← Back to Components](../README.md)
