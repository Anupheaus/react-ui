# ValidationProvider

Provides a form-level validation system via `useValidation()`: tracks field-level errors, groups them into named sections, highlights errors on demand, and exposes a `ValidateSection` component to partition validation zones.

## When to mount

`ValidationProvider` has no dedicated wrapper component — call `useValidation()` in the component that owns the form. The returned `ValidateSection` component is used to partition child areas for grouped error reporting. Requires `UIStateProvider` context (used to suppress validation in read-only mode).

## Consuming

```tsx
import { useValidation } from '@anupheaus/react-ui';

function MyForm() {
  const {
    ValidateSection,
    validate,
    isValid,
    highlightValidationErrors,
    getErrors,
    getInvalidSections,
  } = useValidation();

  const handleSubmit = () => {
    if (!isValid()) return; // highlights all errors automatically
    submitForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ValidateSection id="personal-details">
        <NameField
          {...validate(({ validateRequired }) => validateRequired(name, true))}
        />
      </ValidateSection>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### `validate()` return

The `validate(...delegates)` call (called during render) returns:

| Field | Type | Description |
|-------|------|-------------|
| `error` | `ReactNode \| null` | The first failing validation message, or `null` if valid or errors are not yet highlighted |
| `enableErrors` | `() => void` | Manually trigger error display for this field |

### `ValidationTools`

Delegates passed to `validate()` receive a `tools` argument:

| Method | Description |
|--------|-------------|
| `validateRequired(value, isRequired, message?)` | Returns the error message if `value` is empty/null/NaN and `isRequired` is `true` |

---

[← Back to Providers](../README.md)
