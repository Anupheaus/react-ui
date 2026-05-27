import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  TableActionsColumnWidthProvider,
  useReportTableActionsColumnWidth,
  useTableActionsColumnWidth,
} from './TableActionsColumnWidthContext';

function createWrapper(initialWidth?: number, lockWidth?: boolean) {
  return ({ children }: { children: ReactNode }) => (
    <TableActionsColumnWidthProvider columnIndex={0} initialWidth={initialWidth} lockWidth={lockWidth}>
      {children}
    </TableActionsColumnWidthProvider>
  );
}

describe('TableActionsColumnWidthProvider', () => {
  it('uses the maximum width reported across rows', () => {
    const { result } = renderHook(() => ({
      width: useTableActionsColumnWidth(),
      ...useReportTableActionsColumnWidth(),
    }), { wrapper: createWrapper(44) });

    act(() => {
      result.current.reportWidth('row-a', 44);
      result.current.reportWidth('row-b', 68);
    });

    expect(result.current.width).toBe(68);
  });

  it('recalculates down when a wider row is removed', () => {
    const { result } = renderHook(() => ({
      width: useTableActionsColumnWidth(),
      ...useReportTableActionsColumnWidth(),
    }), { wrapper: createWrapper(44) });

    act(() => {
      result.current.reportWidth('row-a', 44);
      result.current.reportWidth('row-b', 68);
    });
    expect(result.current.width).toBe(68);

    act(() => {
      result.current.clearWidth('row-b');
    });
    expect(result.current.width).toBe(44);
  });

  it('recalculates when a row reports a smaller width after its content changes', () => {
    const { result } = renderHook(() => ({
      width: useTableActionsColumnWidth(),
      ...useReportTableActionsColumnWidth(),
    }), { wrapper: createWrapper() });

    act(() => {
      result.current.reportWidth('row-a', 68);
    });
    expect(result.current.width).toBe(68);

    act(() => {
      result.current.reportWidth('row-a', 44);
    });
    expect(result.current.width).toBe(44);
  });

  it('does not update from row measurements when width is locked', () => {
    const { result } = renderHook(() => ({
      width: useTableActionsColumnWidth(),
      ...useReportTableActionsColumnWidth(),
    }), { wrapper: createWrapper(24, true) });

    expect(result.current.width).toBe(24);

    act(() => {
      result.current.reportWidth('row-a', 68);
      result.current.clearWidth('row-a');
    });

    expect(result.current.width).toBe(24);
  });
});
