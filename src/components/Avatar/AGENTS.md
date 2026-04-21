# Avatar

A circular avatar that displays a user's identity. It tries to load a [Gravatar](https://gravatar.com) image when an email address is supplied; if that fails (or no email is given) it falls back to initials derived from `displayName` or the explicit `initials` prop, and finally to an icon. Integrates with `Skeleton` for loading states.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `emailAddress` | `string` | No | Email address used to fetch a Gravatar image. |
| `displayName` | `string` | No | Full display name; initials are derived from the first letter of each word. |
| `initials` | `string` | No | Explicit initials string, overrides derivation from `displayName`. |
| `iconName` | `IconName` | No | Fallback icon when no initials are available (default: `'user'`). |
| `size` | `'small' \| 'medium' \| 'large' \| number` | No | Diameter of the circle. Named sizes map to `18` / `28` / `34` px respectively. A number sets an exact pixel size. |

## Usage

```tsx
import { Avatar } from '@anupheaus/react-ui';

// Gravatar with initials fallback
<Avatar emailAddress="user@example.com" initials="JD" size="medium" />

// Derived initials from display name
<Avatar displayName="Jane Doe" size="large" />

// Plain icon avatar
<Avatar size={40} />
```

---

[← Back to Components](../AGENTS.md)
