# useStorage

Persists and retrieves a value in `localStorage`, `sessionStorage`, or both, exposing a React state setter that keeps the in-memory state and browser storage in sync.

## Signature

```ts
function useStorage<T>(key: string, propsOrDefaultValue?: (() => T) | UseStorageProps<T>): UseStorageResult<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | Yes | Storage key used to read/write the value |
| `propsOrDefaultValue` | `(() => T) \| UseStorageProps<T>` | No | Default value factory, or an options object (see below) |

### `UseStorageProps<T>`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'local' \| 'session' \| 'both'` | No | Which storage to use (default: `'local'`). `'both'` writes to both and reads from session first |
| `defaultValue` | `() => T` | No | Factory called when the key is absent from storage |
| `disabled` | `boolean` | No | When `true`, storage is bypassed and state is always `undefined` |

## Returns

An object with:

| Field | Type | Description |
|-------|------|-------------|
| `state` | `T \| undefined` | Current value (from storage on first render, then in-memory) |
| `setState` | `Dispatch<SetStateAction<T \| undefined>>` | Updates both in-memory state and browser storage |
| `isInSessionStorage` | `boolean` | Whether the key currently exists in `sessionStorage` |
| `isInLocalStorage` | `boolean` | Whether the key currently exists in `localStorage` |

## Usage

```tsx
const { state: theme, setState: setTheme } = useStorage<string>('app-theme', () => 'light');

return (
  <button onClick={() => setTheme('dark')}>
    Current theme: {theme}
  </button>
);
```

---

[← Back to Hooks](../AGENTS.md)
