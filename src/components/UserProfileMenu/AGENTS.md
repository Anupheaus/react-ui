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

## Decision rationale

**Why `usePopupMenu` rather than using `Menu` directly.** `UserProfileMenu` composes `usePopupMenu` for the same reason `EllipsisMenu` does — `usePopupMenu` owns the three pieces of anchor state (`anchorEl`, `isOpen`, `onClose`) so `UserProfileMenu` does not need to manage them. Using `Menu` directly would require the component to expose and maintain state that is purely plumbing. `UserProfileMenu` only owns its own concerns: the avatar, the display name, and the menu items.

**What `UserProfileMenu` owns vs what it delegates.** It owns: the button layout (Avatar + display name label), the `openMenu` trigger binding, and the popover alignment choices (`menuAnchorPosition="topRight"`, `offsetPosition={0}`, `useWidthOfTargetElement`). Everything else — popover rendering, focus management, item click propagation, close-on-click behaviour — is delegated to `Menu` via `usePopupMenu`.

**`menuAnchorPosition="topRight"` and `useWidthOfTargetElement`.** These are set so the menu drops down flush under the button and exactly matches its width, giving the appearance of an inline dropdown rather than a free-floating popup. This is a deliberate visual choice for a titlebar context where the button has a fixed width.

**`Avatar` receives `displayName` directly.** `UserProfileMenu` passes `displayName` to `Avatar` and spreads the remaining `AvatarProps` (e.g. `emailAddress`, `size`, `iconName`). It does NOT pass an explicit `initials` prop — initials are derived inside `Avatar` from `displayName`. If you want to override initials, pass `initials` as part of the spread props via the `...avatarProps` rest.

## Ambiguities and gotchas

**Avatar fallback chain.** `Avatar` tries image sources in this order: (1) Gravatar, loaded from `emailAddress` as an MD5 hash URL; (2) initials derived from `displayName` (first letter of each whitespace-separated word); (3) a generic user icon. Gravatar is loaded asynchronously — on first render the avatar always shows initials or the icon, and the image fades in if Gravatar responds with a 200. If `emailAddress` is not passed to `UserProfileMenu`, Gravatar is never attempted.

**`displayName` drives both the button label and the avatar initials.** If you change `displayName` after mount, both the visible text and the initials update automatically — they read the same prop. There is no separate state for either.

**`initials` prop is omitted from the public interface.** The `Props` interface extends `Omit<AvatarProps, 'initials'>`, which means you cannot pass `initials` directly to `UserProfileMenu`. If you need custom initials you must pass them via the unspreaded `AvatarProps` rest — but since `initials` is explicitly omitted, you cannot. This is intentional: initials are always derived from `displayName` to keep them consistent with the displayed name.

**No loading / skeleton state.** `UserProfileMenu` does not check `useUIState().isLoading`. If your app shows a skeleton UI while the user profile is being fetched, you need to suppress rendering `UserProfileMenu` entirely until `displayName` is available, or accept that the avatar will briefly show a generic icon.

**`onClick` is forwarded to the Menu, not to the Button.** Clicking the button opens/closes the popup — it does not fire `onClick`. The `onClick` prop fires only when a menu item is selected. Do not use `onClick` to detect button presses.

## Related

- [../Menu/AGENTS.md](../Menu/AGENTS.md) — used internally via `usePopupMenu`; all popup rendering, focus, and close behaviour lives there.
- [../Avatar/AGENTS.md](../Avatar/AGENTS.md) — renders the avatar inside the button face; controls initials derivation and Gravatar loading.
- [../../models/AGENTS.md](../../models/AGENTS.md) — `items` prop accepts `ReactListItem[]`; same type used by `Menu`.

---

[← Back to Components](../AGENTS.md)
