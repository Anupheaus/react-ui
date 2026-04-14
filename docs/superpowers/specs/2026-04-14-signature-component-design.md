# Signature Component — Design Spec

**Date:** 2026-04-14
**Status:** Approved

---

## Overview

A `Signature` component that lets a user draw their signature on a canvas and captures it as a base64 PNG data URL. Wraps the standard `Field` component for consistent form chrome (label, error, assistive text, optional marker). Uses the `signature_pad` library for canvas drawing.

---

## Files

```
src/components/Signature/
  Signature.tsx           — main component
  Signature.stories.tsx   — Storybook stories
  index.ts                — re-exports
  README.md               — documentation
src/theme/themes/ThemeModel.ts  — add signature section (modified)
src/components/README.md        — add Signature entry (modified)
```

No separate `SignatureTheme.ts` file. All theme consumption is done inside `Signature.tsx` via `createStyles`.

---

## Component API

```ts
interface SignatureProps extends FieldProps {
  value?: string;        // base64 data URL (data:image/png;base64,...) or undefined
  allowClear?: boolean;  // default: false — renders a Clear button when true
  onChange?(value: string | undefined): void;
}
```

`FieldProps` provides: `label`, `error`, `assistiveHelp`, `isOptional`, `hideOptionalLabel`, `help`, `wide`, `className`, `ref`.

---

## Theme

Add an optional `signature` section to the `Theme` interface in `ThemeModel.ts`:

```ts
signature?: {
  backgroundColor?: string;  // canvas background colour
  penColor?: string;          // stroke colour
};
```

Fallbacks applied inside `createStyles` in `Signature.tsx`:

- `backgroundColor` → `signature?.backgroundColor ?? fields.content.normal.backgroundColor`
- `penColor` → `signature?.penColor ?? fields.content.normal.textColor`

---

## Layout & Sizing

- The `Field` wrapper receives `fullHeight` and `wide` to let it expand.
- The canvas element uses `createStyles` with:
  - `width: '100%'`
  - `flexGrow: 1`
  - `minHeight: 250px`
  - `minWidth: 300px`
- Canvas fills available width/height; a `ResizeObserver` watches the canvas container and calls `signaturePad.clear()` then re-draws the existing value whenever the canvas dimensions change (this is required because resizing a canvas element clears it natively).

---

## Drawing

- `signature_pad` is initialised in a `useEffect` with a ref to the `<canvas>` element.
- `penColor` and `backgroundColor` are read from the theme (with fallbacks) and passed to the `SignaturePad` constructor options.
- On each completed stroke (`afterUpdateStroke` event), `canvas.toDataURL('image/png')` is called and the result passed to `onChange`.
- `signature_pad` instance is stored in a `useRef` for imperative access (clear, fromDataURL).

---

## Value Sync

- When `value` changes externally:
  - If `value` is a non-empty string: call `signaturePad.fromDataURL(value)` to render it onto the canvas.
  - If `value` is `undefined` or empty: call `signaturePad.clear()`.
- This sync runs in a `useEffect` dependent on `value`.

---

## Clear Button

- When `allowClear` is `true`, a `Button` is passed as `endAdornments` to `Field`.
- Clicking it calls `signaturePad.clear()` and fires `onChange(undefined)`.
- When `allowClear` is `false` (default), no button is rendered.

---

## ResizeObserver Rescaling

- A `ResizeObserver` is attached to the canvas element in a `useEffect`.
- On resize: store the current `value` ref locally, resize the canvas (set `canvas.width` / `canvas.height` to `offsetWidth` / `offsetHeight`), then re-draw from the stored value via `signaturePad.fromDataURL(...)`.
- Observer is disconnected on unmount.

---

## Storybook

Two stories in `Signature.stories.tsx` using `createStory`:

1. **Default** — empty signature pad, no value, no clear button.
2. **WithClearButton** — `allowClear={true}`, pre-loaded with a sample base64 PNG value, demonstrates the clear button.

---

## README

A `README.md` in `src/components/Signature/` documenting:
- Purpose
- Props table (including inherited `FieldProps`)
- Theme tokens
- Usage example

`src/components/README.md` gains a `Signature` entry in the **Forms & Inputs** table.

---

## Dependencies

- `signature_pad` npm package must be added to `package.json`.
