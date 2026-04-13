# SignInDialog

> **Status: not currently exported / commented out.**
>
> The implementation in `useSignInDialog.tsx` is fully commented out and `index.ts` exports nothing from this folder. The notes below describe the intended API based on the commented-out source; treat this as a preview of a future feature.

A pre-built sign-in dialog hook that provides a modal dialog containing an email dropdown, a password field or PIN input (depending on credential type), and a Sign In button with inline error reporting.

## Intended API

```ts
const { openSignInDialog, closeSignInDialog, SignInDialog } = useSignInDialog();
```

### `SignInDialog` props (when the hook is active)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `ReactNode` | Yes | Dialog title. |
| `credentials` | `SignInCredentials[]` | No | Pre-populated list of known email addresses and their credential type (`'password'` or `'pin'`). |
| `allowNewCredentials` | `boolean` | No | Adds a "New Credentials" option to the email dropdown. Default: `false`. |
| `icon` | `ReactNode` | No | Custom icon rendered beside the form. Defaults to the `'sign-in-dialog'` icon. |
| `onSignIn` | `(email, passwordOrPin, credentialType) => Promise<ReactNode \| void \| boolean>` | Yes | Async callback invoked on submission. Return `true` or `void` to close the dialog; return a `ReactNode` to display an inline error. |

### `SignInCredentials` model

```ts
interface SignInCredentials {
  email: string;
  signInRequired: 'password' | 'pin';
}
```

## Intended usage

```tsx
import { useSignInDialog } from '@anupheaus/react-ui';

function App() {
  const { openSignInDialog, SignInDialog } = useSignInDialog();

  return (
    <>
      <button onClick={openSignInDialog}>Sign In</button>
      <SignInDialog
        title="Sign in to MyApp"
        credentials={[{ email: 'admin@example.com', signInRequired: 'password' }]}
        onSignIn={async (email, password) => {
          const ok = await authenticate(email, password);
          if (!ok) return 'Invalid email or password.';
        }}
      />
    </>
  );
}
```

---

[← Back to Components](../README.md)
