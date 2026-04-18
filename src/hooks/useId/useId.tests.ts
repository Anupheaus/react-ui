import { renderHook } from '@testing-library/react';
import { useId } from './useId';

describe('useId', () => {
  it('returns a non-empty string', () => {
    const { result } = renderHook(() => useId());
    expect(typeof result.current).toBe('string');
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('returns a stable ID across re-renders when no id is provided', () => {
    const { result, rerender } = renderHook(() => useId());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('returns the provided id when one is passed', () => {
    const { result } = renderHook(() => useId('my-id'));
    expect(result.current).toBe('my-id');
  });

  it('updates to a new provided id when the prop changes', () => {
    const { result, rerender } = renderHook(({ id }) => useId(id), { initialProps: { id: 'first' } });
    expect(result.current).toBe('first');
    rerender({ id: 'second' });
    expect(result.current).toBe('second');
  });
});
