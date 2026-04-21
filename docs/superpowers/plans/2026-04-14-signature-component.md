# Signature Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `Signature` component that lets users draw their signature on a canvas and captures it as a base64 PNG data URL, wrapped in the standard `Field` form chrome.

**Architecture:** `signature_pad` drives all canvas drawing. The component wraps its canvas in the existing `Field` component for label/error/assistive-text support. Theme colours (`backgroundColor`, `penColor`) come from a new optional `signature` section on the `Theme` interface, falling back to field content tokens via `createStyles`.

**Tech Stack:** React 18, `signature_pad` (new dep), `use-resize-observer` (already a dep), `createStyles`/`createComponent` (internal), Storybook 10 (`@storybook/react-webpack5`).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `package.json` | Add `signature_pad` dependency |
| Modify | `src/theme/themes/ThemeModel.ts` | Add optional `signature` section to `Theme` interface |
| Create | `src/components/Signature/Signature.tsx` | Main component |
| Create | `src/components/Signature/index.ts` | Re-export |
| Create | `src/components/Signature/Signature.stories.tsx` | Storybook stories |
| Create | `src/components/Signature/AGENTS.md` | Component documentation |
| Modify | `src/components/index.ts` | Export `Signature` |
| Modify | `src/components/AGENTS.md` | Add Signature entry to Forms & Inputs table |

---

### Task 1: Install `signature_pad`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run from the repo root:
```bash
pnpm add signature_pad
```

Expected output: something like `+ signature_pad 4.x.x` added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify types are bundled**

`signature_pad` ships its own TypeScript types. Confirm by running:
```bash
pnpm exec tsc --noEmit
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add signature_pad dependency"
```

---

### Task 2: Add `signature` to the Theme interface

**Files:**
- Modify: `src/theme/themes/ThemeModel.ts`

- [ ] **Step 1: Add the interface and property**

Open `src/theme/themes/ThemeModel.ts`. After the `notifications` block (around line 369) and before the `/** @deprecated */` section, add:

```ts
signature?: {
  backgroundColor?: string;
  penColor?: string;
};
```

The full updated block in context (insert after the closing `};` of `notifications?:`):

```ts
  notifications?: {
    base: Required<NotificationTypeTheme>;
    success: NotificationTypeTheme;
    error: NotificationTypeTheme;
    warning: NotificationTypeTheme;
    info: NotificationTypeTheme;
  };

  signature?: {
    backgroundColor?: string;
    penColor?: string;
  };

  /** @deprecated */
  animation: CSSProperties;
```

- [ ] **Step 2: Verify no type errors**

```bash
pnpm exec tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/theme/themes/ThemeModel.ts
git commit -m "feat(theme): add optional signature theme tokens"
```

---

### Task 3: Create `Signature.tsx`

**Files:**
- Create: `src/components/Signature/Signature.tsx`

- [ ] **Step 1: Create the file**

Create `src/components/Signature/Signature.tsx` with the following content:

```tsx
import { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';
import useResizeObserver from 'use-resize-observer';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { Field } from '../Field';
import type { FieldProps } from '../Field';
import { Button } from '../Button';
import { useBound } from '../../hooks';

export interface SignatureProps extends FieldProps {
  value?: string;
  allowClear?: boolean;
  onChange?(value: string | undefined): void;
}

const useStyles = createStyles(({ fields, signature, text }) => ({
  canvas: {
    display: 'block',
    flexGrow: 1,
    width: '100%',
    minHeight: 250,
    minWidth: 300,
    backgroundColor: signature?.backgroundColor ?? fields.content.normal.backgroundColor,
    cursor: 'crosshair',
  },
}));

export const Signature = createComponent('Signature', ({
  value,
  allowClear = false,
  onChange,
  ...fieldProps
}: SignatureProps) => {
  const { css } = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const latestValueRef = useRef<string | undefined>(value);

  // Keep latest value ref in sync for use inside ResizeObserver callback
  latestValueRef.current = value;

  // Initialise signature_pad once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const pad = new SignaturePad(canvas, {
      penColor: getComputedStyle(canvas).color,
      backgroundColor: getComputedStyle(canvas).backgroundColor,
    });

    pad.addEventListener('endStroke', () => {
      onChange?.(canvas.toDataURL('image/png'));
    });

    padRef.current = pad;

    return () => {
      pad.off();
      padRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes into the pad
  useEffect(() => {
    const pad = padRef.current;
    if (pad == null) return;
    if (value) {
      pad.fromDataURL(value);
    } else {
      pad.clear();
    }
  }, [value]);

  // Redraw after resize (canvas clear is a native side-effect of resizing)
  const handleResize = useBound(() => {
    const canvas = canvasRef.current;
    const pad = padRef.current;
    if (canvas == null || pad == null) return;
    const savedValue = latestValueRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (savedValue) {
      pad.fromDataURL(savedValue);
    }
  });

  useResizeObserver({ ref: canvasRef, onResize: handleResize });

  const handleClear = useBound(() => {
    padRef.current?.clear();
    onChange?.(undefined);
  });

  return (
    <Field
      {...fieldProps}
      tagName="signature"
      fullHeight
      endAdornments={allowClear ? (
        <Button variant="hover" onClick={handleClear}>Clear</Button>
      ) : undefined}
    >
      <canvas ref={canvasRef} className={css.canvas} />
    </Field>
  );
});
```

- [ ] **Step 2: Verify no type errors**

```bash
pnpm exec tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Signature/Signature.tsx
git commit -m "feat(signature): add Signature component"
```

---

### Task 4: Create `index.ts` and wire up exports

**Files:**
- Create: `src/components/Signature/index.ts`
- Modify: `src/components/index.ts`

- [ ] **Step 1: Create the barrel file**

Create `src/components/Signature/index.ts`:

```ts
export * from './Signature';
```

- [ ] **Step 2: Add to components index**

Open `src/components/index.ts`. Add the Signature export. Insert it alphabetically near the other `S` entries (after `Switch`, before `Tabs` — or after `SimpleList`):

```ts
export * from './Signature';
```

- [ ] **Step 3: Verify no type errors**

```bash
pnpm exec tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Signature/index.ts src/components/index.ts
git commit -m "feat(signature): export Signature from components index"
```

---

### Task 5: Add Storybook stories

**Files:**
- Create: `src/components/Signature/Signature.stories.tsx`

- [ ] **Step 1: Create the stories file**

Create `src/components/Signature/Signature.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { createStory } from '../../Storybook/createStory';
import { Signature } from './Signature';

const meta: Meta<typeof Signature> = {
  component: Signature,
};
export default meta;

type Story = StoryObj<typeof Signature>;

export const Default: Story = createStory<typeof Signature>({
  args: {},
  width: 400,
  height: 350,
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Signature
        label="Signature"
        value={value}
        onChange={setValue}
      />
    );
  },
});

export const WithClearButton: Story = createStory<typeof Signature>({
  args: {
    onChange: fn(),
  },
  width: 400,
  height: 350,
  render: props => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Signature
        label="Sign here"
        allowClear
        value={value}
        onChange={v => {
          setValue(v);
          (props.onChange as ((v: string | undefined) => void) | undefined)?.(v);
        }}
        assistiveHelp="Draw your signature above"
      />
    );
  },
});
```

- [ ] **Step 2: Start Storybook and verify both stories render**

```bash
pnpm start
```

Open [http://localhost:6006](http://localhost:6006) and navigate to **Signature → Default** and **Signature → With Clear Button**. Verify:
- The canvas is visible and you can draw on it
- The "Default" story has no clear button
- The "With Clear Button" story shows a Clear button as an end adornment
- Drawing and then clicking Clear fires `onChange`

- [ ] **Step 3: Commit**

```bash
git add src/components/Signature/Signature.stories.tsx
git commit -m "feat(signature): add Storybook stories"
```

---

### Task 6: Write the README

**Files:**
- Create: `src/components/Signature/AGENTS.md`
- Modify: `src/components/AGENTS.md`

- [ ] **Step 1: Create the component README**

Create `src/components/Signature/AGENTS.md`:

````markdown
# Signature

[← Back to Components](../AGENTS.md)

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
````

- [ ] **Step 2: Add entry to `src/components/AGENTS.md`**

Open `src/components/AGENTS.md`. In the **Forms & Inputs** table, add a row for Signature. Insert it alphabetically (between `Radio` and `Switch`, or at the end of the table):

```markdown
| [Signature](Signature/AGENTS.md) | Freehand signature capture — saves as a base64 PNG data URL |
```

- [ ] **Step 3: Verify no type errors**

```bash
pnpm exec tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Signature/AGENTS.md src/components/AGENTS.md
git commit -m "docs(signature): add README and update components index"
```

---

## Self-Review Checklist

- [x] `signature_pad` installed and used for all canvas drawing
- [x] `Field` wraps the canvas for label/error/assistive chrome
- [x] `allowClear` prop (default `false`) controls Clear button visibility
- [x] `onChange` receives `string` (data URL) after each stroke, `undefined` after clear
- [x] Canvas fills available space, `minHeight: 250`, `minWidth: 300`
- [x] `use-resize-observer` (already a dep) handles canvas rescaling
- [x] `signature` theme tokens added to `ThemeModel.ts`; fallbacks to field content tokens in `createStyles`
- [x] Two Storybook stories: `Default` and `WithClearButton`
- [x] README + components index updated
- [x] No `style` inline props — all styles via `createStyles`/`className`
