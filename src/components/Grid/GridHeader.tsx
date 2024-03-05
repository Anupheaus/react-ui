import { useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { GridHeaderCell } from './GridHeaderCell';
import { GridColumn } from './GridModels';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { UseActions } from '../../hooks';

const useStyles = createStyles(({ toolbar: { normal: toolbar } }) => ({
  header: {
    flex: 'none',
    zIndex: 1,
    ...toolbar,
    gap: 0,
    padding: 0,
  },
}));

export interface GridHeaderActions {
  onScrollLeft(value: number): void;
}

interface Props {
  columns: GridColumn[];
  actions: UseActions<GridHeaderActions>;
}

export const GridHeader = createComponent('GridHeader', ({
  columns,
  actions,
}: Props) => {
  const { css } = useStyles();
  const gridHeaderCellsRef = useRef<HTMLDivElement | null>(null);

  const headerCells = useMemo(() => {
    return columns
      .map((column, index) => (
        <GridHeaderCell
          key={column.id}
          column={column}
          columnIndex={index}
        />
      ));
  }, [columns]);

  actions({
    onScrollLeft: value => {
      if (gridHeaderCellsRef.current == null) return;
      gridHeaderCellsRef.current.style.transform = `translateX(${-value}px)`;
    },
  });

  // const style = useInlineStyle(() => ({
  //   transform: `translateX(${-scrollLeft}px)`,
  // }), [scrollLeft]);

  return (
    <Flex tagName="grid-header" className={css.header}>
      <Flex tagName="grid-header-cells" ref={gridHeaderCellsRef} valign="center" maxWidthAndHeight>
        {headerCells}
      </Flex>
    </Flex>
  );
});