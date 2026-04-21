# Tabs

A tabbed panel system that separates content into labelled sections. The `useTabs` hook provides bound `Tabs` and `Tab` components with shared state, plus a `selectTab` helper for programmatic navigation.

## Usage

```tsx
import { useTabs } from '@anupheaus/react-ui';

function MyComponent() {
  const { Tabs, Tab, selectTab, selectedTabIndex } = useTabs();

  return (
    <Tabs>
      <Tab label="First">Content for the first tab</Tab>
      <Tab label="Second">Content for the second tab</Tab>
      <Tab label="Third">Content for the third tab</Tab>
    </Tabs>
  );
}
```

## Tabs Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | `Tab` components to render |
| `className` | `string` | No | Additional CSS class for the container |
| `alwaysShowTabs` | `boolean` | No | Show the tab button bar even when there is only one tab or all tabs lack labels (default: `false`) |
| `onChange` | `(index: number) => void` | No | Called when the active tab changes |

## Tab Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to display when this tab is active |
| `label` | `ReactNode` | No | Label shown in the tab button bar |
| `className` | `string` | No | Additional CSS class applied to the tab content area |
| `ordinalPosition` | `number` | No | Override the display order of this tab |
| `testId` | `string` | No | Test ID forwarded to the tab button |
| `noPadding` | `boolean` | No | Remove default content padding |
| `isVertical` | `boolean` | No | Stack content vertically (passed to the inner `Flex`) |
| `alignCentrally` | `boolean` | No | Centre-align content |
| `align` | `FlexProps['align']` | No | Horizontal alignment of content |
| `valign` | `FlexProps['valign']` | No | Vertical alignment of content |
| `gap` | `FlexProps['gap']` | No | Gap between child elements |
| `padding` | `FlexProps['padding']` | No | Padding for the content area |

## useTabs return value

| Property | Type | Description |
|----------|------|-------------|
| `Tabs` | Component | The container component — renders the tab bar and content area |
| `Tab` | Component | Individual tab — must be a direct child of `Tabs` |
| `selectTab` | `(index: number \| ((current: number) => number)) => void` | Programmatically switch the active tab |
| `selectedTabIndex` | `number` | Currently active tab index (reactive) |

## Architecture

The system uses a context-based registration pattern:

- **`Tabs.tsx`** — renders a hidden `TabsContext.Provider` that collects `Tab` registrations, then renders the tab button bar and content panels from the collected data.
- **`Tab/Tab.tsx`** — registers itself with `TabsContext` via `useLayoutEffect` and returns `null`; its content is lifted into the parent.
- **`Tab/TabButton.tsx`** — renders the clickable tab button in the button bar.
- **`Tab/TabContent.tsx`** — renders the tab content panel (hidden when not active).
- **`TabsContext.ts`** — React context that carries `upsertTab` / `removeTab` callbacks.
- **`useTabs.tsx`** — creates a shared `DistributedState<number>` and binds it to both `Tabs` and `Tab` components, exposing `selectTab` and `selectedTabIndex`.

---

[← Back to Components](../AGENTS.md)
