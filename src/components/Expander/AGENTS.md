# Expander

An animated height-collapsible container. When `isExpanded` changes the element transitions smoothly between `height: 0` (collapsed) and its natural scroll height (expanded). Transition duration scales with content height so taller content doesn't snap. Expanders can be nested.

Also ships with a `useExpander` hook that manages expand/collapse state and returns a pre-wired `Expander` component, eliminating the need for local state boilerplate.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to show/hide |
| `isExpanded` | `boolean` | No | Whether the content is visible (default: `false`) |
| `className` | `string` | No | Additional CSS class names |
| `isVertical` | `boolean` | No | Lay children vertically (forwarded to inner `Flex`) |
| `gap` | `number \| 'fields'` | No | Gap between children (forwarded to inner `Flex`) |
| `debug` | `boolean` | No | Log transition state changes to the console |

## `useExpander`

```ts
const { Expander, isExpanded, setExpanded, toggle } = useExpander(initialState?, onExpand?);
```

| Return | Type | Description |
|--------|------|-------------|
| `Expander` | Component | Pre-wired `Expander` — no need to pass `isExpanded` |
| `isExpanded` | `boolean` | Current expanded state (reactive) |
| `setExpanded` | `(value: boolean) => void` | Set expanded state directly |
| `toggle` | `() => void` | Toggle between expanded and collapsed |

## Usage

```tsx
import { Expander } from '@anupheaus/react-ui';

// Controlled
const [isOpen, setIsOpen] = useState(false);

<Button onSelect={() => setIsOpen(v => !v)}>Toggle</Button>
<Expander isExpanded={isOpen}>
  <DetailPanel />
</Expander>
```

```tsx
import { useExpander } from '@anupheaus/react-ui';

// Via hook
const { Expander, toggle } = useExpander(false);

<Button onSelect={toggle}>Toggle</Button>
<Expander>
  <DetailPanel />
</Expander>
```

---

[← Back to Components](../AGENTS.md)
