import { act, render } from '@testing-library/react';
import { useFields } from './useFields';
import { Text } from '../Text';

interface Editable {
  name: string;
}

/**
 * Sets an input's value through the native HTMLInputElement setter so React's value
 * tracker registers the change and fires onChange — mirroring a real keystroke.
 */
function setNativeValue(input: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
}

function Editor() {
  const { Field } = useFields<Editable>({ name: 'ac' }, () => undefined);
  return <Field component={Text} field="name" label="Name" />;
}

describe('useFields caret behaviour', () => {
  it('keeps the caret where the user typed when editing mid-string', async () => {
    const { container } = render(<Editor />);
    const input = container.querySelector('input') as HTMLInputElement;

    // Simulate typing 'b' between 'a' and 'c': value becomes 'abc' with the caret after the 'b'.
    input.focus();
    setNativeValue(input, 'abc');
    input.setSelectionRange(2, 2);

    await act(async () => {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(input.value).toBe('abc');
    // The caret must stay at position 2 (after the inserted 'b'); the bug lets it jump to the end (3).
    expect(input.selectionStart).toBe(2);
  });
});
