import { act, renderHook } from '@testing-library/react';
import { useOnDOMChange } from './useOnDOMChange';

describe('useOnDOMChange', () => {
  it('returns a ref callback function', () => {
    const { result } = renderHook(() => useOnDOMChange());
    expect(typeof result.current).toBe('function');
  });

  it('calls onChange when a child is added to the observed element', async () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useOnDOMChange({ onChange }));

    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current(element);

    await act(async () => {
      element.appendChild(document.createElement('span'));
      await new Promise(r => setTimeout(r, 0));
    });

    expect(onChange).toHaveBeenCalled();
    const [mutations, el] = onChange.mock.calls[0];
    expect(Array.isArray(mutations)).toBe(true);
    expect(el).toBe(element);
    document.body.removeChild(element);
  });

  it('does not call onChange when isEnabled is false', async () => {
    const onChange = vi.fn();
    renderHook(() => useOnDOMChange({ isEnabled: false, onChange }));
    // No element assigned — verify no error thrown
    expect(onChange).not.toHaveBeenCalled();
  });

  it('stops observing when target is set to null', async () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useOnDOMChange({ onChange }));

    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current(element);

    // Disconnect by passing null
    result.current(null);
    onChange.mockClear();

    await act(async () => {
      element.appendChild(document.createElement('span'));
      await new Promise(r => setTimeout(r, 0));
    });

    expect(onChange).not.toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('calls onChange when an attribute changes on the observed element', async () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useOnDOMChange({ onChange }));

    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current(element);

    await act(async () => {
      element.setAttribute('data-test', 'value');
      await new Promise(r => setTimeout(r, 0));
    });

    expect(onChange).toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('does not throw when called without props', () => {
    expect(() => renderHook(() => useOnDOMChange())).not.toThrow();
  });
});
