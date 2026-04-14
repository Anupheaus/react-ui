# EmailProvider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `createEmail` / `useEmail` / `EmailProvider` system that lets consumers define typed React email templates, trigger sends from anywhere in the tree, and receive rendered HTML + metadata in a single `onSend` callback.

**Architecture:** Lightweight context dispatch — `createEmail` returns a typed token with no global registry, `EmailProvider` exposes a `send` function via React context, and `useEmail` renders the template to an HTML string using `flushSync` + `createRoot` before calling `onSend`. The subject is captured from the `<Email subject={...} />` component during render and can be overridden at send-time.

**Tech Stack:** React 18, TypeScript, `react-dom/client` (`createRoot`), `react-dom` (`flushSync`), `createComponent` + `useBound` from this codebase, Jest + React Testing Library + jsdom.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/providers/EmailProvider/EmailModels.ts` | All shared types and interfaces |
| Create | `src/providers/EmailProvider/EmailContexts.ts` | React context + `EmailContextValue` |
| Create | `src/providers/EmailProvider/createEmail.tsx` | `createEmail` function |
| Create | `src/providers/EmailProvider/EmailProvider.tsx` | `EmailProvider` component |
| Create | `src/providers/EmailProvider/useEmail.tsx` | `useEmail` hook |
| Create | `src/providers/EmailProvider/EmailProvider.tests.tsx` | All tests |
| Create | `src/providers/EmailProvider/index.ts` | Public barrel exports |
| Create | `src/providers/EmailProvider/README.md` | Usage documentation |
| Modify | `src/providers/index.ts` | Add `EmailProvider` to providers barrel |
| Modify | `src/providers/README.md` | Add `EmailProvider` row to table |

---

## Task 1: Types — EmailModels.ts

**Files:**
- Create: `src/providers/EmailProvider/EmailModels.ts`

- [ ] **Step 1: Create the types file**

Create `src/providers/EmailProvider/EmailModels.ts`:

```ts
import type { ComponentType, ReactNode } from 'react';

export interface EmailSendProps {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  alias?: string;
  subject?: string;
  replyTo?: string;
}

export interface EmailSendPayload extends Omit<EmailSendProps, 'subject'> {
  subject: string;
  html: string;
}

export interface EmailDefinitionUtils {
  Email: ComponentType<{ subject: string; children?: ReactNode }>;
  Body: ComponentType<{ children?: ReactNode }>;
}

export type EmailDefinition<Args extends unknown[]> =
  (utils: EmailDefinitionUtils) => (...args: Args) => JSX.Element | null;

export type ReactUIEmail<Name extends string, Args extends unknown[]> = {
  readonly name: Name;
  readonly definition: EmailDefinition<Args>;
};

export type EmailSendFunction<Args extends unknown[]> =
  (...args: [...Args, EmailSendProps]) => Promise<void>;
```

- [ ] **Step 2: Commit**

```bash
git add src/providers/EmailProvider/EmailModels.ts
git commit -m "feat(email): add EmailProvider type definitions"
```

---

## Task 2: Context — EmailContexts.ts

**Files:**
- Create: `src/providers/EmailProvider/EmailContexts.ts`

- [ ] **Step 1: Create the context file**

Create `src/providers/EmailProvider/EmailContexts.ts`:

```ts
import { createContext } from 'react';
import type { EmailSendPayload } from './EmailModels';

export interface EmailContextValue {
  send(payload: EmailSendPayload): Promise<void>;
}

export const EmailContext = createContext<EmailContextValue>({
  send: () => {
    throw new Error('useEmail must be used within an <EmailProvider>. Wrap your component tree with <EmailProvider onSend={...}>.');
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/providers/EmailProvider/EmailContexts.ts
git commit -m "feat(email): add EmailProvider context"
```

---

## Task 3: createEmail

**Files:**
- Create: `src/providers/EmailProvider/createEmail.tsx`
- Create: `src/providers/EmailProvider/EmailProvider.tests.tsx` (initial, added to in later tasks)

- [ ] **Step 1: Write the failing test**

Create `src/providers/EmailProvider/EmailProvider.tests.tsx`:

```tsx
import { createEmail } from './createEmail';

describe('createEmail', () => {
  it('returns a token with the given name and definition', () => {
    const definition = () => () => null;
    const token = createEmail('OrderEmail', definition as never);
    expect(token.name).toBe('OrderEmail');
    expect(token.definition).toBe(definition);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```
pnpm run test-ci -- --testPathPattern="EmailProvider"
```

Expected: FAIL — `Cannot find module './createEmail'`

- [ ] **Step 3: Implement createEmail**

Create `src/providers/EmailProvider/createEmail.tsx`:

```tsx
import type { EmailDefinition, ReactUIEmail } from './EmailModels';

export function createEmail<Name extends string, Args extends unknown[]>(
  name: Name,
  definition: EmailDefinition<Args>,
): ReactUIEmail<Name, Args> {
  return { name, definition };
}
```

- [ ] **Step 4: Run test to confirm it passes**

```
pnpm run test-ci -- --testPathPattern="EmailProvider"
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/providers/EmailProvider/createEmail.tsx src/providers/EmailProvider/EmailProvider.tests.tsx
git commit -m "feat(email): add createEmail"
```

---

## Task 4: EmailProvider

**Files:**
- Create: `src/providers/EmailProvider/EmailProvider.tsx`
- Modify: `src/providers/EmailProvider/EmailProvider.tests.tsx`

- [ ] **Step 1: Add the failing test**

Append to `src/providers/EmailProvider/EmailProvider.tests.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { EmailProvider } from './EmailProvider';

describe('EmailProvider', () => {
  it('renders its children', () => {
    render(
      <EmailProvider onSend={jest.fn()}>
        <span>child content</span>
      </EmailProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```
pnpm run test-ci -- --testPathPattern="EmailProvider"
```

Expected: FAIL — `Cannot find module './EmailProvider'`

- [ ] **Step 3: Implement EmailProvider**

Create `src/providers/EmailProvider/EmailProvider.tsx`:

```tsx
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { useBound } from '../../hooks';
import type { EmailSendPayload } from './EmailModels';
import { EmailContext } from './EmailContexts';

interface Props {
  children: ReactNode;
  onSend(payload: EmailSendPayload): Promise<void>;
}

export const EmailProvider = createComponent('EmailProvider', ({ children, onSend }: Props) => {
  const send = useBound(async (payload: EmailSendPayload) => {
    await onSend(payload);
  });

  const contextValue = useMemo(() => ({ send }), []);

  return (
    <EmailContext.Provider value={contextValue}>
      {children}
    </EmailContext.Provider>
  );
});
```

- [ ] **Step 4: Run test to confirm it passes**

```
pnpm run test-ci -- --testPathPattern="EmailProvider"
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/providers/EmailProvider/EmailProvider.tsx src/providers/EmailProvider/EmailProvider.tests.tsx
git commit -m "feat(email): add EmailProvider component"
```

---

## Task 5: useEmail

**Files:**
- Create: `src/providers/EmailProvider/useEmail.tsx`
- Modify: `src/providers/EmailProvider/EmailProvider.tests.tsx`

- [ ] **Step 1: Add the failing tests**

Append to `src/providers/EmailProvider/EmailProvider.tests.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useEmail } from './useEmail';

const TestEmail = createEmail('TestEmail', ({ Email, Body }) =>
  (name: string) => (
    <Email subject={`Hello ${name}`}>
      <Body>
        <p>Content for {name}</p>
      </Body>
    </Email>
  )
);

function makeWrapper(onSend: jest.Mock) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <EmailProvider onSend={onSend}>{children}</EmailProvider>;
  };
}

describe('useEmail', () => {
  it('renders the template to HTML and calls onSend', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('World', { to: 'test@example.com' });
    });

    expect(onSend).toHaveBeenCalledTimes(1);
    const payload = onSend.mock.calls[0][0];
    expect(payload.html).toContain('Content for World');
    expect(payload.to).toBe('test@example.com');
  });

  it('uses the subject from the Email component', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Alice', { to: 'a@b.com' });
    });

    expect(onSend.mock.calls[0][0].subject).toBe('Hello Alice');
  });

  it('overrides subject with send-time subject when provided', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Alice', { to: 'a@b.com', subject: 'Override Subject' });
    });

    expect(onSend.mock.calls[0][0].subject).toBe('Override Subject');
  });

  it('passes all send-time props through to onSend', async () => {
    const onSend = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmail(TestEmail), { wrapper: makeWrapper(onSend) });

    await act(async () => {
      await result.current('Bob', {
        to: ['a@b.com', 'c@d.com'],
        cc: 'cc@b.com',
        bcc: 'bcc@b.com',
        from: 'sender@b.com',
        alias: 'Sender Name',
        replyTo: 'reply@b.com',
      });
    });

    expect(onSend).toHaveBeenCalledWith(expect.objectContaining({
      to: ['a@b.com', 'c@d.com'],
      cc: 'cc@b.com',
      bcc: 'bcc@b.com',
      from: 'sender@b.com',
      alias: 'Sender Name',
      replyTo: 'reply@b.com',
    }));
  });

  it('throws when email() is called outside EmailProvider', () => {
    const { result } = renderHook(() => useEmail(TestEmail));
    expect(() => result.current('Bob', { to: 'a@b.com' })).toThrow(
      'useEmail must be used within an <EmailProvider>'
    );
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```
pnpm run test-ci -- --testPathPattern="EmailProvider"
```

Expected: FAIL — `Cannot find module './useEmail'`

- [ ] **Step 3: Implement useEmail**

Create `src/providers/EmailProvider/useEmail.tsx`:

```tsx
import { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { ComponentType, ReactNode } from 'react';
import { useBound } from '../../hooks';
import type { EmailDefinitionUtils, EmailSendFunction, EmailSendProps, ReactUIEmail } from './EmailModels';
import { EmailContext } from './EmailContexts';

export function useEmail<Name extends string, Args extends unknown[]>(
  template: ReactUIEmail<Name, Args>,
): EmailSendFunction<Args> {
  const { send } = useContext(EmailContext);

  const email = useBound(async (...allArgs: unknown[]) => {
    const sendProps = allArgs[allArgs.length - 1] as EmailSendProps;
    const templateArgs = allArgs.slice(0, -1) as Args;

    let capturedSubject = '';

    const Email: ComponentType<{ subject: string; children?: ReactNode }> = ({ subject, children }) => {
      capturedSubject = subject;
      return <>{children}</>;
    };

    const Body: ComponentType<{ children?: ReactNode }> = ({ children }) => (
      <>{children}</>
    );

    const utils: EmailDefinitionUtils = { Email, Body };
    const renderer = template.definition(utils);
    const element = renderer(...templateArgs);

    const container = document.createElement('div');
    const root = createRoot(container);
    flushSync(() => root.render(element));
    const html = container.innerHTML;
    root.unmount();

    const subject = sendProps.subject ?? capturedSubject;

    await send({ ...sendProps, subject, html });
  });

  return email as EmailSendFunction<Args>;
}
```

- [ ] **Step 4: Run all tests to confirm they pass**

```
pnpm run test-ci -- --testPathPattern="EmailProvider"
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/providers/EmailProvider/useEmail.tsx src/providers/EmailProvider/EmailProvider.tests.tsx
git commit -m "feat(email): add useEmail hook"
```

---

## Task 6: Exports

**Files:**
- Create: `src/providers/EmailProvider/index.ts`
- Modify: `src/providers/index.ts`

- [ ] **Step 1: Create the EmailProvider barrel**

Create `src/providers/EmailProvider/index.ts`:

```ts
export { createEmail } from './createEmail';
export { useEmail } from './useEmail';
export { EmailProvider } from './EmailProvider';
export type {
  EmailSendProps,
  EmailSendPayload,
  ReactUIEmail,
  EmailDefinition,
  EmailDefinitionUtils,
  EmailSendFunction,
} from './EmailModels';
```

- [ ] **Step 2: Add to the providers barrel**

Edit `src/providers/index.ts` — add one line at the end:

```ts
export * from './ApiProvider';
export * from './UIStateProvider';
export * from './RecordsProvider';
export * from './LocaleProvider';
export * from './ValidationProvider';
export * from './LoggerProvider';
export * from './SubscriptionProvider';
export * from './EmailProvider';
```

- [ ] **Step 3: Run the full test suite to confirm nothing is broken**

```
pnpm run test-ci
```

Expected: all tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/providers/EmailProvider/index.ts src/providers/index.ts
git commit -m "feat(email): export EmailProvider from providers barrel"
```

---

## Task 7: Documentation

**Files:**
- Create: `src/providers/EmailProvider/README.md`
- Modify: `src/providers/README.md`

- [ ] **Step 1: Create the EmailProvider README**

Create `src/providers/EmailProvider/README.md`:

```markdown
# EmailProvider

Provides a type-safe system for defining React email templates, triggering sends from anywhere in the component tree, and receiving rendered HTML + metadata in a custom callback.

[← Back to Providers](../README.md)

---

## Usage

### 1. Mount EmailProvider

Place `EmailProvider` high in the component tree with an `onSend` callback that handles actual delivery:

```tsx
<EmailProvider
  onSend={async ({ to, cc, bcc, from, alias, subject, replyTo, html }) => {
    await myEmailService.send({ to, cc, bcc, from, alias, subject, replyTo, html });
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

The `onSend` callback is responsible for applying its own defaults for any omitted props (e.g. a global `from` address).

## Notes

- `useEmail` must be called within an `<EmailProvider>` — calling `email()` outside one throws with a clear message.
- HTML rendering uses `flushSync` + `createRoot` into a temporary off-screen DOM node; no extra dependencies are needed beyond `react-dom`.
- Email styling (inline styles, table layouts, etc.) is the consumer's responsibility within their template content.
- `onSend` errors propagate: if `onSend` rejects, the `email()` promise rejects with the same error.
```

- [ ] **Step 2: Add EmailProvider to the providers README table**

Edit `src/providers/README.md`. Add a new row for `EmailProvider` (in alphabetical order, between the existing `ApiProvider` and `LocaleProvider` rows):

```markdown
| [EmailProvider](EmailProvider/README.md) | Defines typed React email templates with `createEmail`, triggers sends via `useEmail`, and delivers rendered HTML + metadata to a custom `onSend` callback. |
```

Full table after edit:

```markdown
| Provider | Description |
|----------|-------------|
| [ApiProvider](ApiProvider/README.md) | Supplies `get`, `post`, `remove`, and `query` fetch helpers to the tree, managing auth tokens (persisted to `localStorage`), shared headers, and status-code handlers. |
| [EmailProvider](EmailProvider/README.md) | Defines typed React email templates with `createEmail`, triggers sends via `useEmail`, and delivers rendered HTML + metadata to a custom `onSend` callback. |
| [LocaleProvider](LocaleProvider/README.md) | Sets the application locale/date-format settings (via Luxon) and makes them available to child components through context. |
| [LoggerProvider](LoggerProvider/README.md) | Injects a `Logger` instance (or creates a named sub-logger from a parent) into context so descendants can call `useLogger()` without prop-drilling. |
| [RecordsProvider](RecordsProvider/README.md) | Maintains a typed, keyed record map in context — supports inheritance from parent providers, merge callbacks, upsert, and change notifications. |
| [SubscriptionProvider](SubscriptionProvider/README.md) | Wires up a publish/subscribe channel defined by `createSubscription`, returning an `invoke` function and a `<Provider>` component that routes callbacks to registered subscribers. |
| [UIStateProvider](UIStateProvider/README.md) | Propagates UI state flags (`isLoading`, `isReadOnly`, `isCompact`) through the tree so child components can adapt their appearance and behaviour accordingly. |
| [ValidationProvider](ValidationProvider/README.md) | Manages form validation state — collects field errors via `validate()`, groups them into sections via `<ValidateSection>`, and exposes `isValid()` and `highlightValidationErrors()`. |
```

- [ ] **Step 3: Commit**

```bash
git add src/providers/EmailProvider/README.md src/providers/README.md
git commit -m "docs(email): add EmailProvider README and update providers index"
```
