import { splitTableColumns } from './splitTableColumns';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';
import type { TableColumn } from './TableModels';

type TestRecord = { id: string; name: string };

const dataColumn: TableColumn<TestRecord> = { id: 'name', field: 'name', label: 'Name' };
const actionsColumn: TableColumn<TestRecord> = { id: TABLE_ACTIONS_COLUMN_ID, field: '__actions', label: '' };

describe('splitTableColumns', () => {
  it('separates the actions column from data columns', () => {
    const columns = [dataColumn, actionsColumn];
    const { dataColumns, actionsColumn: actions, actionsColumnIndex } = splitTableColumns(columns);

    expect(dataColumns).toEqual([dataColumn]);
    expect(actions).toBe(actionsColumn);
    expect(actionsColumnIndex).toBe(1);
  });

  it('returns undefined actions when no actions column is present', () => {
    const columns = [dataColumn];
    const { dataColumns, actionsColumn: actions, actionsColumnIndex } = splitTableColumns(columns);

    expect(dataColumns).toEqual([dataColumn]);
    expect(actions).toBeUndefined();
    expect(actionsColumnIndex).toBe(-1);
  });

  it('finds the actions column regardless of position', () => {
    const columns = [actionsColumn, dataColumn];
    const { dataColumns, actionsColumn: actions, actionsColumnIndex } = splitTableColumns(columns);

    expect(dataColumns).toEqual([dataColumn]);
    expect(actions).toBe(actionsColumn);
    expect(actionsColumnIndex).toBe(0);
  });
});
