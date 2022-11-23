import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { GridColumnType } from './GridModels';
import { GridTheme } from './GridTheme';

interface Props {
  column: GridColumnType;
  isLastRow?: boolean;
  children: ReactNode;
}

export const GridCell = createComponent({
  id: 'GridCell',

  styles: ({ useTheme }, { isLastRow = false }: Props) => {
    const { definition: { borders: { color: borderColor }, rows: { fontSize } } } = useTheme(GridTheme);
    return {
      styles: {
        gridCell: {
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
  },

  render({
    // column,
    children,
  }: Props, { css }) {
    return (
      <Tag name="grid-cell" className={css.gridCell}>
        {children}
      </Tag>
    );
  },
});