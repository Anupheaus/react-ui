import { act, renderHook } from '@testing-library/react';
import { useBatchUpdates } from './useBatchUpdates';

describe('useBatchUpdates', () => {
  it('executes the delegate and returns its result', () => {
    const { result } = renderHook(() => useBatchUpdates());
    let value: number | undefined;
    act(() => { value = result.current(() => 42); });
    expect(value).toBe(42);
  });

  it('onComplete callback fires after the batch completes', () => {
    const { result } = renderHook(() => useBatchUpdates());
    const completed: string[] = [];
    act(() => {
      result.current(() => {
        result.current.onComplete('step1', () => completed.push('step1'));
      });
    });
    expect(completed).toContain('step1');
  });

  it('onComplete fires immediately when called outside a batch', () => {
    const { result } = renderHook(() => useBatchUpdates());
    const completed: string[] = [];
    act(() => {
      result.current.onComplete('outside', () => completed.push('outside'));
    });
    expect(completed).toContain('outside');
  });
});
