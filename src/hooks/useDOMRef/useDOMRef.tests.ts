import { act, renderHook } from '@testing-library/react';
import { useDOMRef } from './useDOMRef';

describe('useDOMRef (no arguments)', () => {
  it('returns a tuple of length 2', () => {
    const { result } = renderHook(() => useDOMRef());
    const value = result.current;
    expect(Array.isArray(value)).toBe(true);
    expect(value).toHaveLength(2);
  });

  it('ref.current starts as undefined', () => {
    const { result } = renderHook(() => useDOMRef());
    const [ref] = result.current as [React.RefObject<HTMLElement>, Function];
    expect(ref.current).toBeUndefined();
  });

  it('setter updates ref.current to the given element', () => {
    const { result } = renderHook(() => useDOMRef());
    const [ref, setter] = result.current as [React.RefObject<HTMLElement>, Function];
    const el = document.createElement('div');
    act(() => { setter(el); });
    expect(ref.current).toBe(el);
  });

  it('setter with null clears ref.current to undefined', () => {
    const { result } = renderHook(() => useDOMRef());
    const [ref, setter] = result.current as [React.RefObject<HTMLElement>, Function];
    const el = document.createElement('div');
    act(() => { setter(el); });
    act(() => { setter(null); });
    expect(ref.current).toBeUndefined();
  });

  it('calling setter with the same element twice does not error', () => {
    const { result } = renderHook(() => useDOMRef());
    const [, setter] = result.current as [React.RefObject<HTMLElement>, Function];
    const el = document.createElement('div');
    act(() => { setter(el); });
    expect(() => act(() => { setter(el); })).not.toThrow();
  });
});

describe('useDOMRef (with config)', () => {
  it('returns a function, not a tuple', () => {
    const { result } = renderHook(() => useDOMRef({ connected: vi.fn() }));
    expect(typeof result.current).toBe('function');
  });

  it('calls connected callback when element is set', () => {
    const connected = vi.fn();
    const { result } = renderHook(() => useDOMRef({ connected }));
    const el = document.createElement('div');
    act(() => { (result.current as Function)(el); });
    expect(connected).toHaveBeenCalledTimes(1);
    expect(connected).toHaveBeenCalledWith(el);
  });

  it('calls disconnected callback with the old element when null is set', () => {
    const disconnected = vi.fn();
    const { result } = renderHook(() => useDOMRef({ disconnected }));
    const el = document.createElement('div');
    act(() => { (result.current as Function)(el); });
    act(() => { (result.current as Function)(null); });
    expect(disconnected).toHaveBeenCalledTimes(1);
    expect(disconnected).toHaveBeenCalledWith(el);
  });

  it('does not call connected when the same element is set again', () => {
    const connected = vi.fn();
    const { result } = renderHook(() => useDOMRef({ connected }));
    const el = document.createElement('div');
    act(() => { (result.current as Function)(el); });
    act(() => { (result.current as Function)(el); });
    expect(connected).toHaveBeenCalledTimes(1);
  });

  it('does not call disconnected when no element was previously set', () => {
    const disconnected = vi.fn();
    const { result } = renderHook(() => useDOMRef({ disconnected }));
    act(() => { (result.current as Function)(null); });
    expect(disconnected).not.toHaveBeenCalled();
  });
});

describe('useDOMRef (with refs array)', () => {
  it('returns a function, not a tuple', () => {
    const { result } = renderHook(() => useDOMRef([{ current: null }]));
    expect(typeof result.current).toBe('function');
  });

  it('forwards the element to all object refs', () => {
    const ref1 = { current: null as HTMLElement | null };
    const ref2 = { current: null as HTMLElement | null };
    const { result } = renderHook(() => useDOMRef([ref1, ref2]));
    const el = document.createElement('div');
    act(() => { (result.current as Function)(el); });
    expect(ref1.current).toBe(el);
    expect(ref2.current).toBe(el);
  });

  it('sets refs to null when cleared', () => {
    const ref1 = { current: null as HTMLElement | null };
    const { result } = renderHook(() => useDOMRef([ref1]));
    const el = document.createElement('div');
    act(() => { (result.current as Function)(el); });
    act(() => { (result.current as Function)(null); });
    expect(ref1.current).toBeNull();
  });

  it('forwards the element to callback refs', () => {
    const callbackRef = vi.fn();
    const { result } = renderHook(() => useDOMRef([callbackRef]));
    const el = document.createElement('div');
    act(() => { (result.current as Function)(el); });
    expect(callbackRef).toHaveBeenCalledWith(el);
  });

  it('skips undefined entries in the refs array', () => {
    const ref1 = { current: null as HTMLElement | null };
    const { result } = renderHook(() => useDOMRef([undefined, ref1]));
    const el = document.createElement('div');
    act(() => { (result.current as Function)(el); });
    expect(ref1.current).toBe(el);
  });
});
