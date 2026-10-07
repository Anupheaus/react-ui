# Titlebar

A horizontal application or panel title bar with slots for a leading icon, a title, flexible middle content, and a trailing end adornment. Action elements placed inside the titlebar receive a transparent-background theme override so they blend with the bar's background.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `ReactNode` | No | Title text or element rendered as a `Typography` node |
| `icon` | `ReactNode` | No | Leading icon placed before the title |
| `endAdornment` | `ReactNode` | No | Trailing content pinned to the right edge (e.g. a `UserProfileMenu`) |
| `children` | `ReactNode` | No | Content rendered in the flexible middle area between the title and end adornment (text and elements) |
| `renderTitle` | `(title: ReactNode) => ReactNode` | No | Replaces the default title rendering, including its `titlebar-title` `Typography` wrapper; receives `title` and is called even when `title` is null |
| `className` | `string` | No | Additional CSS class for the titlebar container |
| `wrapWhenCrowded` | `boolean` | No | When the parts need more width than the titlebar has (a window on a phone), wrap: icon, title and end adornment stay on the first row, the middle content takes a row below. Off by default; `WindowHeader` turns it on |

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

## Structure

`titlebar` holds `titlebar-heading` (the icon and the title together), `titlebar-content` and `titlebar-end-adornment`. The heading is `display: contents` while everything is on one row, so the titlebar's layout is unchanged; it becomes a real flex item only in the wrapped layout.

## Wrapping when crowded (`wrapWhenCrowded`)

`useCrowdedTitlebar` measures the titlebar after every render and whenever it or its content changes size (`nextCrowdedTitlebarState`, pure, decides). It wraps when the parts need more width than the titlebar has, or when the title has been squeezed below `UNREADABLE_TITLE_WIDTH_PX` (a title that still shows a few words with an ellipsis is how a wide titlebar has always looked, so that is left alone). Wrapped, the titlebar gets the `is-crowded` class: the title takes the width left on row one (an ellipsis), the end adornment stays reachable beside it, and the content wraps on row two. It stays wrapped until it is given more width than it was wrapped at, then tries one row again.

A consumer's own content that is wider than a phone can style against `titlebar.is-crowded &` (for example `flexWrap: 'wrap'`, or letting the title take more lines). The titlebar is `flexShrink: 0` while wrapped so a short window cannot squash it over its own content.

---

[← Back to Components](../AGENTS.md)
