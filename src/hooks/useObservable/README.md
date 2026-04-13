# useObservable

Creates a ref-backed observable value that notifies subscribers when it changes, without causing a component re-render on every mutation.

## Signature

```ts
function useObservable<T>(target: T | (() => T), dependencies?: unknown[]): Observable<T>
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `target` | `T \| (() => T)` | Yes | Initial value or factory function producing the initial value |
| `dependencies` | `unknown[]` | No | When these change and the value differs, subscribers are notified (default: `[]`) |

## Returns

An object with:

| Field | Type | Description |
|-------|------|-------------|
| `get()` | `() => T` | Returns the current value |
| `set(value)` | `(value: T \| ((prev: T) => T)) => void` | Updates the value and notifies subscribers |
| `onChange` | `(callback: (value: T) => void) => void` | Registers a subscriber (out-of-render-phase only) |

## Usage

```tsx
const counter = useObservable(0);

counter.onChange(value => console.log('Changed to', value));

counter.set(prev => prev + 1);
console.log(counter.get()); // 1
```

---

[← Back to Hooks](../README.md)
