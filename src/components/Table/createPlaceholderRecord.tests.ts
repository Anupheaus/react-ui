import { createPlaceholderRecord } from './createPlaceholderRecord';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';
import type { TableColumn } from './TableModels';

type TestRecord = {
  id: string;
  name: string;
  amount: number;
  active: boolean;
  createdAt: string;
};

const columns: TableColumn<TestRecord>[] = [
  { id: 'name', field: 'name', label: 'Name', type: 'string' },
  { id: 'amount', field: 'amount', label: 'Amount', type: 'currency' },
  { id: 'active', field: 'active', label: 'Active', type: 'boolean' },
  { id: 'createdAt', field: 'createdAt', label: 'Created', type: 'date' },
  { id: TABLE_ACTIONS_COLUMN_ID, field: '__actions', label: '' },
];

describe('createPlaceholderRecord', () => {
  it('creates a placeholder id for the row index', () => {
    const record = createPlaceholderRecord(columns, 3);
    expect(record.id).toBe('table-placeholder-3');
  });

  it('skips the actions column and __actions field', () => {
    const record = createPlaceholderRecord(columns, 0);
    expect(record).not.toHaveProperty('__actions');
    expect(Object.keys(record)).toEqual(['id', 'name', 'amount', 'active', 'createdAt']);
  });

  it('generates deterministic placeholder values per row and column', () => {
    const firstRow = createPlaceholderRecord(columns, 0);
    const secondRow = createPlaceholderRecord(columns, 1);

    expect(typeof firstRow.name).toBe('string');
    expect(firstRow.name.length).toBeGreaterThan(0);
    expect(typeof firstRow.amount).toBe('number');
    expect(typeof firstRow.active).toBe('boolean');
    expect(typeof firstRow.createdAt).toBe('string');

    expect(firstRow.name).not.toBe(secondRow.name);
    expect(firstRow.amount).not.toBe(secondRow.amount);
  });

  it('repeats the same values for the same row index', () => {
    const first = createPlaceholderRecord(columns, 2);
    const second = createPlaceholderRecord(columns, 2);

    expect(first).toEqual(second);
  });
});
