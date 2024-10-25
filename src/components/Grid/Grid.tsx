import type { CSSProperties } from 'react';
import { useMemo, type ReactNode } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import type { GridSpecContextProps } from './GridSpecContext';
import { GridSpecContext } from './GridSpecContext';
import { useForceUpdate, useMap, useOnResize } from '../../hooks';

const useStyles = createStyles(({ gaps }) => ({
  grid: {
    display: 'grid',

    '&.gap-fields': {
      rowGap: gaps.fields,
      columnGap: gaps.fields,
    },
  },
}));

interface GridSpecType {
  width: number;
  columns: number;
}

interface Props {
  tagName?: string;
  className?: string;
  gap?: 'fields' | number;
  columns: number;
  children?: ReactNode;
}

export const Grid = createComponent('Grid', ({
  tagName = 'grid',
  className,
  columns,
  gap,
  children,
}: Props) => {
  const { css, join } = useStyles();
  const { target, width: containerWidth } = useOnResize();
  const specs = useMap<string, GridSpecType>();
  const refresh = useForceUpdate();

  const context = useMemo<GridSpecContextProps>(() => ({
    isValid: true,
    setSpec: (id, width, internalColumns) => {
      specs.set(id, { width, columns: internalColumns });
      refresh();
    },
    deleteSpec: id => {
      specs.delete(id);
      refresh();
    },
  }), []);

  const actualColumns = containerWidth == null ? columns : (specs.toValuesArray().orderBy(({ width }) => width).find(({ width }) => width >= containerWidth)?.columns ?? columns);

  const styles = useMemo<CSSProperties>(() => ({
    gridTemplateColumns: `repeat(${actualColumns}, 1fr)`,
    rowGap: gap !== 'fields' ? gap : undefined,
    columnGap: gap !== 'fields' ? gap : undefined,
  }), [actualColumns, gap]);

  return (
    <GridSpecContext.Provider value={context}>
      <Tag name={tagName} ref={target} className={join(css.grid, gap === 'fields' && 'gap-fields', className)} style={styles}>
        {children}
      </Tag>
    </GridSpecContext.Provider>
  );
});