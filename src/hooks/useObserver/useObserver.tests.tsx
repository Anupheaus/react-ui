import { act, renderHook } from '@testing-library/react';
import { useObserver } from './useObserver';

describe('useObserver', () => {
  it('returns a target ref callback', () => {
    const { result } = renderHook(() => useObserver());
    expect(typeof result.current.target).toBe('function');
  });

  it('calls onChange when a child is added to the observed element', async () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useObserver({ onChange }));

    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current.target(element);

    // onChange is called once on initial observation with empty mutations
    expect(onChange).toHaveBeenCalledWith(element, []);

    onChange.mockClear();

    await act(async () => {
      element.appendChild(document.createElement('span'));
      await new Promise(r => setTimeout(r, 0));
    });

    expect(onChange).toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('does not call onChange for mutations when isEnabled is false', async () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useObserver({ isEnabled: false, onChange }));

    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current.target(element);

    // The hook does call onChange once synchronously on initial target assignment (with [])
    // even when isEnabled is false. Clear that call before checking mutation behaviour.
    onChange.mockClear();

    await act(async () => {
      element.appendChild(document.createElement('span'));
      await new Promise(r => setTimeout(r, 0));
    });

    // MutationObserver callback checks isEnabled and bails out — no further calls expected
    expect(onChange).not.toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('disconnects observer when target is set to null', async () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useObserver({ onChange }));

    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current.target(element);
    onChange.mockClear();

    // Disconnect by passing null
    result.current.target(null);

    await act(async () => {
      element.appendChild(document.createElement('span'));
      await new Promise(r => setTimeout(r, 0));
    });

    expect(onChange).not.toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('does not throw when called without props', () => {
    expect(() => renderHook(() => useObserver())).not.toThrow();
  });
});
