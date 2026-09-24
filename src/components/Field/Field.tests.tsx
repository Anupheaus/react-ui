import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Field } from './Field';

// Field is the single sink through which every input component in the library reaches the DOM.
// It must forward only its declared props to the DOM element — never an arbitrary rest spread —
// otherwise any wrapper that forgets to destructure its own props (value, onChange, type, config)
// leaks them onto the DOM. These tests guard that surface for every Field-based component at once.
describe('Field prop forwarding', () => {
  it('does not forward unknown or own props onto its DOM element as attributes', () => {
    const { container } = render(
      // @ts-expect-error deliberately passing props Field does not declare, to prove they never reach the DOM
      <Field tagName="test-field" value={42} type="range" checked bogusProp="x">
        <input />
      </Field>,
    );
    const el = container.querySelector('test-field') as HTMLElement;
    const attrs = Array.from(el.attributes).map(attr => attr.name);
    expect(attrs).not.toContain('value');
    expect(attrs).not.toContain('type');
    expect(attrs).not.toContain('checked');
    expect(attrs).not.toContain('bogusprop');
  });

  it('does not forward a leaked onChange handler onto its DOM element', () => {
    const onChange = vi.fn();
    const { container } = render(
      // @ts-expect-error onChange is not a FieldProp; it must never become a DOM change handler
      <Field tagName="test-field" onChange={onChange}>
        <input />
      </Field>,
    );
    const el = container.querySelector('test-field') as HTMLElement;
    const input = el.querySelector('input') as HTMLInputElement;
    // A change event bubbling up from a descendant must not reach a leaked onChange with a raw event.
    fireEvent.change(input, { target: { value: 'x' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('still forwards genuine FieldProps and style to the wrapper', () => {
    const { container } = render(
      <Field tagName="test-field" className="my-field" style={{ opacity: 0.5 }} label="Hi">
        <input />
      </Field>,
    );
    const el = container.querySelector('test-field.my-field') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.style.opacity).toBe('0.5');
  });
});
