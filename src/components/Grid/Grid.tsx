import { ComponentRenderStyles, ComponentStylesConfig, createComponent } from '../Component';
import { GridRender } from './GridRender';
import { ReactNode } from 'react';
import { Tag } from '../Tag';
import { useBooleanState } from '../../hooks';
import { useUIState } from '../../providers';
import { GridActionsProvider } from './providers/actions/GridActions/GridActionsProvider';
import { GridColumnsProvider } from './providers/columns/GridColumns/GridColumnsProvider';
import { GridRecordsProvider } from './providers/records/GridRecords/GridRecordsProvider';


interface Props {
  children?: ReactNode;
}

function styles() {
  return {
    styles: {
      grid: {
        display: 'flex',
        flex: 'auto',
        position: 'relative',
        width: '100%',
      },
      gridHidden: {
        display: 'none',
      },

    },
  } satisfies ComponentStylesConfig;
}

export const Grid = createComponent({
  id: 'Table',

  styles,

  render: ({
    children = null,
  }: Props, { css }: ComponentRenderStyles<ReturnType<typeof styles>>) => {
    const { isLoading } = useUIState();
    const [isMouseOver, setMouseEntered, setMouseLeft] = useBooleanState();
    const isActionsVisible = isMouseOver && !isLoading;

    return (
      <Tag name="grid" className={css.grid} onMouseOver={setMouseEntered} onMouseEnter={setMouseEntered} onMouseLeave={setMouseLeft} onMouseOut={setMouseLeft}>
        <GridColumnsProvider>
          <GridRecordsProvider>
            <GridActionsProvider>
              <Tag name="grid-hidden" className={css.gridHidden}>
                {children}
              </Tag>
              <GridRender isActionsVisible={isActionsVisible} />
            </GridActionsProvider>
          </GridRecordsProvider>
        </GridColumnsProvider>
      </Tag>
    );
  },
});
