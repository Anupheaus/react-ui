# QRCode Component Design

**Date:** 2026-04-19
**Library:** `qr-code-styling`

---

## Overview

A `QRCode` React component that renders a styled QR code with optional logo overlay. Styling (colours, dot/corner shapes) comes entirely from the theme. Data type is expressed as a discriminated union so consumers specify the correct shape per type.

---

## File Layout

```
src/components/QRCode/
  QRCodeModels.ts       — types: QRCodeData, QRCodeLogo, QRCodeTheme
  QRCode.tsx            — main component
  QRCode.stories.tsx    — Storybook stories
  QRCode.tests.tsx      — Vitest tests
  index.ts              — public exports
  AGENTS.md             — component documentation
```

The component is added to `src/components/AGENTS.md` under a "Media & Display" group alongside `Image` and `Avatar`.

---

## Props API

```ts
type QRCodeData =
  | { type: 'url';    value: string }
  | { type: 'text';   value: string }
  | { type: 'object'; value: AnyObject }
  | { type: 'email';  value: { to: string; subject?: string; body?: string } }
  | { type: 'phone';  value: string }
  | { type: 'sms';    value: { to: string; message?: string } }
  | { type: 'wifi';   value: { ssid: string; password?: string; security?: 'WPA' | 'WEP' | 'none' } }
  | { type: 'vcard';  value: { name: string; phone?: string; email?: string; org?: string; url?: string; address?: string } }
  | { type: 'geo';    value: { lat: number; lng: number } }

type QRCodeLogo =
  | { type: 'image'; src: string }
  | { type: 'icon';  name: string }

type Props = QRCodeData & {
  logo?: QRCodeLogo;
  size?: number;       // defaults to 256
  className?: string;
}
```

No `qrStyles` prop — all visual configuration comes from `theme.qrCode`.

---

## Theme Integration

### `ThemeModel.ts` — new interface and field

```ts
interface QRCodeTheme {
  foregroundColor?: string;
  backgroundColor?: string;
  dotStyle?: 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
  cornerSquareStyle?: 'square' | 'dot' | 'extra-rounded';
  cornerDotStyle?: 'square' | 'dot';
}

// Added to Theme interface:
qrCode?: QRCodeTheme;
```

### `DefaultTheme.ts` — default values

```ts
qrCode: {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerDotStyle: 'square',
},
```

### Usage in component

`useStyles()` returns `theme`, so the component reads `theme.qrCode` directly to configure `qr-code-styling` — no CSS classes needed for these values.

---

## Encoders

A pure `encodeQRData(data: QRCodeData): string` function with one case per type:

| Type | Encoded format |
|------|---------------|
| `url` | value as-is |
| `text` | value as-is |
| `object` | `JSON.stringify(value)` |
| `email` | `mailto:to?subject=...&body=...` |
| `phone` | `tel:value` |
| `sms` | `smsto:to:message` (Android-style; most QR scanner apps normalise this) |
| `wifi` | `WIFI:T:WPA;S:ssid;P:pass;;` (security defaults to `none` if omitted) |
| `vcard` | `BEGIN:VCARD\nVERSION:3.0\n...\nEND:VCARD` |
| `geo` | `geo:lat,lng` |

---

## qr-code-styling Wrapper

- A `div` ref is used as the mount target.
- On mount: instantiate `QRCodeStyling` and call `.append(ref.current)`.
- On change (encoded string, size, or theme values): call `.update(options)`.
- Cleanup on unmount: remove the appended element.

---

## Logo Overlay

The logo is rendered as a React element absolutely centred over the QR `div`, using `position: absolute` with `top/left/transform` centering via `createStyles`.

- `type: 'image'` → `<img src={logo.src} />`
- `type: 'icon'` → `<Icon name={logo.name} />`

Size: ~20% of the QR code `size` prop, preserving scan reliability (QR error correction capacity is ~30%).

The outer container uses `position: relative` to establish the stacking context.

---

## Stories (`QRCode.stories.tsx`)

- URL type (default)
- One story per data type: text, object, email, phone, sms, wifi, vcard, geo
- With image logo
- With icon logo
- Custom sizes (128, 256, 512)

---

## Tests (`QRCode.tests.tsx`)

- `encodeQRData` — one test per data type verifying the correct format string
- Renders without crashing for each data type
- Logo overlay renders for `image` and `icon` logo types
- Defaults to size 256 when no `size` prop is provided
- Theme values are passed through to the `qr-code-styling` instance
