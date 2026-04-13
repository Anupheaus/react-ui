# useRecaptcha

Provides a Google reCAPTCHA v2 integration: returns a ready-to-render `ReCaptcha` component and imperative controls (`execute`, `reset`, `getValue`) for use in forms that require bot protection.

## Signature

```ts
function useRecaptcha(): UseRecaptchaResult
```

## Returns

An object with:

| Field | Type | Description |
|-------|------|-------------|
| `execute` | `() => Promise<string>` | Triggers reCAPTCHA execution and resolves with the token |
| `reset` | `() => void` | Resets the widget and creates a fresh promise |
| `getValue` | `() => string \| null` | Returns the current reCAPTCHA token, or `null` if not yet executed |
| `getWidgetId` | `() => number \| null` | Returns the underlying widget ID, or `null` |
| `ReCaptcha` | `React.ComponentType<ReCaptchaProps>` | Component to render the reCAPTCHA widget in the UI |
| `ReCaptchaNotice` | `React.ComponentType` | Component that renders the reCAPTCHA branding notice |

## Usage

```tsx
const { ReCaptcha, ReCaptchaNotice, execute } = useRecaptcha();

const handleSubmit = async () => {
  const token = await execute();
  await submitForm({ token });
};

return (
  <form onSubmit={handleSubmit}>
    <ReCaptcha siteKey="your-site-key" />
    <ReCaptchaNotice />
    <button type="submit">Submit</button>
  </form>
);
```

---

[← Back to Hooks](../README.md)
