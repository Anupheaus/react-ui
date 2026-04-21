# List

A higher-level virtualised list component that wraps `InternalList` inside a `Field` container, adding a label, validation, selection binding, an optional Add button, and adornment support. It accepts items either as a static array or via an async `onRequest` callback.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `ReactListItem<T>[]` | No | Static array of items. Use this **or** `onRequest`. |
| `onRequest` | `ListOnRequest<T>` | No | Async callback for paginated/lazy loading. Mirrors `InternalListProps.onRequest` — see [InternalList](../InternalList/AGENTS.md) for the full contract. |
| `label` | `ReactNode` | No | Field label displayed above the list. |
| `help` | `ReactNode` | No | Help icon content shown beside the label. |
| `isOptional` | `boolean` | No | Marks the field as optional (suppresses "required" validation). |
| `isRequiredMessage` | `ReactNode` | No | Custom message shown when the list is empty and `isOptional` is not set. |
| `hideOptionalLabel` | `boolean` | No | Hides the "(optional)" suffix even when `isOptional` is `true`. |
| `error` | `ReactNode` | No | Explicit error message; overrides any validation-derived error. |
| `assistiveHelp` | `FieldProps['assistiveHelp']` | No | Assistive text rendered below the field. |
| `value` | `string \| string[]` | No | Controlled selection. Pass `string[]` for multi-select, `string` for single-select. |
| `onChange` | `(newValue: string \| string[]) => void` | No | Called when the selection changes. Type matches `value`. |
| `maxSelectableItems` | `number` | No | Maximum number of simultaneously selected items. Inferred from `value` type when not set: `1` for `string`, unlimited for `string[]`. |
| `selectionRequiredMessage` | `ReactNode` | No | Validation message shown when `onChange` is set but nothing is selected. |
| `allowMultiSelect` | `boolean` | No | Convenience alias to allow multiple selections without providing `value`. |
| `onAdd` | `(event: MouseEvent<HTMLElement>) => PromiseMaybe<T \| void>` | No | When provided, renders an Add button. Called when the button is clicked. |
| `addTooltip` | `ReactNode` | No | Tooltip for the Add button. Defaults to `"Add a new item to this list"`. |
| `deleteTooltip` | `ReactNode` | No | Tooltip shown on each item's delete control. Defaults to `"Delete this item from this list"`. |
| `onDelete` | `(event: ListItemEvent<T>) => void` | No | Called when an item's delete button is activated. |
| `adornments` | `ReactNode` | No | Extra controls rendered in the top-right corner of the field container. |
| `stickyHeader` | `ReactNode` | No | Content placed in the sticky header above the scrollable area (hides on scroll down). |
| `width` | `string \| number` | No | Width of the field container. |
| `wide` | `boolean` | No | Expands the field to fill available width. |
| `fullHeight` | `boolean` | No | Expands the list to fill its parent's height. |
| `minHeight` | `FlexProps['minHeight']` | No | Minimum height of the inner list. Defaults to `130`. |
| `padding` | `number` | No | Additional padding inside the field container. |
| `borderless` | `boolean` | No | Removes the field border. |
| `delayRenderingItems` | `boolean` | No | Defers item rendering by ~100 ms after mount. |
| `actions` | `UseActions<ListActions>` | No | Ref-style callback to receive a `ListActions` handle (`refresh`, `scrollTo`). |
| `className` | `string` | No | Class applied to the outermost field element. |
| `containerClassName` | `string` | No | Class applied to the field container. |
| `contentClassName` | `string` | No | Class applied to the inner list content area. |
| `children` | `ReactNode` | No | Additional content rendered inside the field. |
| `gap` | `FlexProps['gap']` | No | Gap between list items. |
| `onClick` | `(event: ListItemClickEvent<T>) => PromiseMaybe<void>` | No | Called when a list item is clicked. |
| `onActive` | `(event: ListItemEvent<T>, isActive: boolean) => void` | No | Called when an item gains or loses active state. |
| `onError` | `(error: Error) => void` | No | Called if the `onRequest` handler throws. |

`ListActions` is an alias for `InternalListActions`: `{ refresh(): void; scrollTo(value: number | 'bottom'): void }`.

`ListOnRequest<T>` is `Required<ListProps<T>>['onRequest']` — the same async request callback as on `InternalList`.

## Usage

```tsx
import { List } from '@anupheaus/react-ui';

// Static items
<List label="Fruits" items={[{ id: '1', text: 'Apple' }, { id: '2', text: 'Banana' }]} />

// Lazy-loaded items
<List
  label="Users"
  onRequest={async ({ requestId, pagination }, respond) => {
    const page = await api.getUsers(pagination.offset ?? 0, pagination.limit);
    respond({ requestId, items: page.items, total: page.total });
  }}
  onAdd={() => openNewUserDialog()}
/>

// Controlled single-select
const [selected, setSelected] = useState('');
<List
  label="Pick one"
  items={options}
  value={selected}
  onChange={setSelected}
/>

// Controlled multi-select (up to 3)
const [selected, setSelected] = useState<string[]>([]);
<List
  label="Pick up to three"
  items={options}
  value={selected}
  onChange={setSelected}
  maxSelectableItems={3}
/>
```

### Relationship to `InternalList`

`List` is a thin wrapper around `InternalList`. It:
- Wraps `InternalList` inside a `Field` container (label, error, skeleton suppression).
- Adds form-level validation (required / selection-required messages).
- Translates the `value` / `onChange` pattern into `selectedItemIds` / `onSelectedItemsChange`.
- Adds the Add button lifecycle (calls `onAdd`, then re-enables validation errors).

All `onRequest` / virtualisation behaviour is handled entirely by `InternalList`. Refer to [InternalList](../InternalList/AGENTS.md) for the virtualisation and request contract details.

## Related

- [../InternalList/AGENTS.md](../InternalList/AGENTS.md) — the virtualisation engine `List` wraps
- [../Table/AGENTS.md](../Table/AGENTS.md) — peer component using the same `onRequest` protocol for tabular data
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem`, `UseDataRequest`, `UseDataResponse` — the item and request types

---

[← Back to Components](../AGENTS.md)
