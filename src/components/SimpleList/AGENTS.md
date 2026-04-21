# SimpleList

A non-virtualised list component for small, fully-known datasets. It wraps `List` with a built-in Add/Edit/Delete dialog so items can be managed without custom handlers. Unlike `List`, `SimpleList` owns its item array — pass items via `value` and receive the updated array via `onChange`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `ReactListItem<T>[]` | No | The current list of items. Defaults to `[]`. |
| `onChange` | `(value: ReactListItem<T>[]) => void` | No | Called with the updated item array after an add or delete. |
| `allowAdd` | `boolean` | No | Show the Add button. Defaults to `true`. |
| `allowDelete` | `boolean` | No | Show the delete control on each item. Defaults to `true`. |
| `textFieldLabel` | `ReactNode` | No | Label for the text field inside the built-in Add/Edit dialog. Defaults to `"Text"`. |
| `onAdd` | `(event: MouseEvent<HTMLElement>) => PromiseMaybe<T \| void>` | No | Override the built-in add dialog with a custom handler. When provided, `allowAdd` is ignored for the dialog but the button is still shown. |
| `label` | `ReactNode` | No | Field label (forwarded to `List`). |
| `...rest` | `ListProps<T>` | No | All other `List` props are forwarded (except `items`, `value`, and `onChange` which are managed internally). |

## Usage

```tsx
import { SimpleList } from '@anupheaus/react-ui';
import type { ReactListItem } from '@anupheaus/react-ui';

const [items, setItems] = useState<ReactListItem[]>([]);

<SimpleList
  label="Tags"
  value={items}
  onChange={setItems}
  textFieldLabel="Tag name"
/>
```

When the user clicks Add, a small dialog opens with a single text field. On save, the new item is appended to the array and `onChange` is called. When `allowDelete` is `true`, the dialog also shows a Delete button for existing items.

---

## Decision rationale

**SimpleList vs List — when to use each.**
- Use `SimpleList` when the dataset is small (tens of items at most), you want built-in Add/Edit/Delete without writing your own dialog, and the list is owned by a form or settings panel where the full item array fits comfortably in memory.
- Use `List` when the dataset is large, when you need virtualisation (List delegates to `InternalList` which virtualises the DOM), or when you need full control over how items are added, edited, or deleted.
- "Non-virtualised" means every item in the array is rendered as a DOM node simultaneously. For small lists this is fine; for hundreds of items it causes layout and paint costs. There is no built-in cap — the responsibility to avoid large datasets lies with the consumer.

**Why SimpleList owns the item array.** `List` exposes `items` as a display prop and lets the consumer manage all mutations. `SimpleList` inverts this — it takes `value` + `onChange` and internally handles add/edit/delete through a dialog. This makes it a drop-in controlled field rather than a display component, consistent with how other form fields (Text, Chips, Radio) work in this library.

**How the built-in add/edit/delete dialogs work.** `useSimpleListItemDialog` opens a `Dialog` with a single `Text` field for the item's `text` property. On save the dialog resolves with the updated `ReactListItem`; on delete it resolves with `null`. SimpleList appends new items to the array for add, or passes the result of `onItemsChange` (on the underlying `InternalList`) back through `onChange` for delete. Edit (clicking an existing item) is routed through `InternalList`'s change mechanism, not through `openSimpleListItemDialog` directly.

**`onAdd` override.** When `onAdd` is provided it completely replaces the built-in dialog — `openSimpleListItemDialog` is never called. The button is still shown. `allowAdd` is only consulted when `onAdd` is absent.

## Ambiguities and gotchas

- **Do not use SimpleList for large datasets.** There is no virtualisation. Rendering more than ~100 items at once will cause noticeable performance degradation.
- **`allowDelete` only controls whether the Delete button appears inside the built-in dialog, not whether items can be removed programmatically.** It has no effect when `onAdd` is provided (the consumer's dialog is responsible for delete in that case).
- **`items`, `value` (on List), and `onChange` are stripped from the forwarded props.** SimpleList intercepts these and passes its own versions to `List`. Do not try to pass `items` directly — it will be overridden.
- **`onItemsChange` on `InternalList` is wired internally.** SimpleList installs its own `onItemsChange` handler to bridge delete operations back through `onChange`. If you find yourself needing `onItemsChange` externally, use `List` directly instead.
- **The dialog is modal and async.** `addNewItem` is async; if the user dismisses the dialog without saving, `openSimpleListItemDialog` resolves with `undefined` and `onChange` is not called. This is the expected no-op path.
- **`textFieldLabel` only affects the built-in dialog.** It does nothing when `onAdd` is provided.

## Related

- [../List/AGENTS.md](../List/AGENTS.md) — the virtualised equivalent; SimpleList wraps List and forwards most props to it. Use List directly when you need virtualisation or full mutation control.
- [../InternalList/AGENTS.md](../InternalList/AGENTS.md) — the engine that both List and SimpleList ultimately delegate to; relevant if you are debugging item change/delete behaviour.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem<T>` is the item type for `value` and `onChange`; the generic `T` is the arbitrary data payload attached to each item.

---

[← Back to Components](../AGENTS.md)
