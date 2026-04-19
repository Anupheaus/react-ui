# QRCode

Renders a styled QR code using `qr-code-styling`. Visual appearance (colours, dot and corner shapes) is driven by `theme.qrCode`. An optional logo — image or icon — is centred over the code.

[← Back to components](../README.md)

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'url' \| 'text' \| 'object' \| 'email' \| 'phone' \| 'sms' \| 'wifi' \| 'vcard' \| 'geo'` | — | Data type (discriminated union) |
| `value` | varies by `type` | — | Data to encode |
| `logo` | `QRCodeLogo` | `undefined` | Optional logo centred over the QR code |
| `size` | `number` | `256` | Width and height in pixels |
| `className` | `string` | `undefined` | Additional CSS class |

## `QRCodeLogo`

```ts
type QRCodeLogo =
  | { type: 'image'; src: string }
  | { type: 'icon';  name: string }
```

## Data types

| `type` | `value` shape | Encoded format |
|--------|---------------|---------------|
| `url` | `string` | as-is |
| `text` | `string` | as-is |
| `object` | `AnyObject` | `JSON.stringify` |
| `email` | `{ to, subject?, body? }` | `mailto:to?subject=...` |
| `phone` | `string` | `tel:number` |
| `sms` | `{ to, message? }` | `smsto:to:message` |
| `wifi` | `{ ssid, password?, security? }` | `WIFI:T:WPA;S:...;;` |
| `vcard` | `{ name, phone?, email?, org?, url?, address? }` | `BEGIN:VCARD...` |
| `geo` | `{ lat, lng }` | `geo:lat,lng` |

## Theme

Add `qrCode` to your theme to customise appearance:

```ts
qrCode: {
  foregroundColor: '#1e88e5',
  backgroundColor: '#ffffff',
  dotStyle: 'rounded',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
}
```

### Style options

| Property | Options | Default |
|----------|---------|---------|
| `dotStyle` | `'square'` `'dots'` `'rounded'` `'classy'` `'classy-rounded'` `'extra-rounded'` | `'square'` |
| `cornerSquareStyle` | `'none'` `'square'` `'dot'` `'extra-rounded'` | `'none'` |
| `cornerDotStyle` | `'none'` `'square'` `'dot'` | `'none'` |

`'none'` leaves the corner styling at the library default (unset).

## Example

```tsx
<QRCode type="url" value="https://example.com" size={256} />

<QRCode
  type="wifi"
  value={{ ssid: 'MyNetwork', password: 'secret', security: 'WPA' }}
  logo={{ type: 'icon', name: 'help' }}
/>
```
