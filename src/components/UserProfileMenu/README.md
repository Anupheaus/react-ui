# UserProfileMenu

A compact user profile button that displays an `Avatar` and the user's display name, and opens a popup menu when clicked. Intended for use in a `Titlebar` end adornment.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `displayName` | `string` | Yes | Full name of the current user, shown next to the avatar and used to generate avatar initials |
| `items` | `ReactListItem[]` | Yes | Menu items to display in the popup (e.g. Profile, Sign out) |
| `onClick` | `(event: ListItemClickEvent) => void` | No | Called when a menu item is clicked |
| `...avatarProps` | `Omit<AvatarProps, 'initials'>` | No | Any additional `Avatar` props (e.g. `src` for a profile photo) |

## Usage

```tsx
import { UserProfileMenu } from '@anupheaus/react-ui';
import type { ReactListItem } from '@anupheaus/react-ui';

const profileItems: ReactListItem[] = [
  { id: 'profile', text: 'My Profile' },
  { id: 'signout', text: 'Sign Out' },
];

<UserProfileMenu
  displayName="Jane Doe"
  items={profileItems}
  onClick={({ item }) => {
    if (item.id === 'signout') signOut();
  }}
/>
```

## Architecture

`UserProfileMenu` composes `usePopupMenu` internally. The `Button` element is assigned as the menu target via `ref={target}`; clicking the button calls `openMenu`. The `Menu` is rendered with `menuAnchorPosition="topRight"` and `useWidthOfTargetElement` so it aligns flush with the button.

---

[← Back to Components](../README.md)
