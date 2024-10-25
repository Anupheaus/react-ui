import { useContext, type ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { GridSpecContext } from './GridSpecContext';

const useStyles = createStyles({
  gridCell: {
    display: 'flex',
  },
});

interface Props {
  children?: ReactNode;
}

export const GridCell = createComponent('GridCell', ({
  children = null,
}: Props) => {
  const { isValid } = useContext(GridSpecContext);
  const { css } = useStyles();

  if (!isValid) throw new Error('GridCell must be used inside a Grid component.');

  return (
    <Tag name="grid-cell" className={css.gridCell}>
      {children}
    </Tag>
  );
});