# Signature

[← Back to Components](../README.md)

A form field that lets the user draw their signature on a canvas and captures it as a base64 PNG data URL. Wraps the standard `Field` component for consistent label, error, and assistive-text chrome.

---

## Usage

```tsx
import { Signature } from '@anupheaus/react-ui';

function MyForm() {
  const [sig, setSig] = useState<string | undefined>(undefined);
  return (
    <Signature
      label="Your signature"
      value={sig}
      onChange={setSig}
    />
  );
}
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| undefined` | `undefined` | Base64 PNG data URL of the current signature |
| `allowClear` | `boolean` | `false` | When `true`, renders a Clear button that wipes the canvas and calls `onChange(undefined)` |
| `onChange` | `(value: string \| undefined) => void` | — | Called with the new data URL after each stroke, or `undefined` after a clear |
| `label` | `ReactNode` | — | Field label (from `FieldProps`) |
| `error` | `ReactNode` | — | Validation error shown below the field (from `FieldProps`) |
| `assistiveHelp` | `ReactNode` | — | Assistive text shown below the field (from `FieldProps`) |
| `isOptional` | `boolean` | — | Shows an "(optional)" marker next to the label (from `FieldProps`) |
| `wide` | `boolean` | — | Stretches the field to full width (from `FieldProps`) |
| `className` | `string` | — | Extra CSS class on the outermost element (from `FieldProps`) |

---

## Theme Tokens

Add a `signature` key to your theme to override the canvas colours:

```ts
// In your createTheme call
signature: {
  backgroundColor: '#f5f5f5', // canvas fill colour (default: field content background)
  penColor: '#1a1a1a',         // stroke colour (default: field content text colour)
}
```

If either token is omitted the component falls back to `fields.content.normal.backgroundColor` and `fields.content.normal.textColor` respectively.

---

## Behaviour

- The canvas grows to fill available space with a minimum size of 300 × 250 px.
- When the container resizes, the canvas is rescaled and the current signature redrawn automatically.
- Setting `value` externally renders the image onto the canvas; setting it to `undefined` clears the canvas.
