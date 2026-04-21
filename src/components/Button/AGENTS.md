# Button

A clickable button component with ripple feedback, three visual variants, and three sizes. Automatically respects read-only and loading UI states, and auto-detects icon-only mode for circular rendering. `ButtonGroup` renders a horizontal row of buttons sharing a common context.

## Props

### Button

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Button label or content. A single `<Icon>` child auto-enables icon-only mode. |
| `variant` | `'default' \| 'bordered' \| 'hover'` | No | Visual style. Defaults to `'default'`. |
| `size` | `'default' \| 'small' \| 'large'` | No | Button size. Defaults to `'default'`; automatically `'small'` when the UI is in compact mode. |
| `align` | `'left' \| 'middle' \| 'right'` | No | Content alignment within the button. Defaults to `'middle'`. |
| `iconOnly` | `boolean` | No | Forces circular icon-only rendering. Auto-detected when the sole child is an `<Icon>`. |
| `onClick` | `(event: MouseEvent) => PromiseMaybe<unknown>` | No | Click handler. If it returns a Promise, a skeleton animated border is shown until the promise resolves. |
| `onSelect` | `(event: MouseEvent \| KeyboardEvent) => PromiseMaybe<void>` | No | Selection handler (click or keyboard). Behaves identically to `onClick` for async state. |
| `style` | `CSSProperties` | No | Inline styles applied to the button element. |
| `className` | `string` | No | Additional CSS class name. |
| `testId` | `string` | No | `data-testid` attribute for test targeting. |
| `ref` | `Ref<HTMLButtonElement>` | No | Forward ref to the underlying `<button>` element. |

### ButtonGroup

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | `<Button>` elements to group together. |

## Usage

```tsx
import { Button, ButtonGroup } from '@anupheaus/react-ui';

// Basic button
<Button onClick={() => console.log('clicked')}>Save</Button>

// Bordered variant with async handler (shows animated border while pending)
<Button variant="bordered" onClick={async () => { await save(); }}>
  Save
</Button>

// Icon-only button (automatically circular)
<Button onClick={handleAdd}>
  <Icon name="add" />
</Button>

// Grouped buttons
<ButtonGroup>
  <Button>Left</Button>
  <Button>Centre</Button>
  <Button>Right</Button>
</ButtonGroup>
```

## Architecture

- Clicks are suppressed while `isReadOnly` or `isLoading` context states are active (provided by `UIState`).
- When `onClick` or `onSelect` returns a Promise, the button renders a `<Skeleton useAnimatedBorder>` overlay until the promise settles.
- Ripple effect is applied via `useRipple` and is suppressed in read-only/loading states.
- `ButtonGroup` provides a `ButtonContext` to its children; the context is currently empty but reserved for future shared state.

---

[← Back to Components](../AGENTS.md)
