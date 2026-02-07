import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import type { ConfiguratorItem } from './configurator-models';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { ConfiguratorCell } from './ConfiguratorCell';
import type { OnShadowVisibleChangeEvent } from '../Scroller';

const useStyles = createStyles({
  configuratorAddItem: {
    opacity: 0.5,
  },
});

interface Props {
  isOdd: boolean;
  isSubItem?: boolean;
  visibleShadows?: OnShadowVisibleChangeEvent;
  onAddItem?(): void;
  children?: ReactNode;
}

export const ConfiguratorAddItem = createComponent('ConfiguratorAddItem', ({
  isOdd,
  isSubItem = false,
  visibleShadows,
  onAddItem,
  children = 'Add Item',
}: Props) => {
  const { css } = useStyles();

  const item = useMemo<ConfiguratorItem>(() => ({
    id: 'add-item',
    text: 'Add Item',
    data: {},
    subItems: [],
    label: (
      <Flex className={css.configuratorAddItem} valign="center" gap="fields">
        <Icon name="add" />
        {children}
      </Flex>
    ),
    renderCell: () => null,
  }), [children]);

  if (onAddItem == null) return null;

  return (
    <ConfiguratorCell columnIndex={0} item={item} isOddItem={isOdd} isSubItem={isSubItem} isOddSlice={false} addShadowToRight={visibleShadows?.left} onSelect={onAddItem} />
  );
});