# Titlebar

A horizontal application or panel title bar with slots for a leading icon, a title, flexible middle content, and a trailing end adornment. Action elements placed inside the titlebar receive a transparent-background theme override so they blend with the bar's background.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `ReactNode` | No | Title text or element rendered as a `Typography` node |
| `icon` | `ReactNode` | No | Leading icon placed before the title |
| `endAdornment` | `ReactNode` | No | Trailing content pinned to the right edge (e.g. a `UserProfileMenu`) |
| `children` | `ReactNode` | No | Content rendered in the flexible middle area between the title and end adornment |
| `className` | `string` | No | Additional CSS class for the titlebar container |

## Usage

```tsx
import { Titlebar } from '@anupheaus/react-ui';

<Titlebar
  icon={<Icon name="app-logo" />}
  title="My Application"
  endAdornment={<UserProfileMenu displayName="Jane Doe" items={profileMenuItems} />}
>
  <NavLink to="/dashboard">Dashboard</NavLink>
  <NavLink to="/settings">Settings</NavLink>
</Titlebar>
```

---

[← Back to Components](../README.md)
