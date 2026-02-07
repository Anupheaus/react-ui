import { createComponent } from '../Component';
import type { ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import { useMemo } from 'react';
import { ConfiguratorCell } from './ConfiguratorCell';
import { Flex } from '../Flex';

interface Props {
  item: ConfiguratorSubItem;
  slices: ConfiguratorSlice<any>[];
  isOdd?: boolean;
  onExpandItem?(item: ConfiguratorItem<any, any>): void;
}

export const ConfiguratorSubItemRow = createComponent('ConfiguratorSubItemRow', ({
  item,
  slices,
  isOdd = false,
  onExpandItem,
}: Props) => {

  const cells = useMemo(() => slices.map((slice, index) => (
    <ConfiguratorCell key={slice.id} columnIndex={index + 1} item={item} slice={slice} isSubItem isOddItem={isOdd} isOddSlice={index % 2 === 0}
    />
  )), [slices, item, isOdd]);

  return (
    <Flex tagName="configurator-sub-item-row">
      <ConfiguratorCell columnIndex={0} item={item} isSubItem isOddItem={isOdd} isOddSlice={false} onExpandItem={onExpandItem} />
      {cells}
    </Flex>
  );
});