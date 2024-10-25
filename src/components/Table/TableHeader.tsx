import { useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { TableHeaderCell } from './TableHeaderCell';
import type { TableColumn } from './TableModels';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import type { UseActions } from '../../hooks';

const useStyles = createStyles(({ toolbar: { normal: toolbar } }) => ({
  header: {
    flex: 'none',
    zIndex: 1,
    ...toolbar,
    gap: 0,
    padding: 0,
  },
}));

export interface TableHeaderActions {
  onScrollLeft(value: number): void;
}

interface Props {
  columns: TableColumn[];
  actions: UseActions<TableHeaderActions>;
}

export const TableHeader = createComponent('TableHeader', ({
  columns,
  actions,
}: Props) => {
  const { css } = useStyles();
  const tableHeaderCellsRef = useRef<HTMLDivElement | null>(null);

  const headerCells = useMemo(() => {
    return columns
      .map((column, index) => (
        <TableHeaderCell
          key={column.id}
          column={column}
          columnIndex={index}
        />
      ));
  }, [columns]);

  actions({
    onScrollLeft: value => {
      if (tableHeaderCellsRef.current == null) return;
      tableHeaderCellsRef.current.style.transform = `translateX(${-value}px)`;
    },
  });

  // const style = useInlineStyle(() => ({
  //   transform: `translateX(${-scrollLeft}px)`,
  // }), [scrollLeft]);

  return (
    <Flex tagName="table-header" className={css.header}>
      <Flex tagName="table-header-cells" ref={tableHeaderCellsRef} valign="center" maxWidthAndHeight>
        {headerCells}
      </Flex>
    </Flex>
  );
});