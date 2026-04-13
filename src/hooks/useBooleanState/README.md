# useBooleanState

Manages a boolean state value and exposes stable setter functions for setting it to `true` or `false` without needing inline callbacks.

## Signature

```ts
function useBooleanState(defaultValue?: boolean): [boolean, () => void, () => void, Dispatch<SetStateAction<boolean>>]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `defaultValue` | `boolean` | No | Initial value (default `false`). |

## Returns

A tuple of four elements:

| Index | Type | Description |
|-------|------|-------------|
| `[0]` | `boolean` | The current boolean value. |
| `[1]` | `() => void` | Stable function that sets the value to `true`. |
| `[2]` | `() => void` | Stable function that sets the value to `false`. |
| `[3]` | `Dispatch<SetStateAction<boolean>>` | The raw React state setter for full control. |

## Usage

```tsx
import { useBooleanState } from '@anupheaus/react-ui';

function Modal() {
  const [isOpen, open, close] = useBooleanState(false);

  return (
    <>
      <button onClick={open}>Open</button>
      {isOpen && <dialog open onClose={close}>Content</dialog>}
    </>
  );
}
```

---

[← Back to Hooks](../README.md)
