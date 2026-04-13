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

[← Back to Components](../README.md)
