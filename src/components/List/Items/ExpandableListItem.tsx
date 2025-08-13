import { Icon } from '../../Icon';
import { useMemo, type ReactNode } from 'react';
import { InternalList, useListItem } from '../../InternalList';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { useExpander } from '../../Expander';
import { UIState } from '../../../providers';
import { ListItem } from './ListItem';
import { Flex } from '../../Flex';
import type { Record } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useBound } from '../../../hooks';
import { Button } from '../../Button';

const useStyles = createStyles((_ignore, { applyTransition }) => ({
  rangeListIcon: {
    ...applyTransition('transform'),

    '&.rotate-90': {
      transform: 'rotate(-90deg)',
    },
  },
  expander: {
    paddingLeft: 16,
  },
}));

interface Props<T extends Record, R extends Record> {
  label?: ReactNode;
  items?: R[];
  getItemLabel?(item: T): ReactNode;
  onExpand?(item: T, isExpanded: boolean): void;
  onAdd?(): void;
  children?: ReactNode;
}

export const ExpandableListItem = createComponent('ExpandableListItem', <T extends Record, R extends Record>({
  label,
  items,
  getItemLabel,
  onExpand,
  onAdd,
  children = null,
}: Props<T, R>) => {
  const { css, join } = useStyles();
  const { item, isLoading } = useListItem<T>();
  const handleOnExpand = useBound((isExpanded: boolean) => {
    if (item == null || onExpand == null) return;
    onExpand(item, isExpanded);
  });
  const { Expander, isExpanded, toggle } = useExpander(false, handleOnExpand);

  const itemName = useMemo(() => {
    if (label != null) return label;
    if (item == null) return null;
    if (is.function(getItemLabel)) return getItemLabel(item);
    if ('label' in item) return item.label as ReactNode;
    if ('text' in item) return item.text as string;
    return null;
  }, [label, item, getItemLabel]);

  const actions = useMemo(() => {
    if (onAdd == null) return null;
    return <Button variant="hover" size="small" onClick={onAdd} iconOnly><Icon name="add" size="small" /></Button>;
  }, [onAdd]);

  return (
    <Flex tagName="expandable-list-item" isVertical disableGrow>
      <UIState isLoading={isLoading}>
        <ListItem actions={actions} onSelect={toggle}>
          <Flex gap="fields" valign="center">
            <Icon name="dropdown" size="small" className={join(css.rangeListIcon, isExpanded ? '' : 'rotate-90')} />
            {itemName}
          </Flex>
        </ListItem>
        <Expander className={css.expander}>
          <InternalList tagName="expandable-list" items={items}>
            {children}
          </InternalList>
        </Expander>
      </UIState>
    </Flex>
  );
});