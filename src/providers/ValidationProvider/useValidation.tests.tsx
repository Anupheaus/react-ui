import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
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
  const { validate, isValid, getErrors } = useValidation();
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
    expect(result.error).toBeTruthy();
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
