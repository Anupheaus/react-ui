import { act, renderHook } from '@testing-library/react';
import { useOnDOMChange } from './useOnDOMChange';

function makeElement() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function removeElement(el: HTMLElement) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

describe('useOnDOMChange', () => {
  it('calls onChange when a child is appended to the observed element', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useOnDOMChange({ onChange }));
    act(() => { result.current(element); });

    await act(async () => { element.appendChild(document.createElement('span')); });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toBe(element);
    removeElement(element);
  });

  it('passes the MutationRecord array as the first argument', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useOnDOMChange({ onChange }));
    act(() => { result.current(element); });

    await act(async () => { element.appendChild(document.createElement('span')); });

    const [mutations] = onChange.mock.calls[0];
    expect(Array.isArray(mutations)).toBe(true);
    expect(mutations.length).toBeGreaterThan(0);
    removeElement(element);
  });

  it('does not call onChange when isEnabled is false', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useOnDOMChange({ isEnabled: false, onChange }));
    act(() => { result.current(element); });

    await act(async () => { element.appendChild(document.createElement('span')); });

    expect(onChange).not.toHaveBeenCalled();
    removeElement(element);
  });

  it('stops observing when target is called with null', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result } = renderHook(() => useOnDOMChange({ onChange }));
    act(() => { result.current(element); });
    act(() => { result.current(null); });

    await act(async () => { element.appendChild(document.createElement('span')); });

    expect(onChange).not.toHaveBeenCalled();
    removeElement(element);
  });

  it('stops observing on unmount', async () => {
    const onChange = vi.fn();
    const element = makeElement();

    const { result, unmount } = renderHook(() => useOnDOMChange({ onChange }));
    act(() => { result.current(element); });
    unmount();

    await act(async () => { element.appendChild(document.createElement('span')); });

    expect(onChange).not.toHaveBeenCalled();
    removeElement(element);
  });

  it('observes the new element when target is reassigned', async () => {
    const onChange = vi.fn();
    const first = makeElement();
    const second = makeElement();

    const { result } = renderHook(() => useOnDOMChange({ onChange }));
    act(() => { result.current(first); });
    act(() => { result.current(second); });

    await act(async () => { second.appendChild(document.createElement('span')); });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][1]).toBe(second);
    removeElement(first);
    removeElement(second);
  });
});
