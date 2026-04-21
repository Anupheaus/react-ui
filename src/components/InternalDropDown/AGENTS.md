# InternalDropDown

> **Internal component** — not intended for direct consumer use. `DropDown` is the public-facing wrapper. This component is documented here because it defines the shared API consumed by `DropDown` and any other components that need dropdown behaviour.

`InternalDropDown` renders a `Field` container with a chevron button that opens a MUI `Popover` containing an `InternalList`. It handles open/close state, width tracking, optional-item injection, validation, and read-only rendering.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tagName` | `string` | Yes | DOM tag name used for the root element — required by `createComponent` infrastructure |
| `value` | `string` | No | The `id` of the currently selected item |
| `values` | `ReactListItem[]` | No | Items to show in the dropdown list |
| `isOptional` | `boolean` | No | Prepends an "N/A" entry when `true`, allowing the value to be cleared |
| `optionalItemLabel` | `ReactNode` | No | Custom label for the optional entry. Defaults to `'N/A'` |
| `requiredMessage` | `string` | No | Validation error shown when nothing is selected and `isOptional` is `false`. Defaults to `'Please select a value'` |
| `readOnlyValue` | `ReactNode` | No | Content shown instead of the selected item when in read-only mode |
| `endAdornments` | `ReactNode` | No | Additional adornments appended after the built-in chevron |
| `renderSelectedValue` | `(value: ReactListItem \| undefined) => ReactNode` | No | Custom renderer for the currently selected item inside the field |
| `onFilterValues` | `(values: ReactListItem[]) => PromiseMaybe<ReactListItem[]>` | No | Async transform applied to `values` before rendering. Defaults to identity |
| `label` | `ReactNode` | No | Field label |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message (overrides internal validation error) |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit width |
| `onChange` | `(id: string \| undefined) => void` | No | Called with the selected `id`, or `undefined` when the optional entry is chosen |
| `onBlur` | `(event: FocusEvent<HTMLDivElement>) => void` | No | Called when the component loses focus |

## Architecture

- The popover width is kept in sync with the field width via `useOnResize`.
- When `isOptional` is `true`, `addOptionalItemTo` prepends a sentinel item (`optionalItemKey`) to the list; `onChange` translates that sentinel back to `undefined`.
- Validation errors are suppressed until the user interacts with the field (blur or close).
- `onFilterValues` is called asynchronously via `useAsync`; while it is running the component enters a loading state.

## Decision rationale

`InternalDropDown` exists as a separate internal component so that `DropDown` and `Chips` can share identical open/close mechanics, popover sizing, optional-item injection, validation deferral, and loading state without duplicating code. Each public component just provides a different `tagName` and, in `Chips`'s case, overrides `value`/`onChange` semantics while delegating everything else.

The `tagName` prop is passed through to `createComponent` and also used as the validation ID prefix (`${tagName}-${label}`). If two `InternalDropDown` instances on the same page share the same `tagName` and `label`, their validation state will collide — they share a single `useValidation` entry.

Note: `Autocomplete` does **not** use `InternalDropDown`. It is built on `InternalText` with its own `Popover` and `Menu`, so changes to `InternalDropDown` do not affect `Autocomplete`.

## Ambiguities and gotchas

- **`optionalItemKey` sentinel** — when `isOptional` is `true`, a fake item with a known sentinel ID is prepended by `addOptionalItemTo`. `onChange` translates that sentinel back to `undefined`. If you add code that iterates `values` after this step, you will encounter the sentinel item as a real entry; strip it by checking `id !== optionalItemKey` where needed.
- **`value` resolved against the post-optional list** — `value` is resolved via `values.findById(providedValue ?? optionalItemKey)`. If `providedValue` is `undefined`, it resolves to the optional sentinel item, not `undefined`. Code reading the resolved `value` local will see the sentinel object, not `null`.
- **Validation errors are deferred** — errors are suppressed until `onBlur` fires or the popover closes (`handleClosed` calls `enableErrors`). A required field with no selection will not show an error until the user interacts and leaves. Do not rely on the error being present immediately on mount.
- **`onFilterValues` is async** — it runs inside `useAsync` every time `providedValues` or `onFilterValues` changes. While it is running, `isLoadingValues` is `true` and the component wraps in `<UIState isLoading>`. Replacing `onFilterValues` with a new function reference on every render will cause a continuous loading loop.
- **Popover width is tracked, not inherited** — the popover is sized to match the field using `useOnResize`. The minimum width is applied via an inline style on the `slotProps.paper` object. This is one of the few intentional inline styles in the codebase — do not remove it in favour of a CSS class, as the width value is dynamic.
- **`renderSelectedValue` is on the inner `Props` type, not the exported `InternalDropDownProps`** — consumers (`DropDown`, `Chips`) cannot pass `renderSelectedValue` unless they expose it explicitly.

## Related

- [../DropDown/AGENTS.md](../DropDown/AGENTS.md) — thin public wrapper; passes `tagName="dropdown"` and forwards all props
- [../Chips/AGENTS.md](../Chips/AGENTS.md) — multi-select consumer; overrides `value`/`onChange` to manage an array of IDs, renders chips as a fake `ReactListItem` label
- [../Autocomplete/AGENTS.md](../Autocomplete/AGENTS.md) — sibling searchable-input component; does NOT use `InternalDropDown` despite similar visual appearance
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem` is the item type for `values`; `ListItemEvent` is used in the click handler

---

[← Back to Components](../AGENTS.md)
