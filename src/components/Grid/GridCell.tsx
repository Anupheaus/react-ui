import { createStyles } from '../../theme/createStyles';
import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { GridColumn } from './GridModels';
import { GridTheme } from './GridTheme';

interface Props {
  column: GridColumn;
  isLastRow?: boolean;
  children: ReactNode;
}
const useStyles = createStyles(({ useTheme }, { isLastRow = false }: Props) => {
  const { borders: { color: borderColor }, rows: { fontSize } } = useTheme(GridTheme);
  return {
    styles: {
      gridCell: {
        display: 'flex',
        borderColor,
        borderWidth: 0,
        borderBottomWidth: isLastRow ? 0 : 1,
        borderStyle: 'solid',
        padding: '4px 8px',
        fontSize,
        cursor: 'default',
      },
    },
  };
});

export const GridCell = createComponent('GridCell', ({
  // column,
  children,
}: Props) => {
  const { css } = useStyles();
  return (
    <Tag name="grid-cell" className={css.gridCell}>
      {children}
    </Tag>
  );
});