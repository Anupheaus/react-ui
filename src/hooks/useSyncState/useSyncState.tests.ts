import { act, renderHook } from '@testing-library/react';
import { useSyncState } from './useSyncState';

describe('useSyncState', () => {
  it('initialises to undefined with no argument', () => {
    const { result } = renderHook(() => useSyncState());
    expect(result.current.state).toBeUndefined();
  });

  it('initialises via factory function', () => {
    const { result } = renderHook(() => useSyncState(() => 42));
    expect(result.current.state).toBe(42);
  });

  it('setState(value) updates state', () => {
    const { result } = renderHook(() => useSyncState(() => 0));
    act(() => { result.current.setState(99); });
    expect(result.current.state).toBe(99);
  });

  it('setState(fn) receives current state and sets result', () => {
    const { result } = renderHook(() => useSyncState(() => 10));
    act(() => { result.current.setState(s => s! + 5); });
    expect(result.current.state).toBe(15);
  });

  it('getState() returns current state', () => {
    const { result } = renderHook(() => useSyncState(() => 'hello'));
    expect(result.current.getState()).toBe('hello');
  });
});
