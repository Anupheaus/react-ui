import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import type { ConfiguratorItem, ConfiguratorSlice } from './configurator-models';
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
  slices?: ConfiguratorSlice<any>[];
  paletteColours?: (string | undefined)[];
  visibleShadows?: OnShadowVisibleChangeEvent;
  onAddItem?(): void;
  children?: ReactNode;
}

export const ConfiguratorAddItem = createComponent('ConfiguratorAddItem', ({
  isOdd,
  isSubItem = false,
  slices = [],
  paletteColours,
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

  const sliceCells = slices.map((slice, index) => (
    <ConfiguratorCell key={slice.id} columnIndex={index + 1} item={item} slice={slice} isOddItem={isOdd} isSubItem={isSubItem}
      isOddSlice={index % 2 === 0} paletteColour={paletteColours?.[index]} />
  ));

  return (
    <Flex tagName="configurator-add-item-row" disableGrow>
      <ConfiguratorCell columnIndex={0} item={item} isOddItem={isOdd} isSubItem={isSubItem} isOddSlice={false} addShadowToRight={visibleShadows?.left} onSelect={onAddItem} />
      {sliceCells}
    </Flex>
  );
});