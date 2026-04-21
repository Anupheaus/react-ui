import { createComponent } from '../Component';
import type { ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import { useMemo } from 'react';
import { ConfiguratorCell } from './ConfiguratorCell';
import { Flex } from '../Flex';
import type { OnShadowVisibleChangeEvent } from '../Scroller';

const whitelistFunctions = ['renderCell'];

interface Props {
  item: ConfiguratorSubItem;
  slices: ConfiguratorSlice<any>[];
  isOdd?: boolean;
  paletteColours?: (string | undefined)[];
  visibleShadows?: OnShadowVisibleChangeEvent;
  onExpandItem?(item: ConfiguratorItem<any, any>): void;
}

export const ConfiguratorSubItemRow = createComponent('ConfiguratorSubItemRow', ({
  item,
  slices,
  isOdd = false,
  paletteColours,
  visibleShadows,
  onExpandItem,
}: Props) => {

  const cells = useMemo(() => slices.map((slice, index) => (
    <ConfiguratorCell key={slice.id} columnIndex={index + 1} item={item} slice={slice} isSubItem isOddItem={isOdd} isOddSlice={index % 2 === 0}
      paletteColour={paletteColours?.[index]}
    />
  )), [slices, item, isOdd, paletteColours]);

  return (
    <Flex tagName="configurator-sub-item-row" data-whitelist-functions={whitelistFunctions}>
      <ConfiguratorCell columnIndex={0} item={item} isSubItem isOddItem={isOdd} isOddSlice={false} addShadowToRight={visibleShadows?.left} onExpandItem={onExpandItem} />
      {cells}
    </Flex>
  );
});