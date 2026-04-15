# EmailProvider

Provides a type-safe system for defining React email templates, triggering sends from anywhere in the component tree, and receiving rendered HTML + metadata in a custom callback.

[← Back to Providers](../README.md)

---

## Usage

### 1. Mount EmailProvider

Place `EmailProvider` high in the component tree with an `onSend` callback that handles actual delivery:

```tsx
<EmailProvider
  onSend={async ({ to, cc, bcc, from, alias, subject, replyTo, html, props }) => {
    await myEmailService.send({ to, cc, bcc, from, alias, subject, replyTo, html });
    // props contains the template args, e.g. ['order-123', 'Alice'] for OrderEmail
  }}
>
  {children}
</EmailProvider>
```

### 2. Define email templates with createEmail

The definition receives utility components (`Email`, `Body`) and returns a curried function — the same pattern as `createWindow`/`createDialog`. The `Email` component accepts a `subject` prop that becomes the email subject:

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

### 3. Send emails with useEmail

`useEmail` returns a single typed `email()` function. The send-time props object is always the last argument, after the template's own args:

```tsx
const email = useEmail(OrderEmail);

// Minimal:
await email('order-123', 'Alice', { to: 'alice@example.com' });

// With all options:
await email('order-123', 'Alice', {
  to: ['alice@example.com', 'bob@example.com'],
  cc: 'manager@example.com',
  bcc: 'audit@example.com',
  from: 'orders@myapp.com',
  alias: 'Orders Team',        // friendly display name: "Orders Team" <orders@myapp.com>
  subject: 'Urgent: check your order',  // overrides <Email subject={...} />
  replyTo: 'support@myapp.com',
});
```

---

## Send-time props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `to` | `string \| string[]` | yes | Recipient address(es). |
| `cc` | `string \| string[]` | no | Carbon copy address(es). |
| `bcc` | `string \| string[]` | no | Blind carbon copy address(es). |
| `from` | `string` | no | Sender email address. |
| `alias` | `string` | no | Friendly display name for the sender (e.g. `"Orders Team"`). Renders as `Orders Team <orders@myapp.com>`. |
| `subject` | `string` | no | Overrides the subject set on `<Email subject={...} />`. |
| `replyTo` | `string` | no | Reply-to address. |

## onSend payload

The `onSend` callback receives an `EmailSendPayload`:

| Field | Type | Description |
|-------|------|-------------|
| `html` | `string` | Fully rendered HTML string produced from the template. |
| `subject` | `string` | Resolved: send-time `subject` override if provided, otherwise the value from `<Email subject={...} />`. |
| `to` | `string \| string[]` | From send-time props. |
| `cc` | `string \| string[]` | From send-time props. |
| `bcc` | `string \| string[]` | From send-time props. |
| `from` | `string` | From send-time props. |
| `alias` | `string` | From send-time props. |
| `replyTo` | `string` | From send-time props. |
| `props` | `unknown[]` | The template args passed to `email()`, in the order they were defined in `createEmail`. Useful for logging, auditing, or passing to your email service. |

## Notes

- `useEmail` must be called within an `<EmailProvider>` — calling `email()` outside one throws with a clear message.
- HTML rendering uses `flushSync` + `createRoot` into a temporary off-screen DOM node; no extra dependencies are needed beyond `react-dom`.
- Email styling (inline styles, table layouts, etc.) is the consumer's responsibility within their template content.
- `onSend` errors propagate: if `onSend` rejects, the `email()` promise rejects with the same error.
