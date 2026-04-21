import { act, renderHook } from '@testing-library/react';
import { useObserver } from './useObserver';

function makeElement() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function removeElement(el: HTMLElement) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

describe('useObserver', () => {
  it('calls onChange immediately with an empty mutations array when target is connected', () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useObserver({ onChange }));
    act(() => { result.current.target(element); });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(element, []);
    removeElement(element);
  });

  it('calls onChange when a child is appended to the observed element', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useObserver({ onChange }));
    act(() => { result.current.target(element); });
    onChange.mockClear();

    await act(async () => { element.appendChild(document.createElement('span')); });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe(element);
    removeElement(element);
  });

  it('calls onChange when an attribute changes', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useObserver({ onChange }));
    act(() => { result.current.target(element); });
    onChange.mockClear();

    await act(async () => { element.setAttribute('data-test', 'value'); });

    expect(onChange).toHaveBeenCalledTimes(1);
    removeElement(element);
  });

  it('does not call onChange for subsequent mutations when isEnabled is false', async () => {
    // target() always fires onChange once on connect (enableObserver is called unconditionally),
    // but the MutationObserver callback guards on isEnabled via a closure so mutations are suppressed.
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useObserver({ isEnabled: false, onChange }));
    act(() => { result.current.target(element); });
    onChange.mockClear(); // clear the initial connect call

    await act(async () => { element.appendChild(document.createElement('span')); });

    expect(onChange).not.toHaveBeenCalled();
    removeElement(element);
  });

  it('does not call onChange when target is cleared with null', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useObserver({ onChange }));
    act(() => { result.current.target(element); });
    onChange.mockClear();
    act(() => { result.current.target(null); });

    await act(async () => { element.appendChild(document.createElement('span')); });

    expect(onChange).not.toHaveBeenCalled();
    removeElement(element);
  });

  it('calls onChange immediately again when target is reassigned to a new element', () => {
    const onChange = vi.fn();
    const first = makeElement();
    const second = makeElement();

    const { result } = renderHook(() => useObserver({ onChange }));
    act(() => { result.current.target(first); });
    act(() => { result.current.target(second); });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0]).toBe(second);
    removeElement(first);
    removeElement(second);
  });
});
