# useToggleState

Manages a boolean toggle state, returning the current value and a stable function that flips it.

## Signature

```ts
function useToggleState(initialState?: boolean | (() => boolean)): [boolean, () => void]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialState` | `boolean \| (() => boolean)` | No | Initial toggle value or factory function (default: `false`) |

## Returns

A tuple of `[isOn: boolean, toggle: () => void]`:

- `isOn` — the current boolean state.
- `toggle` — a stable callback that flips the value.

## Usage

```tsx
const [isOpen, toggleOpen] = useToggleState(false);

return (
  <>
    <button onClick={toggleOpen}>Toggle</button>
    {isOpen && <Panel />}
  </>
);
```

---

[← Back to Hooks](../README.md)
