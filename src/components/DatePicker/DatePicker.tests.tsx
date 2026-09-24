import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('renders the field with its label', () => {
    const { getByText, container } = render(<DatePicker label="Date of birth" value={DateTime.fromISO('2020-01-01')} />);
    expect(getByText('Date of birth')).not.toBeNull();
    expect(container.querySelector('date-picker')).not.toBeNull();
  });

  // Regression: allowClear/labelEndAdornment/onDialogClosed are own props of DatePicker, not
  // FieldProps. Before the fix they were spread through Field onto its DOM wrapper, landing as
  // stray attributes/handlers (the same prop-leak class fixed in Slider). They must never reach
  // the DOM element.
  it('does not leak its own props onto the field DOM wrapper', () => {
    const { container } = render(
      <DatePicker
        label="When"
        value={DateTime.fromISO('2020-01-01')}
        allowClear
        labelEndAdornment={'X'}
        onDialogClosed={() => undefined}
        onChange={() => undefined}
      />,
    );
    const el = container.querySelector('date-picker') as HTMLElement;
    const attrs = Array.from(el.attributes).map(attr => attr.name);
    expect(attrs).not.toContain('allowclear');
    expect(attrs).not.toContain('labelendadornment');
    expect(attrs).not.toContain('ondialogclosed');
  });

  it('still forwards genuine FieldProps such as className to the wrapper', () => {
    const { container } = render(<DatePicker value={DateTime.fromISO('2020-01-01')} className="my-date-field" />);
    expect(container.querySelector('date-picker.my-date-field')).not.toBeNull();
  });
});
