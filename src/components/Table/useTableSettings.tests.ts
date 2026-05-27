import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTableSettings } from './useTableSettings';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';

const setState = vi.fn();

vi.mock('../../hooks/useStorage', () => ({
  useStorage: () => ({
    state: { columnWidths: { name: 150, status: 60, [TABLE_ACTIONS_COLUMN_ID]: 24 } },
    setState,
  }),
}));

describe('useTableSettings', () => {
  beforeEach(() => {
    setState.mockClear();
  });

  it('does not persist actions column widths', () => {
    const { result } = renderHook(() => useTableSettings('my-table'));

    act(() => {
      result.current.persistColumnWidth(TABLE_ACTIONS_COLUMN_ID, 68, true);
    });

    expect(setState).not.toHaveBeenCalled();
  });

  it('does not persist non-resizable column widths', () => {
    const { result } = renderHook(() => useTableSettings('my-table'));

    act(() => {
      result.current.persistColumnWidth('status', 80, false);
    });

    expect(setState).not.toHaveBeenCalled();
  });

  it('persists resizable data column widths', () => {
    const { result } = renderHook(() => useTableSettings('my-table'));

    act(() => {
      result.current.persistColumnWidth('name', 180, true);
    });

    expect(setState).toHaveBeenCalledOnce();
  });
});
