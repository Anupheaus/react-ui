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

## Decision rationale

`Autocomplete` does **not** use `InternalDropDown` despite looking visually similar. It is built on `InternalText` (an editable input) plus its own `Popover` and `Menu`. This is intentional: the core interaction is text editing with inline type-ahead, not a read-only field that opens a list. The architecture would fight `InternalDropDown`'s read-only field model.

**When to use Autocomplete vs DropDown:**
- Use `Autocomplete` when the user needs to type to filter or search — particularly when the list is large or server-side.
- Use `DropDown` when the user selects from a fully pre-loaded list without typing.

**What makes the async search special:** `onGetValues` is called both on chevron click (to load the full dropdown) and on every keystroke that reaches `minSearchLength`. A `lastActionIdRef` string ID is stamped on each call; when the async result arrives, it is discarded if the ID no longer matches the current one. This is a lightweight race-condition guard — it does not abort the in-flight request, it just ignores the stale result.

## Ambiguities and gotchas

- **`Autocomplete` does not use `InternalDropDown`** — changes to `InternalDropDown` have no effect here. The popover, loading state, and item rendering are all re-implemented locally.
- **Dead code blocks in source** — `renderSelectedValue` and `handleContainerSelect` are commented out in the current implementation. Do not assume they are functional or remove the comments without understanding why they were disabled.
- **`value` prop accepts `string | ReactListItem`** — if a `string` is passed, it is resolved to the matching item's `.text` via `values.findById`. If a `ReactListItem` is passed, `.text` is used directly. The internal display state is always a `string` (the text), not an ID.
- **`minSearchLength` gates type-ahead, not the dropdown** — typing fewer characters than `minSearchLength` still updates the input text, it just does not trigger a match suggestion or async lookup. Clicking the chevron always calls `onGetValues` regardless of `minSearchLength`.
- **Blur does not confirm the type-ahead** — if the user types a partial match and tabs away, the inline selection is not confirmed as a selection. `onChange` is only fired by clicking an item in the dropdown. The text input may show the suggestion text while the controlled `value` prop remains the old selection.
- **`fakeValues` skeleton array is module-level** — the 10 fake items used during loading are created once with `Math.random()` text lengths when the module is first imported, not on each render. Their lengths are fixed for the lifetime of the module.
- **Deprecated `PaperProps`** — the popover uses `PaperProps` (MUI v4-style prop) rather than `slotProps.paper` used in `InternalDropDown`. Do not "unify" these without checking the MUI version contract.
- **`lastActionIdRef` is also mutated in `handleKeyDown`** — pressing any non-modifier key stamps a new action ID, which cancels any pending `onGetValues` response from a previous keystroke. This means very fast typing followed by an arrow key will discard the last async result.

## Related

- [../DropDown/AGENTS.md](../DropDown/AGENTS.md) — simpler sibling for pre-loaded lists without text input
- [../InternalDropDown/AGENTS.md](../InternalDropDown/AGENTS.md) — NOT used by Autocomplete, but the shared base for DropDown and Chips; worth reading for comparison
- [../../models/AGENTS.md](../../models/AGENTS.md) — `ReactListItem` is the item type; `ListItemClickEvent` used in `handleItemClick`

---

[← Back to Components](../AGENTS.md)
