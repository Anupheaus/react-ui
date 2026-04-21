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

## Decision rationale

**Three hooks with separate responsibilities**

`useForm`, `useFormActions`, and `useFormObserver` are separated by audience, not by implementation convenience.

- `useForm` is the owner — it allocates the internal state, creates the `Form` context provider, and produces the bound `Field`/`useField` pair. It is called by the component that holds the data.
- `useFormActions` is a consumer — it reads `FormContext` and exposes `save`/`cancel` to arbitrary descendants. Keeping it separate means action buttons (e.g. `SaveButton`) have no knowledge of the data model; they only know how to trigger lifecycle events.
- `useFormObserver` is an aggregator — it operates one level above both and collects dirty signals from multiple `useForm` instances. It has its own context (`FormObserverContext`) so dirty state propagates upward without coupling the individual forms to each other.

If all three were combined, every save-button descendant would have to import the whole form state, and you could not track dirty state across sibling forms without lifting everything to a common ancestor.

**Dirty tracking at the form level, not per-field**

Dirty state is computed by a single `is.deepEqual` comparison between the current data snapshot and the original data snapshot inside `useForm`. Individual `Field` components do not track their own dirty status. This keeps the dirty signal authoritative: it reflects the full data object rather than the union of per-field boolean flags, which can go out of sync when a field is removed from the DOM or when data is changed programmatically via `onChange`.

The downside is that the dirty check fires on every field change regardless of which field changed. This is acceptable for the current use-cases; if performance becomes an issue, memoisation should be added in `useForm`, not pushed into `Field`.

**`FormContext` does not expose data**

`FormContext` carries only `isReal`, `save`, and `cancel`. Field binding is not done through context — it is done through the `Field` and `useField` closures created inside `useForm` and returned to the caller. This prevents any descendant from reading or mutating form data directly through context, which would make the data flow invisible to the component that owns the form.

## Ambiguities and gotchas

**What triggers a "dirty" state**

The form becomes dirty the first time `wrapSetData` is called with a value that is not deep-equal to the current `data` snapshot. This happens whenever any bound `Field` changes. Calling `onChange` externally does not reset dirty state — only `save()` or `cancel()` do.

**`cancel()` resets to `providedData`, not to the snapshot at last save**

`cancel` resets the internal state to `providedData` — the prop value that was passed to `useForm` at the time of the last render. If the parent component re-rendered with new `data` between the user's last edit and the cancel, those new external values become the "original". This is usually correct for controlled forms but can be surprising if the parent is updating its own state independently.

**Validation**

There is no built-in validation API in the current `useForm`. `useFormValidation.ts` is entirely commented out. Do not try to use it. Validation must be done externally in the `onSave` callback or by the fields themselves.

**When save/cancel are no-ops**

- `save()` does nothing if the form is not dirty (`isDirtyRef.current === false`) or if `data` is `null`/`undefined`.
- `cancel()` does nothing if the form is not dirty.
- Neither function throws in those cases — they return silently.

**`getIsDirty` is not available on `FormContext`**

Although `getIsDirty` is defined inside `useForm` and passed to `FormObserverContext`, it is NOT exposed on `FormContext`. Components consuming `useFormActions` cannot read dirty state — they can only trigger `save`/`cancel`. To observe dirty state from outside the form hierarchy, use `useFormObserver`.

**`Form` component is created with `useMemo`**

`useForm` creates the `Form` component inside a `useMemo` with an empty dependency array. This means the component identity is stable across re-renders — which is required to avoid remounting the context subtree on every parent render — but it also means the `Form` component must not close over values that change (they are deliberately captured via refs or bound callbacks).

## Related

- [../Field/AGENTS.md](../Field/AGENTS.md) — `useForm` delegates all field binding to `useFields` from the Field module; every `Field` rendered inside a `Form` is created by that system
- [../Notifications/AGENTS.md](../Notifications/AGENTS.md) — `useForm` calls `showSuccess` from `useNotifications` to display save/cancel confirmation toasts; suppressed by `hideNotifications`

---

[← Back to Components](../AGENTS.md)
