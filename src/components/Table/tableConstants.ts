export const TABLE_ACTIONS_COLUMN_ID = 'table-actions';

/** Matches `TableRows` container `borderWidth`. Offsets header padding when aligning with the body scroller. */
export const TABLE_BODY_BORDER_WIDTH = 1;

interface PersistableTableColumn {
  id: string;
  isResizable?: boolean;
}

/** Only manually resizable data columns are stored in `TableSettings.columnWidths`. */
export function canPersistTableColumnWidth(column: PersistableTableColumn): boolean {
  return column.id !== TABLE_ACTIONS_COLUMN_ID && column.isResizable === true;
}

const TABLE_ROW_ACTIONS_PADDING_X = 24;
const TABLE_ROW_ACTION_BUTTON_SIZE = 20;
const TABLE_ROW_ACTION_BUTTON_GAP = 4;

export function estimateTableActionsColumnWidth(actionCount: number): number {
  if (actionCount <= 0) return 0;
  return TABLE_ROW_ACTIONS_PADDING_X
    + actionCount * TABLE_ROW_ACTION_BUTTON_SIZE
    + (actionCount - 1) * TABLE_ROW_ACTION_BUTTON_GAP;
}
