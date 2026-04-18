import { renderHook } from '@testing-library/react';
import { useEventIsolator } from './useEventIsolator';

describe('useEventIsolator', () => {
  it('returns a function (ref callback)', () => {
    const { result } = renderHook(() => useEventIsolator({ clickEvents: true }));
    expect(typeof result.current).toBe('function');
  });

  it('stops propagation for click events when clickEvents is true', () => {
    const { result } = renderHook(() => useEventIsolator({ clickEvents: true }));
    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current(element);

    const parent = element.parentElement!;
    const parentHandler = vi.fn();
    parent.addEventListener('click', parentHandler);

    const event = new MouseEvent('click', { bubbles: true });
    element.dispatchEvent(event);

    expect(parentHandler).not.toHaveBeenCalled();
    parent.removeEventListener('click', parentHandler);
    document.body.removeChild(element);
  });

  it('prevents default for click events when clickEvents is "default"', () => {
    const { result } = renderHook(() => useEventIsolator({ clickEvents: 'default' }));
    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current(element);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);

    document.body.removeChild(element);
  });

  it('does nothing when element is null', () => {
    const { result } = renderHook(() => useEventIsolator({ clickEvents: true }));
    expect(() => result.current(null)).not.toThrow();
  });

  it('stops propagation only (not default) when clickEvents is "propagation"', () => {
    const { result } = renderHook(() => useEventIsolator({ clickEvents: 'propagation' }));
    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current(element);

    const parent = element.parentElement!;
    const parentHandler = vi.fn();
    parent.addEventListener('click', parentHandler);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);

    expect(parentHandler).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
    parent.removeEventListener('click', parentHandler);
    document.body.removeChild(element);
  });

  it('does not stop propagation when clickEvents is false', () => {
    const { result } = renderHook(() => useEventIsolator({ clickEvents: false }));
    const element = document.createElement('div');
    document.body.appendChild(element);
    result.current(element);

    const parent = element.parentElement!;
    const parentHandler = vi.fn();
    parent.addEventListener('click', parentHandler);

    const event = new MouseEvent('click', { bubbles: true });
    element.dispatchEvent(event);

    expect(parentHandler).toHaveBeenCalled();
    parent.removeEventListener('click', parentHandler);
    document.body.removeChild(element);
  });

  it('handles focusEvents setting', () => {
    const { result } = renderHook(() => useEventIsolator({ focusEvents: 'propagation' }));
    const element = document.createElement('input');
    document.body.appendChild(element);
    result.current(element);

    const parent = element.parentElement!;
    const parentHandler = vi.fn();
    parent.addEventListener('focusin', parentHandler);

    const event = new FocusEvent('focusin', { bubbles: true });
    element.dispatchEvent(event);

    expect(parentHandler).not.toHaveBeenCalled();
    parent.removeEventListener('focusin', parentHandler);
    document.body.removeChild(element);
  });
});
