import { useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableColumn } from './TableModels';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import type { UseActions } from '../../hooks';
import { resolveTableTheme } from './resolveTableTheme';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';

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
      flex: 'auto',
      overflow: 'hidden',
      minWidth: 0,
    },
    headerCells: {
      flex: 'none',
      width: 'max-content',
    },
  };
});

export interface TableHeaderActions {
  onScrollLeft(value: number): void;
}

interface Props {
  columns: TableColumn[];
  actions: UseActions<TableHeaderActions>;
  onColumnWidthPersist?(columnId: string, width: number): void;
}

export const TableHeader = createComponent('TableHeader', ({
  columns,
  actions,
  onColumnWidthPersist,
}: Props) => {
  const { css } = useStyles();
  const tableHeaderCellsRef = useRef<HTMLDivElement | null>(null);

  const { dataColumns, actionsColumn, actionsColumnIndex } = useMemo(() => {
    const actionsIndex = columns.findIndex(column => column.id === TABLE_ACTIONS_COLUMN_ID);
    return {
      dataColumns: columns.filter(column => column.id !== TABLE_ACTIONS_COLUMN_ID),
      actionsColumn: actionsIndex === -1 ? undefined : columns[actionsIndex],
      actionsColumnIndex: actionsIndex,
    };
  }, [columns]);

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

  return (
    <Flex tagName="table-header" className={css.header} wide disableOverflow minWidth={0}>
      <Flex tagName="table-header-scroll" className={css.headerScroll} minWidth={0} wide disableOverflow>
        <Flex tagName="table-header-cells" ref={tableHeaderCellsRef} valign="center" className={css.headerCells}>
          {dataHeaderCells}
        </Flex>
      </Flex>
      {actionsColumn != null && actionsColumnIndex !== -1 && (
        <TableHeaderCell
          key={actionsColumn.id}
          column={actionsColumn}
          columnIndex={actionsColumnIndex}
        />
      )}
    </Flex>
  );
});
