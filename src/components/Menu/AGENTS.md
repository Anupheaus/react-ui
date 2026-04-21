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

## Decision rationale

**Portal / Popover approach.** Menu uses MUI `Popover` (which renders into a portal at the document root) whenever `anchorEl` is supplied. This avoids z-index and overflow-clipping issues — an inline `<menu>` element inside a deeply-nested layout would be clipped by any ancestor with `overflow: hidden`. The portal approach guarantees the floating menu always renders on top of everything else without requiring manual z-index juggling.

**Dual inline / popup mode in one component.** Rather than two separate components, `Menu` detects its mode from the presence of `isOpen`. When `isOpen` is `undefined` the component renders inline (no `Popover` wrapper). When `isOpen` is provided it switches to popup mode. This means wrappers like `usePopupMenu` and `SelectorButton` don't need to import a separate `PopupMenu` component — they simply drive `isOpen`.

**`EllipsisMenu` is a convenience wrapper, not a variant.** It does not extend `Menu` props or add any behaviour. It is just `usePopupMenu` + a `Button` rendering an `ellipsis-menu` icon. Treat it as a thin shell: all real behaviour lives in `Menu` and `usePopupMenu`. If you need a custom trigger shape, copy the pattern from `EllipsisMenu` rather than adding props to it.

**`usePopupMenu` exists to avoid prop threading.** Without it, callers would need to manage three pieces of state (`anchorEl`, `isOpen`, `onClose`) and wire them manually. The hook encapsulates all of that. The returned `Menu` component is a closure that injects the three wired props, so callers can pass any remaining `MenuProps` without touching anchor plumbing.

**`PopupMenuContext` for close propagation.** When a menu item is clicked inside a popup, the item renderer reads `PopupMenuContext.close` and calls it. This collapses the entire popup chain (including any parent sub-menus) without requiring the click handler to know the full nesting depth. Without this, clicking a leaf item in a sub-menu would close the sub-menu but leave the parent popup open.

**Sub-menu hover delay.** Sub-menus are shown on mouse-over (`isVisible` in `SubMenuProvider`) rather than on click. The 200 ms close delay in `useLayoutEffect` prevents the menu from snapping shut when the cursor briefly leaves the trigger while crossing into the sub-menu.

## Ambiguities and gotchas

**Focus management.** `Menu` passes `disableEnforceFocus` and `disableAutoFocus` straight through to MUI `Popover` but does not manage focus itself. If a menu item is a custom `ReactNode` (`item.label`), keyboard focus will not reach it unless the consumer adds `tabIndex` and key handlers. The `allowFocus` prop on the `Flex` item wrapper only enables tab stop for the wrapper element, not for arbitrary content inside.

**Close timing and the 200 ms delay.** When `isOpen` transitions to `false`, `Menu` does not close immediately — it sets a 200 ms timeout before calling `setControlledIsOpen(false)`. During those 200 ms the menu remains visually open. This is intentional to prevent flicker on sub-menu transitions. If you need an immediate close (e.g. in a test), you must advance the timer.

**Anchor element unmounting.** `usePopupMenu` uses `useDOMRef` with `connected`/`disconnected` callbacks to track the anchor element. If the trigger element unmounts while the menu is open, `anchorEl` is set to `undefined`, which causes `shouldShowPopover` to be `false` and the `Popover` to disappear. The `onClose` callback is NOT fired in this case — the parent will not receive a close notification.

**Inline mode has no close mechanism.** When `isOpen` is `undefined`, there is no `Popover`, no `onClose`, and no `PopupMenuContext`. Clicking an item calls `onClick` but nothing automatically hides the menu. If you render `Menu` inline and need it to disappear after selection, that is entirely the consumer's responsibility.

**`isOpen` must be boolean or undefined — not null.** The `isPopupMode` check is `propsIsOpen !== undefined`. Passing `null` is treated as popup mode with `isOpen = null`, which collapses to falsy and the menu stays closed — silently doing nothing.

**Sub-menu items must use `subItems`, not a nested `items` prop.** `MenuItemRenderer` checks `item.subItems` to decide whether to render a nested `Menu`. A `ReactListItem` with no `subItems` (or an empty array) will never show a sub-menu, even if you pass child items by other means.

**`useWidthOfTargetElement` depends on `useOnResize`.** The anchor width is measured reactively. On first render, `width` may be `undefined`, causing `minWidth` to be `undefined` briefly before the resize observer fires. Avoid asserting the menu width immediately after mount in tests.

## Related

- [../EllipsisMenu](./EllipsisMenu.tsx) — thin wrapper around `usePopupMenu`; not a separate component directory but lives here alongside `Menu`.
- [../UserProfileMenu/AGENTS.md](../UserProfileMenu/AGENTS.md) — uses `usePopupMenu` from this directory to build its popup trigger.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `items` prop accepts `ReactListItem[]`; sub-items (`item.subItems`) use the same type.

---

[← Back to Components](../AGENTS.md)
