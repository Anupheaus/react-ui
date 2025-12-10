import { Icon } from '../../Icon';
import type { MouseEvent } from 'react';
import { useMemo, type ReactNode } from 'react';
import { InternalList, useListItem } from '../../InternalList';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { useExpander } from '../../Expander';
import { UIState, useUIState } from '../../../providers';
import { ListItem } from './ListItem';
import { Flex } from '../../Flex';
import type { Record } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useBound } from '../../../hooks';
import { Button } from '../../Button';
import { Tag } from '../../Tag';

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
  expandableListItemToggle: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 28,
    cursor: 'pointer',
  },
}));

interface Props<T extends Record, R extends Record> {
  label?: ReactNode;
  items?: R[];
  getItemLabel?(item: T): ReactNode;
  onExpand?(item: T, isExpanded: boolean): void;
  onAdd?(): void;
  onSelect?(item: T): void;
  children?: ReactNode;
}

export const ExpandableListItem = createComponent('ExpandableListItem', <T extends Record, R extends Record>({
  label,
  items,
  getItemLabel,
  onExpand,
  onAdd,
  onSelect,
  children = null,
}: Props<T, R>) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
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

  const selected = useBound(() => {
    if (item == null || isReadOnly) return;
    onSelect?.(item);
  });

  const expand = useBound((event: MouseEvent) => {
    event.stopPropagation();
    if (item == null || isReadOnly) return;
    toggle();
  });

  return (
    <Flex tagName="expandable-list-item" isVertical disableGrow>
      <UIState isLoading={isLoading}>
        <ListItem actions={actions} onSelect={selected}>
          <Flex gap="fields" valign="center">
            <Icon name="dropdown" size="small" className={join(css.rangeListIcon, isExpanded ? '' : 'rotate-90')} />
            {itemName}
          </Flex>
          {!isReadOnly && (<Tag name="expandable-list-item-toggle" className={css.expandableListItemToggle} onClick={expand} />)}
        </ListItem>
        <Expander className={css.expander}>
          <InternalList tagName="expandable-list" items={items} gap={0}>
            {children}
          </InternalList>
        </Expander>
      </UIState>
    </Flex>
  );
});

// export function useExpandableListItem() {
//   const { register, invoke } = useCallbacks();
//   const { Expander, isExpanded, setExpanded } = useExpander();

//   const ExpandableListItem = useMemo(() => createComponent('ExpandableListItem', <T extends Record, R extends Record>(props: Props<T, R>) => {
//     return <ExpandableListItemComponent {...props} />;
//   }), []);

//   return {
//     ExpandableListItem,
//     isExpanded,
//     setExpanded,
//   };
// }