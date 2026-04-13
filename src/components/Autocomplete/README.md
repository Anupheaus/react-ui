# Autocomplete

A searchable text input that opens a dropdown of matching options as the user types. Supports both a static list of values and an async `onGetValues` callback for server-side search. The dropdown closes when an item is selected.

An inline type-ahead suggestion is shown in the input while the user types: the best matching item's full text is selected (highlighted) so the user can accept it with the cursor keys or keep typing to narrow the match.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string \| ReactListItem` | No | The current value — either the selected item's `id` string or a full `ReactListItem` object |
| `values` | `ReactListItem[]` | No | Static list of items to filter locally as the user types |
| `minSearchLength` | `number` | No | Minimum number of characters before the type-ahead suggestion activates. Defaults to `3` |
| `overridePopup` | `FunctionComponent<AutocompletePopupProps>` | No | Replace the default menu popup with a custom component. Receives `{ search: string }` |
| `renderSelectedValue` | `(item?: ReactListItem) => ReactNode \| void` | No | Custom renderer for the currently selected item |
| `onGetValues` | `(search: string, pagination?: DataPagination) => PromiseMaybe<ReactListItem[]>` | No | Async callback for server-side search. Called with the current search text whenever the dropdown chevron is clicked |
| `label` | `ReactNode` | No | Label for the field |
| `isOptional` | `boolean` | No | Marks the field as optional |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text below the field |
| `wide` | `boolean` | No | Grow to fill available width |
| `placeholder` | `string` | No | Placeholder text shown when the input is empty |
| `onChange` | `(id: string, item: ReactListItem) => void` | No | Called with the selected item's `id` and full item when the user picks from the dropdown |

## Usage

### Static values

```tsx
import { Autocomplete } from '@anupheaus/react-ui';

const countries = [
  { id: 'au', text: 'Australia' },
  { id: 'nz', text: 'New Zealand' },
  { id: 'gb', text: 'United Kingdom' },
];

function Example() {
  const [selected, setSelected] = useState<string>();

  return (
    <Autocomplete
      label="Country"
      values={countries}
      value={selected}
      onChange={(id) => setSelected(id)}
    />
  );
}
```

### Async (server-side) search

```tsx
import { Autocomplete } from '@anupheaus/react-ui';

function Example() {
  const [selected, setSelected] = useState<string>();

  const handleGetValues = async (search: string) => {
    const results = await api.searchUsers(search);
    return results.map(u => ({ id: u.id, text: u.name }));
  };

  return (
    <Autocomplete
      label="User"
      minSearchLength={2}
      onGetValues={handleGetValues}
      value={selected}
      onChange={(id) => setSelected(id)}
    />
  );
}
```

### Custom popup

```tsx
import { Autocomplete, type AutocompletePopupProps } from '@anupheaus/react-ui';

function MyPopup({ search }: AutocompletePopupProps) {
  return <div>Custom results for: {search}</div>;
}

<Autocomplete label="Search" overridePopup={MyPopup} />
```

---

[← Back to Components](../README.md)
