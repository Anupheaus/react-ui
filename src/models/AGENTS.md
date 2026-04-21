# models

Core item type used by every list, table, and grid component in the library.

## Overview

`ReactListItem<DataType>` is the universal row/item type. Every component that renders a collection of items — `List`, `Table`, `Configurator`, `InternalList`, `DropDown`, `Autocomplete`, `Selector`, `Chips`, `Menu`, `SimpleList` — accepts or produces `ReactListItem`. Understanding this type is essential when working with any data-display component.

## Contents

### Core type

- `ReactListItem<DataType, SubItemType>` — extends `ListItem` from `@anupheaus/common` (`{ id, text, ordinal? }`). Key fields:
  - `label?: ReactNode` — rendered label; if absent, `text` is used
  - `iconName?: IconName` — icon shown alongside the label
  - `tooltip?: ReactNode` — tooltip on hover
  - `isSelected?: boolean` — controlled selection state
  - `isSelectable?: boolean` — whether selection is permitted for this item
  - `isExpanded?: boolean` — expanded state for items with sub-items
  - `subItems?: SubItemType[]` — nested items (used by `Configurator`, `Menu`)
  - `disableRipple?: boolean` — suppresses the ripple effect on click
  - `actions?: ReactNode` — extra controls rendered at the item's trailing edge
  - `isDeletable?: boolean` — whether a delete control is shown
  - `data?: DataType | Promise<DataType>` — arbitrary payload; `Promise` is resolved by `InternalListItem` before rendering
  - `onClick`, `onDelete`, `onSelectChange`, `onActiveChange` — per-item event handlers
  - `render?(event)` — override the entire item render
  - `renderLoading?(event)`, `renderError?(event)`, `renderItem?(event)` — lifecycle render overrides used by `Table`

### Event types

- `ListItemEvent<T>` — extends `SyntheticEvent`; adds `id`, `item`, `data`, `ordinal?`
- `ListItemClickEvent<T>` — extends `ListItemEvent<T>` and `MouseEvent`; used for click handlers

### Utility type

- `ListItemType` — `string | ListItem | ReactListItem`; accepted by factory methods that normalise inputs

### `ReactListItem` namespace (factory methods)

Static helpers on the `ReactListItem` namespace — import the namespace itself, not individual functions:

- `ReactListItem.render(item)` — renders an item's label as a `ReactNode`; returns a loading `Skeleton` if the item is a `Promise` or has no displayable text
- `ReactListItem.from(item)` — normalises a `ListItemType` (string, plain record, or full `ReactListItem`) into a `ReactListItem`
- `ReactListItem.is(value)` — type guard: true for objects with a non-empty `id` and string `text`
- `ReactListItem.createClickEvent(event, item, index?)` — mutates a `MouseEvent` into a `ListItemClickEvent` by attaching `id`, `item`, `data`, `ordinal`
- `ReactListItem.createEvent(item)` — creates a synthetic `ListItemEvent` from a `ReactListItem` without a real DOM event (used for programmatic callbacks)

## Ambiguities and gotchas

- `data` can be a `Promise` — `InternalListItem` resolves it via `useAsync` and passes the resolved value to `renderItem`. Components that receive `data` directly may see `undefined` briefly while the promise is in flight; they should show a skeleton or loading state.
- `ReactListItem.createClickEvent` **mutates** the original `MouseEvent` object — it does not return a new object. This is intentional for performance but means the original event is modified in place.
- `label` takes precedence over `text` for display. `text` is still required (it comes from the `ListItem` base) and is used for sorting, filtering, and fallback rendering.
- `subItems` on `ReactListItem` uses a generic `SubItemType extends ReactListItem`. `Configurator` overrides this with `ConfiguratorSubItem`, which removes `subItems` recursion. Do not assume all sub-items support further nesting.

## Related

- [../extensions/AGENTS.md](../extensions/AGENTS.md) — `UseDataRequest` / `UseDataResponse` types (sibling file in `global.ts`)
- [../components/InternalList/AGENTS.md](../components/InternalList/AGENTS.md) — primary consumer; owns virtualisation and the `onRequest` protocol
- [../components/List/AGENTS.md](../components/List/AGENTS.md) — wraps InternalList; accepts `ReactListItem[]` or `onRequest`
- [../components/Table/AGENTS.md](../components/Table/AGENTS.md) — wraps InternalList; converts records to `ReactListItem` internally
- [../components/Configurator/AGENTS.md](../components/Configurator/AGENTS.md) — `ConfiguratorItem` and `ConfiguratorSlice` extend `ReactListItem`
