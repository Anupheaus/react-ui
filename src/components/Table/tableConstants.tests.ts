import {
  canPersistTableColumnWidth,
  estimateTableActionsColumnWidth,
  TABLE_ACTIONS_COLUMN_ID,
  TABLE_BODY_BORDER_WIDTH,
} from './tableConstants';

describe('tableConstants', () => {
  it('uses a stable id for the synthetic actions column', () => {
    expect(TABLE_ACTIONS_COLUMN_ID).toBe('table-actions');
  });

  it('matches the table body border width used for header alignment', () => {
    expect(TABLE_BODY_BORDER_WIDTH).toBe(1);
  });
});

describe('canPersistTableColumnWidth', () => {
  it('allows resizable data columns', () => {
    expect(canPersistTableColumnWidth({ id: 'name', isResizable: true })).toBe(true);
  });

  it('rejects non-resizable columns', () => {
    expect(canPersistTableColumnWidth({ id: 'status', isResizable: false })).toBe(false);
    expect(canPersistTableColumnWidth({ id: 'status' })).toBe(false);
  });

  it('rejects the actions column even when marked resizable', () => {
    expect(canPersistTableColumnWidth({ id: TABLE_ACTIONS_COLUMN_ID, isResizable: true })).toBe(false);
  });
});

describe('estimateTableActionsColumnWidth', () => {
  it('returns 0 when there are no actions', () => {
    expect(estimateTableActionsColumnWidth(0)).toBe(0);
    expect(estimateTableActionsColumnWidth(-1)).toBe(0);
  });

  it('estimates width for one action button', () => {
    expect(estimateTableActionsColumnWidth(1)).toBe(44);
  });

  it('estimates width for multiple action buttons including gaps', () => {
    expect(estimateTableActionsColumnWidth(2)).toBe(68);
    expect(estimateTableActionsColumnWidth(3)).toBe(92);
  });
});
