# useId

Returns a stable unique identifier for a component instance. If an explicit `id` is provided it is returned as-is; otherwise a random unique id is generated and persisted for the lifetime of the component. The id is updated whenever the provided `id` prop changes.

## Signature

```ts
function useId(id?: string): string
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | No | An explicit id to use. When `undefined`, a unique id is generated automatically. |

## Returns

Returns a `string` that is stable across renders. It matches the provided `id` if given, or a generated unique string otherwise.

## Usage

```tsx
import { useId } from '@anupheaus/react-ui';

function LabelledInput({ id, label }: { id?: string; label: string }) {
  const inputId = useId(id);

  return (
    <>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} />
    </>
  );
}
```

---

[← Back to Hooks](../AGENTS.md)
