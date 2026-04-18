import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { useUIState } from './useUIState';
import { UIStateContexts } from './UIStateContexts';

describe('useUIState', () => {
  it('returns false defaults when no context is provided', () => {
    const { result } = renderHook(() => useUIState());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isReadOnly).toBe(false);
    expect(result.current.isCompact).toBe(false);
    expect(result.current.isCompactAndReadOnly).toBe(false);
  });

  it('prop isLoading overrides context', () => {
    const { result } = renderHook(() => useUIState({ isLoading: true }));
    expect(result.current.isLoading).toBe(true);
  });

  it('prop isReadOnly overrides context', () => {
    const { result } = renderHook(() => useUIState({ isReadOnly: true }));
    expect(result.current.isReadOnly).toBe(true);
  });

  it('isCompactAndReadOnly is true when both are true', () => {
    const { result } = renderHook(() => useUIState({ isCompact: true, isReadOnly: true }));
    expect(result.current.isCompactAndReadOnly).toBe(true);
  });

  it('inherits isLoading from parent context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(UIStateContexts.isLoadingContext.Provider, { value: true }, children);
    const { result } = renderHook(() => useUIState(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('useManagedUIState is a function', () => {
    const { result } = renderHook(() => useUIState());
    expect(typeof result.current.useManagedUIState).toBe('function');
  });
});
