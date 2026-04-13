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

---

[← Back to Components](../README.md)
