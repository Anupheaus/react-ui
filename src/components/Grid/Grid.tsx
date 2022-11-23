import { createComponent } from '../Component';
import { GridRender } from './GridRender';
import { GridColumnType } from './GridModels';
import { GridTheme } from './GridTheme';
import { to } from '@anupheaus/common';
import { CSSProperties, useMemo, useState } from 'react';
import { Tag } from '../Tag';
import { Scroller } from '../Scroller';
import { GridContexts } from './GridContexts';

interface Props<T = unknown> {
  columns: GridColumnType<T>[];
  records?: T[];
}

export const Grid = createComponent({
  id: 'Table',

  styles: ({ useTheme }) => {
    const { definition: { borders: { color: borderColor, radius } } } = useTheme(GridTheme);
    return {
      styles: {
        grid: {
          display: 'flex',
          flex: 'auto',
          borderColor,
          borderWidth: 1,
          //borderStyle: 'solid',
          overflow: 'hidden',
          borderRadius: radius,
          position: 'relative',
          gap: 0,
        },
        gridHidden: {
          display: 'none',
        },
        gridInsetShadow: {
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 6px rgba(0 0 0 / 24%)',
          pointerEvents: 'none',
        },
      },
    };
  },

  render: ({
    columns: propsColumns,
    records,
  }: Props, { css }) => {
    const columns = useMemo(() => to.array(propsColumns ?? []), [propsColumns]);
    const [headerHeight, setHeaderHeight] = useState<number>();

    const insetShadowStyle = useMemo<CSSProperties>(() => ({
      top: headerHeight ?? 0,
    }), [headerHeight]);

    return (
      <Tag name="grid" className={css.grid}>
        <GridContexts.setHeaderHeight.Provider value={setHeaderHeight}>
          <Scroller disableShadows offsetTop={headerHeight}>
            <GridRender columns={columns} records={records} />
          </Scroller>
          <Tag name="grid-inset-shadow" className={css.gridInsetShadow} style={insetShadowStyle} />
        </GridContexts.setHeaderHeight.Provider>
      </Tag>
    );
  },
});
