import { useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableColumn } from './TableModels';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import type { UseActions } from '../../hooks';
import { resolveTableTheme } from './resolveTableTheme';

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

  const headerCells = useMemo(() => columns.map((column, columnIndex) => (
    <TableHeaderCell
      key={column.id}
      column={column}
      columnIndex={columnIndex}
      onColumnWidthPersist={onColumnWidthPersist == null ? undefined : (width) => onColumnWidthPersist(column.id, width)}
    />
  )), [columns, onColumnWidthPersist]);

  actions({
    onScrollLeft: value => {
      if (tableHeaderCellsRef.current == null) return;
      tableHeaderCellsRef.current.style.transform = `translateX(${-value}px)`;
    },
  });

  return (
    <Flex tagName="table-header" className={css.header} wide>
      <Flex tagName="table-header-cells" ref={tableHeaderCellsRef} valign="center" maxWidthAndHeight>
        {headerCells}
      </Flex>
    </Flex>
  );
});
