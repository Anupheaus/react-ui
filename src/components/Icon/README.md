# Icon

Renders a named SVG icon from the library's built-in icon set. Icons are sourced from `react-icons` (Feather, Material Design, Font Awesome) and exposed via a strongly-typed `IconName` union. The set can be extended at runtime with `Icon.augmentWith()`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `IconName` | Yes | Name of the icon to render. See [Available icons](#available-icons) below. |
| `size` | `'small' \| 'normal' \| 'large' \| number` | No | Named sizes map to `16` / `20` / `24` px. A number sets an exact pixel size. Default: `'normal'`. |
| `color` | `string` | No | CSS colour applied to the SVG. |
| `dropShadow` | `boolean` | No | Adds a soft drop-shadow filter to the icon. Default: `false`. |
| `rotate` | `number` | No | Rotation in degrees applied via `transform: rotate()`. |
| `className` | `string` | No | CSS class applied to the wrapper element. |
| `ref` | `Ref<HTMLDivElement>` | No | Forwarded ref to the wrapper `<icon>` element. |
| `onClick` | `(event: MouseEvent) => void` | No | Click handler; also adds a `pointer` cursor. |

## Available icons

The built-in `IconName` type lists all available names. You can inspect the full list in `src/components/Icon/Icons.ts`. Current built-ins include:

`drawer-close`, `dialog-close`, `window-close`, `window-maximize`, `window-restore`, `table-column-selection`, `table-refresh`, `table-edit`, `no-image`, `button-apply`, `error`, `help`, `number-increase`, `number-decrease`, `sub-menu`, `password-show`, `password-hide`, `dropdown`, `sign-in-dialog`, `calendar-holiday`, `calendar-business`, `calendar-sick`, `calendar-paternity`, `calendar`, `tick`, `cross`, `add`, `edit`, `ellipsis-menu`, `chip-delete`, `user`, `copy`, `arrow-up`, `arrow-down`, `filters`, `email`, `phone`, `delete-list-item`, `go-back`, `warning`

## Usage

```tsx
import { Icon } from '@anupheaus/react-ui';

// Basic usage
<Icon name="edit" />

// Sized and coloured
<Icon name="warning" size="large" color="orange" />

// Clickable
<Icon name="add" onClick={() => console.log('clicked')} />
```

## Extending the icon set

Use `Icon.augmentWith()` to merge additional icons into the global registry. The returned component is type-safe and accepts your custom icon names alongside the built-ins.

```tsx
import { Icon } from '@anupheaus/react-ui';
import { FiStar } from 'react-icons/fi';

const AppIcon = Icon.augmentWith({ star: FiStar });

// 'star' is now a valid name
<AppIcon name="star" />
```

---

[← Back to Components](../README.md)
