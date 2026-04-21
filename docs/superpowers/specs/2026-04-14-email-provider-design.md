# Email Provider Design

**Date:** 2026-04-14
**Status:** Approved

---

## Overview

A lightweight email provider for `@anupheaus/react-ui` that follows the surface API shape of the existing Window/Dialog system (`createEmail`, `useEmail`, `EmailProvider`) without the heavyweight manager/registry infrastructure, since emails are fire-and-forget rather than lifecycle-managed UI elements.

Emails are defined as typed React templates via `createEmail`, triggered via a `email()` function returned by `useEmail`, and dispatched through an `EmailProvider` that sits high in the component tree and owns the actual send logic.

---

## Architecture

### Approach: Lightweight context dispatch

- `createEmail` returns a typed token (no global registry).
- `EmailProvider` exposes a send dispatcher via React context.
- `useEmail(template)` reads the context and returns a typed `email()` function.
- When `email()` is called, it renders the JSX to an HTML string client-side using `flushSync` + `createRoot`, then invokes the `onSend` callback from the provider.

### Why not mirror the Window/Dialog manager pattern

The Window/Dialog system carries persistence, open/close/focus lifecycle, state management, and multi-instance tracking — none of which apply to email. Option B (lightweight context dispatch) is the right amount of complexity.

---

## File Structure

```
src/providers/EmailProvider/
  EmailModels.ts        — shared types and interfaces
  EmailContexts.ts      — React context definition
  createEmail.tsx       — creates the typed template token
  useEmail.tsx          — hook returning the typed send function
  EmailProvider.tsx     — provider component with onSend callback
  index.ts              — public exports
  AGENTS.md             — usage documentation
```

---

## Components & API

### `createEmail`

Defines a named email template. The definition receives utility components (`Email`, `Body`) and returns a curried render function. Follows the same curried pattern as `createWindow`/`createDialog`.

```ts
export function createEmail<Name extends string, Args extends unknown[]>(
  name: Name,
  definition: EmailDefinition<Args>,
): ReactUIEmail<Name, Args>
```

**Example:**

```tsx
const OrderEmail = createEmail('OrderEmail', ({ Email, Body }) =>
  (orderId: string, customerName: string) => (
    <Email subject={`Order #${orderId} confirmed`}>
      <Body>
        <p>Hi {customerName}, your order is confirmed.</p>
      </Body>
    </Email>
  )
);
```

The return value (`ReactUIEmail`) is a typed token object containing `name` and `definition`. There is no global registry — the token is passed directly to `useEmail`.

### Utility components provided to the definition

| Component | Props | Purpose |
|-----------|-------|---------|
| `Email` | `subject: string`, `children: ReactNode` | Outer wrapper. The `subject` prop is captured during render and used as the email subject (overridable at send-time). |
| `Body` | `children: ReactNode` | Content area wrapper. Renders children directly. |

### `useEmail`

Reads the `EmailProvider` context and returns a single typed `email()` function bound to the provided template.

```ts
export function useEmail<Name extends string, Args extends unknown[]>(
  template: ReactUIEmail<Name, Args>,
): EmailSendFunction<Args>
```

The returned `email()` function signature is:

```ts
(...args: [...Args, EmailSendProps]) => Promise<void>
```

`EmailSendProps` is always the last argument.

**Example:**

```ts
const email = useEmail(OrderEmail);

await email('order-123', 'Alice', {
  to: 'alice@example.com',
});

// With full overrides:
await email('order-123', 'Alice', {
  to: ['alice@example.com', 'bob@example.com'],
  cc: 'manager@example.com',
  bcc: 'audit@example.com',
  from: 'orders@myapp.com',
  alias: 'Orders Team',
  subject: 'Urgent: your order',  // overrides <Email subject={...} />
  replyTo: 'support@myapp.com',
});
```

### `EmailSendProps`

```ts
export interface EmailSendProps {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  alias?: string;       // friendly display name for the sender, e.g. "Orders Team" <orders@myapp.com>
  subject?: string;     // overrides the subject set on <Email subject={...} />
  replyTo?: string;
}
```

`to` is the only required field. All others are optional — the `onSend` callback is responsible for applying its own defaults for anything omitted.

### `EmailProvider`

Sits high in the component tree. Its `onSend` callback receives the fully resolved payload including the rendered HTML string.

```tsx
<EmailProvider
  onSend={async ({ to, cc, bcc, from, alias, subject, replyTo, html }) => {
    await myEmailService.send({ to, cc, bcc, from, alias, subject, replyTo, html });
  }}
>
  {children}
</EmailProvider>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | yes | Component tree. |
| `onSend` | `(payload: EmailSendPayload) => Promise<void>` | yes | Called when any `email()` function is invoked anywhere in the tree. |

### `EmailSendPayload`

The object passed to `onSend`:

```ts
export interface EmailSendPayload extends EmailSendProps {
  html: string;     // fully rendered HTML string
  subject: string;  // resolved: send-time override ?? template subject
}
```

---

## HTML Rendering

When `email()` is called, the following steps occur synchronously before `onSend` is invoked:

1. **Capture subject** — fresh `Email` and `Body` component instances are created for this render. The `Email` component writes its `subject` prop to a local mutable ref during render.
2. **Render to DOM** — `flushSync(() => root.render(element))` renders the template JSX into a temporary off-screen `<div>` (not attached to the document).
3. **Extract HTML** — `container.innerHTML` is read after `flushSync` returns.
4. **Unmount** — `root.unmount()` cleans up immediately.
5. **Resolve subject** — `sendProps.subject ?? capturedSubject`.
6. **Dispatch** — `onSend({ html, subject, to, cc, bcc, from, alias, replyTo })` is awaited.

The temporary container is created via `document.createElement('div')` and never appended to the document, so it has no visual side-effects.

No additional dependencies are required — only `react-dom` (already a project dependency).

---

## TypeScript

The type system enforces that the template args and send props are all present and correctly typed:

```ts
// Template defined with (orderId: string, customerName: string)
const email = useEmail(OrderEmail);

email('123', 'Alice', { to: 'a@b.com' });         // ✓
email('123', { to: 'a@b.com' });                   // ✗ missing customerName
email('123', 'Alice');                             // ✗ missing EmailSendProps
email('123', 'Alice', { });                        // ✗ missing required `to`
```

Key types:

```ts
export type EmailDefinition<Args extends unknown[]> =
  (utils: EmailDefinitionUtils) => (...args: Args) => JSX.Element | null;

export type ReactUIEmail<Name extends string, Args extends unknown[]> = {
  readonly name: Name;
  readonly definition: EmailDefinition<Args>;
};

export type EmailSendFunction<Args extends unknown[]> =
  (...args: [...Args, EmailSendProps]) => Promise<void>;

export interface EmailDefinitionUtils {
  Email: ComponentType<{ subject: string; children?: ReactNode }>;
  Body: ComponentType<{ children?: ReactNode }>;
}
```

---

## Error Handling

- If `useEmail` is called outside of an `EmailProvider`, it throws with a clear message.
- If the template's `<Email>` component is not rendered (subject not captured), `onSend` receives `subject: ''` rather than throwing — the `onSend` implementation is responsible for validating.
- `onSend` errors propagate: if `onSend` rejects, the `email()` promise rejects with the same error.

---

## Styling

All components in this provider follow the project-wide rule: `createStyles` + `className` only. No inline `style` props. In practice, `Email` and `Body` are structural wrappers with minimal or no styling — email styling is the consumer's responsibility via className or inline styles within their template content.

---

## Out of Scope

- Email previewing / rendering in the UI
- Attachment support
- Template persistence or queuing
- Multiple `EmailProvider` instances / scoping
