import type { ReactNode } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { DefaultTheme, ThemeProvider } from '../../theme';
import type { TableColumn, TableOnRequest } from './TableModels';
import { Table } from './Table';
import { TableRows } from './TableRows';
import { TABLE_BODY_SCROLLER_SCROLLBAR_GUTTER } from './tableBodyScrollerLayout';

interface TestRecord {
  id: string;
  name: string;
}

const columns: TableColumn<TestRecord>[] = [
  { id: 'name', field: 'name', label: 'Name', type: 'string', width: 150 },
];

const records: TestRecord[] = [
  { id: 'record-1', name: 'Alpha' },
  { id: 'record-2', name: 'Beta' },
];

class MockIntersectionObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

class MockResizeObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  });
});

function renderTable(children: ReactNode) {
  return render(
    <ThemeProvider theme={DefaultTheme}>
      <div style={{ width: 900, height: 400, display: 'flex' }}>
        {children}
      </div>
    </ThemeProvider>,
  );
}

function createTableRequest(sourceRecords: TestRecord[]): TableOnRequest<TestRecord> {
  return async ({ requestId, pagination }, response) => {
    const offset = pagination.offset ?? 0;
    const limit = pagination.limit;
    response({
      requestId,
      records: sourceRecords.slice(offset, offset + limit),
      total: sourceRecords.length,
    });
  };
}

const emptyTableRequest: TableOnRequest<TestRecord> = async ({ requestId }, response) => {
  response({ requestId, records: [], total: 0 });
};

function findCssPropertyMatchingSelector(selectorIncludes: string, property: string): string | undefined {
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue;
      if (!rule.selectorText.includes(selectorIncludes)) continue;
      const value = rule.style.getPropertyValue(property).trim();
      if (value) return value;
    }
  }
  return undefined;
}

function getBodyScroller(container: HTMLElement): Element | null {
  return container.querySelector('table-rows scroller-container');
}

function getRowsClassName(container: HTMLElement): string {
  const tableRows = container.querySelector('table-rows');
  expect(tableRows).not.toBeNull();
  const rowsClassName = Array.from(tableRows!.classList).find(className => className.includes('rows'));
  expect(rowsClassName).toBeDefined();
  return rowsClassName!;
}

function expectBodyScrollerScrollbarGutterAuto(container: HTMLElement) {
  const rowsClassName = getRowsClassName(container);
  const gutter = findCssPropertyMatchingSelector(`${rowsClassName} scroller-container`, 'scrollbar-gutter');
  expect(gutter).toBe(TABLE_BODY_SCROLLER_SCROLLBAR_GUTTER);
}

describe('Table', () => {
  it('renders header, body scroller, and footer', async () => {
    const { container } = renderTable(
      <Table columns={columns} onRequest={createTableRequest(records)} />,
    );

    expect(container.querySelector('react-table')).not.toBeNull();
    expect(container.querySelector('table-header')).not.toBeNull();
    expect(container.querySelector('table-rows')).not.toBeNull();
    expect(getBodyScroller(container)).not.toBeNull();
    expect(container.querySelector('table-footer')).not.toBeNull();

    await waitFor(() => {
      expect(container.querySelectorAll('table-row').length).toBeGreaterThan(0);
    });
  });

  it('loads row data from onRequest', async () => {
    const { container, getByText } = renderTable(
      <Table columns={columns} onRequest={createTableRequest(records)} />,
    );

    await waitFor(() => {
      expect(getByText('Alpha')).not.toBeNull();
      expect(getByText('Beta')).not.toBeNull();
    });

    expect(container.querySelectorAll('table-row')).toHaveLength(2);
  });

  it('shows the record count in the footer after data loads', async () => {
    const { getByText } = renderTable(
      <Table columns={columns} unitName="person" onRequest={createTableRequest(records)} />,
    );

    await waitFor(() => {
      expect(getByText(/2/)).not.toBeNull();
      expect(getByText(/people|person/i)).not.toBeNull();
    });
  });

  it('renders header and row fill spacers when row actions are enabled', async () => {
    const { container } = renderTable(
      <Table
        columns={columns}
        onRequest={createTableRequest(records)}
        onEdit={() => void 0}
        onRemove={() => void 0}
      />,
    );

    await waitFor(() => {
      expect(container.querySelectorAll('table-row').length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(container.querySelector('table-header-fill')).not.toBeNull();
      expect(container.querySelector('table-row-fill')).not.toBeNull();
    });
  });

  it('applies scrollbar-gutter auto on the body scroller-container', async () => {
    const { container } = renderTable(
      <Table columns={columns} onRequest={createTableRequest(records)} onEdit={() => void 0} />,
    );

    await waitFor(() => {
      expect(getBodyScroller(container)).not.toBeNull();
    });

    expectBodyScrollerScrollbarGutterAuto(container);
  });

  it('stretches data cells to the row height with ellipsis on the inner content', async () => {
    const { container } = renderTable(
      <Table columns={columns} onRequest={createTableRequest(records)} />,
    );

    await waitFor(() => {
      expect(container.querySelectorAll('table-row').length).toBeGreaterThan(0);
    });

    const dataCellClassName = Array.from(container.querySelector('table-cell')!.classList)
      .find(className => className.includes('dataCell'));
    expect(dataCellClassName).toBeDefined();

    const dataCellContentClassName = Array.from(container.querySelector('table-cell-content')!.classList)
      .find(className => className.includes('dataCellContent'));
    expect(dataCellContentClassName).toBeDefined();

    expect(findCssPropertyMatchingSelector(dataCellClassName!, 'align-self')).toBe('stretch');
    expect(findCssPropertyMatchingSelector(dataCellClassName!, 'height')).not.toBe('fit-content');
    expect(findCssPropertyMatchingSelector(dataCellContentClassName!, 'text-overflow')).toBe('ellipsis');
  });

  it('pins row actions on a sticky host outside the data cell flex layout', async () => {
    const { container } = renderTable(
      <Table columns={columns} onRequest={createTableRequest(records)} onEdit={() => void 0} />,
    );

    await waitFor(() => {
      expect(container.querySelectorAll('table-row').length).toBeGreaterThan(0);
    });

    const actionsPin = container.querySelector('table-row-actions-pin');
    expect(actionsPin).not.toBeNull();

    const actionsPinClassName = Array.from(actionsPin!.classList)
      .find(className => className.includes('actionsPin'));
    expect(actionsPinClassName).toBeDefined();
    expect(findCssPropertyMatchingSelector(actionsPinClassName!, 'position')).toBe('sticky');

    const actionsCell = actionsPin!.querySelector('table-cell');
    expect(actionsCell).not.toBeNull();

    const actionsCellClassName = Array.from(actionsCell!.classList)
      .find(className => className.includes('tableActionsCell'));
    expect(actionsCellClassName).toBeDefined();
    expect(Array.from(actionsCell!.classList).some(className => className.includes('dataCell'))).toBe(false);
    expect(findCssPropertyMatchingSelector(actionsCellClassName!, 'position')).not.toBe('sticky');
    expect(findCssPropertyMatchingSelector(actionsCellClassName!, 'overflow')).toBe('unset');
  });

  it('shows the provided empty message when there are no records', async () => {
    const { container, getByText } = renderTable(
      <Table columns={columns} onRequest={emptyTableRequest} emptyMessage="Nothing here yet" />,
    );

    await waitFor(() => {
      expect(getByText('Nothing here yet')).not.toBeNull();
    });

    expect(container.querySelectorAll('table-row')).toHaveLength(0);
    expect(container.querySelectorAll('table-cell')).toHaveLength(0);
  });

  it('shows the default empty message when emptyMessage is omitted', async () => {
    const { getByText } = renderTable(
      <Table columns={columns} onRequest={emptyTableRequest} />,
    );

    await waitFor(() => {
      expect(getByText('No records to display')).not.toBeNull();
    });
  });

  it('renders no empty-state UI when emptyMessage is null', async () => {
    const { container } = renderTable(
      <Table columns={columns} onRequest={emptyTableRequest} emptyMessage={null} />,
    );

    await waitFor(() => {
      expect(getBodyScroller(container)).not.toBeNull();
    });

    expect(container.querySelector('list-empty-message')).toBeNull();
  });

  it('leaves the header and footer unaffected when the empty message is shown', async () => {
    const { container } = renderTable(
      <Table columns={columns} onRequest={emptyTableRequest} emptyMessage="Nothing here yet" />,
    );

    await waitFor(() => {
      expect(container.querySelector('list-empty-message')).not.toBeNull();
    });

    expect(container.querySelector('table-header')).not.toBeNull();
    expect(container.querySelector('table-footer')).not.toBeNull();
  });

  it('does not show the empty message when records are returned', async () => {
    const { container, getByText } = renderTable(
      <Table columns={columns} onRequest={createTableRequest(records)} emptyMessage="Nothing here yet" />,
    );

    await waitFor(() => {
      expect(getByText('Alpha')).not.toBeNull();
    });

    expect(container.querySelector('list-empty-message')).toBeNull();
  });

  it('renders a React element empty message', async () => {
    const { container } = renderTable(
      <Table columns={columns} onRequest={emptyTableRequest} emptyMessage={<span data-testid="custom-empty">Custom</span>} />,
    );

    await waitFor(() => {
      expect(container.querySelector('[data-testid="custom-empty"]')).not.toBeNull();
    });
  });

  it('does not show the empty message while loading', async () => {
    const pendingRequest: TableOnRequest<TestRecord> = () => new Promise<void>(() => void 0);
    const { container } = renderTable(
      <Table columns={columns} onRequest={pendingRequest} emptyMessage="Nothing here yet" />,
    );

    await waitFor(() => {
      expect(getBodyScroller(container)).not.toBeNull();
    });

    expect(container.querySelector('list-empty-message')).toBeNull();
  });
});

describe('TableRows', () => {
  it('renders rows inside the body scroller after onRequest resolves', async () => {
    const scrollLeftCalls: number[] = [];
    const { container, getByText } = renderTable(
      <TableRows
        columns={columns}
        onRequest={createTableRequest(records)}
        onScrollLeft={value => scrollLeftCalls.push(value)}
      />,
    );

    expect(container.querySelector('table-rows')).not.toBeNull();
    expect(getBodyScroller(container)).not.toBeNull();

    await waitFor(() => {
      expect(getByText('Alpha')).not.toBeNull();
      expect(getByText('Beta')).not.toBeNull();
    });
  });

  it('applies scrollbar-gutter auto on the body scroller-container', async () => {
    const { container } = renderTable(
      <TableRows
        columns={columns}
        onRequest={createTableRequest(records)}
        onScrollLeft={() => void 0}
      />,
    );

    await waitFor(() => {
      expect(getBodyScroller(container)).not.toBeNull();
    });

    expectBodyScrollerScrollbarGutterAuto(container);
  });

  it('reports vertical scrollbar width changes to the parent', async () => {
    const reportedWidths: number[] = [];
    const { container } = renderTable(
      <TableRows
        columns={columns}
        onRequest={createTableRequest(records)}
        onScrollLeft={() => void 0}
        onVerticalScrollbarWidthChange={width => reportedWidths.push(width)}
      />,
    );

    await waitFor(() => {
      expect(getBodyScroller(container)).not.toBeNull();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(reportedWidths.length).toBeGreaterThan(0);
    expect(reportedWidths.at(-1)).toBe(0);
  });
});
