# InternalText

> **Internal component** — not intended for direct consumer use. Public text-based inputs (`Text`, `Number`, `Password`, `Email`, `PhoneNumber`, etc.) are built on top of this component. It is documented here because it defines the shared API and behaviour for all text input variants.

`InternalText` renders either an `<input>` or a `<textarea>` (when `multiline > 1`) inside the standard `Field` container. It handles validation, read-only state, text transformation, password-manager suppression, and the `Enter` key event.

## Props

### Required by the implementation (not exposed on public wrappers)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tagName` | `string` | Yes | DOM tag name used for the root element |
| `type` | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url'` | Yes | HTML input type |

### Public surface (`InternalTextProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `TValue` | No | Current input value |
| `ref` | `Ref<HTMLInputElement>` | No | Ref forwarded to the underlying `<input>` element |
| `initialFocus` | `boolean` | No | Auto-focuses the input on mount when `true` |
| `placeholder` | `string` | No | Placeholder text |
| `maxLength` | `number` | No | Maximum number of characters |
| `transform` | `'uppercase' \| 'lowercase' \| 'capitalize' \| 'none'` | No | CSS text transform applied to the input. Defaults to `'none'` |
| `fieldWidth` | `number \| string` | No | Width applied to the field container (distinct from the outer `width` prop) |
| `endAdornments` | `ReactNode` | No | Content rendered after the input (e.g. clear button, unit label) |
| `useFloatingEndAdornments` | `boolean` | No | Render end adornments as floating overlays |
| `startAdornments` | `ReactNode` | No | Content rendered before the input |
| `useFloatingStartAdornments` | `boolean` | No | Render start adornments as floating overlays |
| `invalidValueMessage` | `ReactNode` | No | Error message for an invalid value |
| `isOptional` | `boolean` | No | Marks the field as optional; suppresses the required validation |
| `requiredMessage` | `ReactNode` | No | Validation message when the field is empty and required |
| `label` | `ReactNode` | No | Field label |
| `help` | `ReactNode` | No | Help tooltip content |
| `error` | `ReactNode` | No | External error message |
| `assistiveHelp` | `ReactNode` | No | Secondary help text |
| `wide` | `boolean` | No | Grow to fill available width |
| `width` | `string \| number` | No | Explicit component width |
| `onChange` | `(value: TValue) => void` | No | Called with the new value on every keystroke |
| `onFocus` | `(event: FocusEvent<HTMLInputElement>) => void` | No | Called when the input receives focus |
| `onBlur` | `(event: FocusEvent<HTMLInputElement>) => void` | No | Called when the input loses focus. Also triggers validation error display |
| `onClick` | `(event: MouseEvent<HTMLInputElement>) => void` | No | Called on click |
| `onKeyDown` | `(event: KeyboardEvent<HTMLInputElement>) => void` | No | Called on key-down. For `type="number"`, `e`, `.` (when `allowDecimals` is false), and `-` (when `allowNegatives` is false) are blocked before this fires |
| `onKeyUp` | `(event: KeyboardEvent<HTMLInputElement>) => void` | No | Called on key-up |
| `onEnter` | `(event: KeyboardEvent<HTMLInputElement>) => void` | No | Convenience handler called when the user presses Enter |

### Additional internal props (not on `InternalTextProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `multiline` | `number` | No | Number of visible rows. When `> 1` a `<textarea>` is rendered instead of `<input>` |
| `allowDecimals` | `boolean` | No | Allow `.` in `type="number"` inputs. Defaults to `false` |
| `allowNegatives` | `boolean` | No | Allow `-` in `type="number"` inputs. Defaults to `false` |
| `inputClassName` | `string` | No | Extra CSS class applied directly to the `<input>` or `<textarea>` element |

---

[← Back to Components](../README.md)
