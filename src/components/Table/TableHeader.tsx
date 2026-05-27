import { useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableColumn } from './TableModels';
import { Flex } from '../Flex';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import type { UseActions } from '../../hooks';
import { resolveTableTheme } from './resolveTableTheme';
import { splitTableColumns } from './splitTableColumns';
import { TABLE_BODY_BORDER_WIDTH } from './tableConstants';
import { useTableActionsColumnWidth } from './TableActionsColumnWidthContext';

const useStyles = createStyles((theme) => {
  const { toolbar: { normal: toolbar } } = theme;
  const { headerBackgroundColor } = resolveTableTheme(theme);

  return {
    header: {
      flex: 'none',
      zIndex: 1,
      ...toolbar,
      backgroundColor: headerBackgroundColor,
      boxShadow: 'none',
      gap: 0,
      padding: 0,
    },
    headerScroll: {
      flex: '0 1 auto',
      overflow: 'hidden',
      minWidth: 0,
    },
    headerCells: {
      flex: 'none',
      width: 'max-content',
    },
    headerFill: {
      flex: '1 1 auto',
      minWidth: 0,
      alignSelf: 'stretch',
    },
  };
});

export interface TableHeaderActions {
  onScrollLeft(value: number): void;
}

interface Props {
  columns: TableColumn[];
  actions: UseActions<TableHeaderActions>;
  scrollbarWidth?: number;
  onColumnWidthPersist?(columnId: string, width: number): void;
}

export const TableHeader = createComponent('TableHeader', ({
  columns,
  actions,
  scrollbarWidth = 0,
  onColumnWidthPersist,
}: Props) => {
  const { css, useInlineStyle } = useStyles();
  const tableHeaderCellsRef = useRef<HTMLDivElement | null>(null);
  const actionsColumnWidth = useTableActionsColumnWidth();

  const { dataColumns, actionsColumn, actionsColumnIndex } = useMemo(
    () => splitTableColumns(columns),
    [columns],
  );

  const dataHeaderCells = useMemo(() => dataColumns.map((column) => {
    const columnIndex = columns.findIndex(({ id }) => id === column.id);
    return (
      <TableHeaderCell
        key={column.id}
        column={column}
        columnIndex={columnIndex}
        onColumnWidthPersist={onColumnWidthPersist == null ? undefined : (width) => onColumnWidthPersist(column.id, width)}
      />
    );
  }), [columns, dataColumns, onColumnWidthPersist]);

  actions({
    onScrollLeft: value => {
      if (tableHeaderCellsRef.current == null) return;
      tableHeaderCellsRef.current.style.transform = `translateX(${-value}px)`;
    },
  });

  const style = useInlineStyle(() => ({
    paddingRight: scrollbarWidth + TABLE_BODY_BORDER_WIDTH,
  }), [scrollbarWidth]);

  return (
    <Flex tagName="table-header" className={css.header} style={style} wide disableOverflow minWidth={0}>
      <Flex tagName="table-header-scroll" className={css.headerScroll} minWidth={0} disableOverflow>
        <Flex tagName="table-header-cells" ref={tableHeaderCellsRef} valign="center" className={css.headerCells}>
          {dataHeaderCells}
        </Flex>
      </Flex>
      {actionsColumn != null && actionsColumnIndex !== -1 && (actionsColumnWidth ?? 0) > 0 && (<>
        <Tag name="table-header-fill" className={css.headerFill} />
        <TableHeaderCell
          key={actionsColumn.id}
          column={actionsColumn}
          columnIndex={actionsColumnIndex}
        />
      </>)}
    </Flex>
  );
});
