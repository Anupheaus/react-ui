import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { ConfiguratorCell } from './ConfiguratorCell';
import type { ConfiguratorItem } from './configurator-models';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { Icon } from '../Icon';

const useStyles = createStyles({
  configuratorAddSlice: {
    opacity: 0.5,
  },
});

interface Props {
  columnIndex: number;
  addSliceLabel?: ReactNode;
  onAddSlice(): void;
}

export const ConfiguratorAddSlice = createComponent('ConfiguratorAddSlice', ({
  columnIndex,
  addSliceLabel = 'Add Slice',
  onAddSlice,
}: Props) => {
  const { css } = useStyles();

  const item = useMemo<ConfiguratorItem>(() => ({
    id: 'add-slice',
    text: 'Add Slice',
    data: {},
    subItems: [],
    label: (
      <Flex className={css.configuratorAddSlice} valign="center" gap="fields">
        <Icon name="add" />
        <span>{addSliceLabel}</span>
      </Flex>
    ),
    renderCell: () => null,
  }), []);

  if (onAddSlice == null) return null;

  return (
    <ConfiguratorCell columnIndex={columnIndex} isHeader item={item} isOddItem={false} isSubItem={false} isOddSlice={columnIndex % 2 === 0} onSelect={onAddSlice} />
  );
});
