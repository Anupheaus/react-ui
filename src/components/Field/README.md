# Field

A layout primitive that wraps any input with a label, error message, assistive help text, and optional start/end adornments. All input components in this library (`Text`, `Password`, `Number`, etc.) render through `Field` internally.

`useFields` is a companion hook (also exported from this folder) that binds a typed data object to field components, and is what `useForm` uses to create its `Field` renderer.

## `Field` component

Used directly only when building custom input components. Consumer code typically interacts with `Field` indirectly through higher-level inputs.

### Props (public surface — `FieldProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `ReactNode` | No | Label rendered above the field container |
| `width` | `string \| number` | No | Fixed width for the field; overrides flex growth |
| `isOptional` | `boolean` | No | Marks the field as optional and shows an "(optional)" label hint |
| `hideOptionalLabel` | `boolean` | No | Suppresses the "(optional)" hint even when `isOptional` is true |
| `requiredMessage` | `ReactNode` | No | Custom message shown when a required field is empty |
| `help` | `ReactNode` | No | Help text shown inline next to the label |
| `assistiveHelp` | `ReactNode` | No | Secondary help text rendered beneath the field container |
| `error` | `ReactNode` | No | Error message shown beneath the field container (replaces `assistiveHelp` when set) |
| `wide` | `boolean` | No | Sets width to `100%` |
| `ref` | `Ref<HTMLInputElement>` | No | Forwarded ref to the inner input element |
| `className` | `string` | No | Additional class on the outer field element |

### Internal-only props (used by component implementors)

| Prop | Type | Description |
|------|------|-------------|
| `tagName` | `string` | Required — used to generate semantic element names |
| `startAdornments` / `endAdornments` | `ReactNode` | Toolbar buttons rendered inside the field container |
| `useFloatingStartAdornments` / `useFloatingEndAdornments` | `boolean` | Adornments slide in on focus rather than always visible |
| `noContainer` | `boolean` | Skips the bordered container (used by `PIN`) |
| `fullHeight` | `boolean` | Field grows to fill available vertical space |
| `height` | `string \| number` | Fixed height for the container |
| `disableSkeleton` | `boolean` | Opt out of skeleton loading state |
| `disableRipple` | `boolean` | Disable ripple effect on container click |

## `useFields` hook

Binds a typed source object to field components, with deep change propagation.

```tsx
const { Field, useField } = useFields(source, onChange, dependencies?);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `source` | `T \| (() => T) \| undefined` | The data object (or factory) to bind against |
| `onChange` | `(updated: T) => void` | Called with the updated object whenever a field changes |
| `dependencies` | `unknown[]` | Optional extra deps for the observable (default: `[]`) |

### Return value

| Property | Type | Description |
|----------|------|-------------|
| `Field` | `Component` | Renders any component with `value`/`onChange`, wiring it to a named field on the source |
| `useField` | `hook` | Returns the current value and a setter for a named field |

### `<Field>` component props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `component` | `FieldComponent<P>` | Yes | The input component to render (e.g. `Text`, `Number`) |
| `field` | `keyof T` | Yes | The property name on the source object to bind |
| `defaultValue` | `value \| () => value` | No | Value used when the field is `undefined` |
| ...rest | `ComponentProps` | — | All other props are forwarded to `component` |

### `useField` overloads

```tsx
// Simple field binding by property name
const { name, setName } = useField('name');

// Custom get/set with a default value
const { displayName, setDisplayName } = useField(
  'displayName',
  src => src.firstName + ' ' + src.lastName,
  value => ({ firstName: value.split(' ')[0], lastName: value.split(' ')[1] }),
  () => 'Unknown'
);
```

## Usage

### With `useFields` directly

```tsx
import { useFields } from '@anupheaus/react-ui';
import { useState } from 'react';

function MyForm() {
  const [record, setRecord] = useState({ name: '' });
  const { Field } = useFields(record, setRecord);

  return <Field component={Text} field="name" label="Name" wide />;
}
```

### Via `useForm` (recommended)

`useForm` calls `useFields` internally and exposes its `Field` and `useField` return values directly — see the [Form README](../Form/README.md).

---

[← Back to Components](../README.md)
