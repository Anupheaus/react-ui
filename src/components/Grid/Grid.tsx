import { createComponent } from '../Component';
import { GridRender } from './GridRender';
import { ReactNode } from 'react';
import { Tag } from '../Tag';
import { useBooleanState } from '../../hooks';
import { useUIState } from '../../providers';
import { GridActionsProvider } from './providers/actions/GridActions/GridActionsProvider';
import { GridColumnsProvider } from './providers/columns/GridColumns/GridColumnsProvider';
import { GridRecordsProvider } from './providers/records/GridRecords/GridRecordsProvider';
import { createStyles } from '../../theme';


interface Props {
  children?: ReactNode;
}

const useStyles = createStyles({
  grid: {
    display: 'flex',
    flex: 'auto',
    position: 'relative',
    width: '100%',
  },
  gridHidden: {
    display: 'none',
  },
});

export const Grid = createComponent('Grid', ({
  children = null,
}: Props) => {
  const { css } = useStyles();
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
});
