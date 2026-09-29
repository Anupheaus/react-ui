import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactListItem } from '../../models';
import { useValidation } from '../../providers/ValidationProvider';
import { Chips } from './Chips';

// Chips' selection is a list, never one of its options, so it cannot be validated the way a single-choice dropdown
// is. It used to be: a required Chips field failed validation whatever was chosen, so a window with one could never
// be saved; and an optional one offered an "N/A" option that added a blank chip.

const PEOPLE: ReactListItem[] = [
  { id: 'alice', text: 'Alice' },
  { id: 'brian', text: 'Brian' },
];

interface HostProps {
  value: string[];
  isOptional?: boolean;
}

/** Chips inside a validation scope, with a button that checks it the way a window's Save does. */
function ChipsHost({ value, isOptional }: HostProps) {
  const { isValid, ValidateSection } = useValidation('chips-host');
  const [result, setResult] = useState('not checked');
  const check = () => setResult(isValid() ? 'valid' : 'invalid');
  return (
    <>
      <ValidateSection id="people">
        <Chips label="People" values={PEOPLE} value={value} isOptional={isOptional} />
      </ValidateSection>
      <button type="button" onClick={check}>Check</button>
      <span data-testid="result">{result}</span>
    </>
  );
}

function checkValidity(): string {
  act(() => { fireEvent.click(screen.getByText('Check')); });
  return screen.getByTestId('result').textContent ?? '';
}

describe('Chips — validation', () => {
  it('is valid when a required field has a chip chosen', () => {
    render(<ChipsHost value={['alice']} />);

    expect(checkValidity()).toBe('valid');
  });

  it('asks for a value when a required field has no chips', () => {
    render(<ChipsHost value={[]} />);

    expect(checkValidity()).toBe('invalid');
    expect(screen.getByText('Please select a value')).toBeTruthy();
  });

  it('is valid with no chips when the field is optional', () => {
    render(<ChipsHost value={[]} isOptional />);

    expect(checkValidity()).toBe('valid');
  });

  it('offers no "N/A" option when the field is optional', () => {
    const { container } = render(<ChipsHost value={[]} isOptional />);

    act(() => { fireEvent.click(container.querySelector('chips button') as HTMLElement); });

    expect(screen.queryByText('N/A')).toBeNull();
  });
});
