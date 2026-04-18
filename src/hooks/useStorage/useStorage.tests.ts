import { act, renderHook } from '@testing-library/react';
import { useStorage } from './useStorage';

describe('useStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('returns undefined when key is not in storage', () => {
    const { result } = renderHook(() => useStorage<string>('test-key'));
    expect(result.current.state).toBeUndefined();
  });

  it('returns defaultValue when key is not in storage', () => {
    const { result } = renderHook(() =>
      useStorage<string>('test-key', { defaultValue: () => 'default' })
    );
    expect(result.current.state).toBe('default');
  });

  it('setState persists value to localStorage', () => {
    const { result } = renderHook(() => useStorage<string>('test-key'));
    act(() => { result.current.setState('hello'); });
    expect(localStorage.getItem('test-key')).toBe('"hello"');
  });

  it('isInLocalStorage is true after setState', () => {
    const { result } = renderHook(() => useStorage<string>('test-key'));
    act(() => { result.current.setState('hello'); });
    expect(result.current.isInLocalStorage).toBe(true);
  });

  it('type session stores in sessionStorage', () => {
    const { result } = renderHook(() => useStorage<string>('test-key', { type: 'session' }));
    act(() => { result.current.setState('world'); });
    expect(sessionStorage.getItem('test-key')).toBe('"world"');
    expect(result.current.isInSessionStorage).toBe(true);
  });

  it('setState(undefined) removes the key from storage', () => {
    const { result } = renderHook(() => useStorage<string>('test-key'));
    act(() => { result.current.setState('hello'); });
    act(() => { result.current.setState(undefined); });
    expect(localStorage.getItem('test-key')).toBeNull();
  });
});
