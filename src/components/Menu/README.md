# Menu

A flexible list-based menu that can render inline or as a popover anchored to an element. Supports nested sub-menus, keyboard focus management, and responsive layout on touch devices. Two convenience wrappers — `EllipsisMenu` and `UserProfileMenu` — cover the most common trigger patterns.

## Menu Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `ReactListItem[]` | Yes | Menu items to display; items with `subItems` open a sub-menu |
| `onClick` | `(event: ListItemClickEvent) => void` | No | Called when any item is clicked |
| `className` | `string` | No | Additional CSS class for the menu element |
| `gap` | `FlexProps['gap']` | No | Gap between menu items |
| `minWidth` | `string \| number` | No | Minimum width of the menu |
| `padding` | `number \| string` | No | Padding inside the menu |
| `anchorEl` | `HTMLElement \| null` | No | Element to anchor the popover to (enables popup mode) |
| `isOpen` | `boolean` | No | Controls popover visibility (popup mode) |
| `onClose` | `() => void` | No | Called when the popover requests to close |
| `targetAnchorPosition` | `'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight'` | No | Corner of the anchor element to attach to (default: `'bottomRight'`) |
| `menuAnchorPosition` | `'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight'` | No | Corner of the menu that aligns to the anchor point (default: `'topLeft'`) |
| `offsetPosition` | `number` | No | Pixel offset applied to the attachment point (default: `12`) |
| `useWidthOfTargetElement` | `boolean` | No | Match the menu width to the anchor element (default: `false`) |
| `disableEnforceFocus` | `boolean` | No | Passed to the MUI `Popover` |
| `disableAutoFocus` | `boolean` | No | Passed to the MUI `Popover` |

## EllipsisMenu Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `ReactListItem[]` | Yes | Menu items |
| `onClick` | `(event: ListItemClickEvent) => void` | No | Item click handler |
| `buttonSize` | `Button['size']` | No | Size of the ellipsis trigger button |

## usePopupMenu

`usePopupMenu()` wires a button ref to a `Menu` in popup mode without manual state management.

```tsx
import { usePopupMenu } from '@anupheaus/react-ui';

function MyComponent() {
  const { target, Menu, openMenu, closeMenu } = usePopupMenu();

  return (
    <>
      <Button ref={target} onClick={openMenu}>Open</Button>
      <Menu items={items} onClick={handleClick} />
    </>
  );
}
```

| Return value | Type | Description |
|---|---|---|
| `target` | `DOMRef` | Attach to the trigger element via `ref` |
| `Menu` | Component | Pre-wired `Menu` — accepts all `MenuProps` except `anchorEl`, `isOpen`, `onClose` |
| `openMenu` | `() => void` | Open the menu |
| `closeMenu` | `() => void` | Close the menu |

## Usage

```tsx
import { Menu, EllipsisMenu } from '@anupheaus/react-ui';
import type { ReactListItem } from '@anupheaus/react-ui';

const items: ReactListItem[] = [
  { id: '1', text: 'Edit' },
  { id: '2', text: 'Delete' },
];

// Inline menu
<Menu items={items} onClick={({ item }) => console.log(item)} />

// Ellipsis trigger (three-dot button)
<EllipsisMenu items={items} onClick={({ item }) => console.log(item)} />
```

## Architecture

- **`Menu.tsx`** — core component; renders inline or inside a MUI `Popover`; handles sub-menu hover delays and close propagation via `PopupMenuContext`.
- **`MenuItemRenderer.tsx`** — renders a single `ReactListItem`, recursively passing `Menu` as the sub-menu component for items that have `subItems`.
- **`SubMenuProvider.tsx`** — context that manages hover-based sub-menu visibility and the anchor element for nested menus.
- **`PopupMenuContext.ts`** — context that carries a `close()` callback so nested menus can close the entire popup chain.
- **`MenuState.ts`** — shared state types.
- **`MenuTheme.ts`** — theme token definitions for the menu.
- **`EllipsisMenu.tsx`** — wraps `usePopupMenu` with a three-dot icon button trigger.
- **`usePopupMenu.tsx`** — hook that manages `anchorEl` / `isOpen` state and returns a pre-configured `Menu`.

---

[← Back to Components](../README.md)
