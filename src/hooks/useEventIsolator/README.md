# useEventIsolator

Returns a callback ref that, when assigned to a DOM element, prevents selected mouse or focus events from propagating or triggering their default behaviour. Useful for isolating interactive overlays, dropdowns, or modals from surrounding event listeners.

## Signature

```ts
function useEventIsolator(props?: UseEventIsolatorProps): (element: HTMLElement | null) => void
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `allMouseEvents` | `EventSetting` | No | Applies to all mouse events (`mouseenter`, `mouseleave`, `mousemove`, `mouseover`, `mouseout`, and all click events). Default `false`. |
| `clickEvents` | `EventSetting` | No | Applies to click-related events only (`mousedown`, `mouseup`, `click`, `dblclick`, `contextmenu`, `wheel`). Default `false`. |
| `focusEvents` | `EventSetting` | No | Applies to focus events (`focus`, `focusin`, `focusout`, `blur`). Default `false`. |
| `onParentElement` | `boolean` | No | When `true`, installs the handlers on the element's parent rather than on the element itself. Default `false`. |

### `EventSetting`

| Value | Behaviour |
|-------|-----------|
| `false` | Ignore this event group (default). |
| `'propagation'` | Call `stopPropagation()` only. |
| `'default'` | Call `preventDefault()` only. |
| `true` | Call both `stopPropagation()` and `preventDefault()`. |

## Returns

Returns a function `(element: HTMLElement | null) => void`. Pass it as a `ref` callback to the element you want to isolate. Event listeners are automatically replaced when the element changes and cleaned up when it is removed.

## Usage

```tsx
import { useEventIsolator } from '@anupheaus/react-ui';

function Dropdown() {
  // Stop click events from bubbling out of this dropdown
  const isolate = useEventIsolator({ clickEvents: 'propagation' });

  return (
    <div ref={isolate}>
      <button>Option A</button>
      <button>Option B</button>
    </div>
  );
}
```

---

[← Back to Hooks](../README.md)
