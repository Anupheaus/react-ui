import { act, render } from '@testing-library/react';
import { useValidation } from './useValidation';

// Test component that calls useValidation and exposes results via validate
function ValidationTestComponent({
  value,
  isRequired,
  onResult,
}: {
  value: unknown;
  isRequired: boolean;
  onResult: (result: { error: unknown; enableErrors: () => void }) => void;
}) {
  const { validate, isValid } = useValidation();
  const result = validate(({ validateRequired }) => validateRequired(value, isRequired));
  onResult(result);
  return <div data-testid="valid">{String(isValid())}</div>;
}

describe('useValidation — validateRequired', () => {
  it('returns no error when value is non-empty and isRequired is true', () => {
    let result: any;
    render(
      <ValidationTestComponent
        value="hello"
        isRequired
        onResult={r => { result = r; }}
      />
    );
    expect(result.error).toBeNull();
  });

  it('returns the default message when value is undefined and isRequired is true', () => {
    let result: any;
    const { rerender } = render(
      <ValidationTestComponent
        value={undefined}
        isRequired
        onResult={r => { result = r; }}
      />
    );
    // Errors only show after enableErrors is called
    act(() => { result.enableErrors(); });
    rerender(
      <ValidationTestComponent
        value={undefined}
        isRequired
        onResult={r => { result = r; }}
      />
    );
    expect(result.error).toBe('This field is required');
  });

  it('returns no error when isRequired is false regardless of value', () => {
    let result: any;
    render(
      <ValidationTestComponent
        value={undefined}
        isRequired={false}
        onResult={r => { result = r; }}
      />
    );
    expect(result.error).toBeNull();
  });
});

describe('useValidation — isValid', () => {
  it('returns true when no errors are registered', () => {
    function ValidComponent({ onValid }: { onValid: (v: boolean) => void }) {
      const { isValid } = useValidation();
      onValid(isValid());
      return null;
    }
    let valid: boolean | undefined;
    render(<ValidComponent onValid={v => { valid = v; }} />);
    expect(valid).toBe(true);
  });
});

describe('useValidation — getErrors', () => {
  it('returns an empty array when there are no errors', () => {
    function NoErrorComponent({ onErrors }: { onErrors: (e: unknown[]) => void }) {
      const { getErrors } = useValidation();
      onErrors(getErrors());
      return null;
    }
    let errors: unknown[] | undefined;
    render(<NoErrorComponent onErrors={e => { errors = e; }} />);
    expect(errors).toHaveLength(0);
  });
});

describe('useValidation — string id shorthand', () => {
  it('accepts a plain string as the id (no errors)', () => {
    function StringIdComponent({ onErrors }: { onErrors: (e: unknown[]) => void }) {
      const { getErrors } = useValidation('my-form');
      onErrors(getErrors());
      return null;
    }
    let errors: unknown[] | undefined;
    render(<StringIdComponent onErrors={e => { errors = e; }} />);
    expect(errors).toHaveLength(0);
  });

  it('string id behaves the same as object id for validation', () => {
    let resultString: any;
    let resultObject: any;

    function StringIdForm({ onResult }: { onResult: (r: any) => void }) {
      const { validate } = useValidation('form-a');
      const result = validate(({ validateRequired }) => validateRequired(undefined, true));
      onResult(result);
      return null;
    }

    function ObjectIdForm({ onResult }: { onResult: (r: any) => void }) {
      const { validate } = useValidation({ id: 'form-a' });
      const result = validate(({ validateRequired }) => validateRequired(undefined, true));
      onResult(result);
      return null;
    }

    render(<StringIdForm onResult={r => { resultString = r; }} />);
    render(<ObjectIdForm onResult={r => { resultObject = r; }} />);

    // Both should start with no displayed error (not yet highlighted)
    expect(resultString.error).toBeNull();
    expect(resultObject.error).toBeNull();
  });
});
