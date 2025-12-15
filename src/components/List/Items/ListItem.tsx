import type { ListItem as ListItemType } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { createStyles } from '../../../theme';
import { ReactListItem } from '../../../models';
import { createComponent } from '../../Component';
import { UIState, useUIState } from '../../../providers';
import { useRipple } from '../../Ripple';
import { useBound } from '../../../hooks';
import { Flex } from '../../Flex';
import { useListItem } from '../../InternalList';
import { useMemo, type ReactNode } from 'react';
import { Button } from '../../Button';
import { Icon } from '../../Icon';

const useStyles = createStyles(({ pseudoClasses, list: { item } }, { applyTransition, valueOf }) => {
  const activeValues = valueOf(item).using('active', 'normal');
  return {
    listItem: {
      position: 'relative',
      padding: item.normal.padding,
      borderRadius: 4,
      backgroundColor: item.normal.backgroundColor,
      color: item.normal.textColor,
      fontSize: item.normal.textSize,
      fontWeight: item.normal.textWeight,
      userSelect: 'none',
      cursor: 'default',
      width: '100%',
      overflow: 'hidden', // prevents the ripple from going out of the border radius
      ...applyTransition('background-color'),

      '&.is-clickable': {
        cursor: 'pointer',
      },

      [pseudoClasses.active]: {
        backgroundColor: activeValues.andProperty('backgroundColor'),
        borderRadius: activeValues.andProperty('borderRadius'),
        borderColor: activeValues.andProperty('borderColor'),
        borderWidth: activeValues.andProperty('borderWidth'),
        color: activeValues.andProperty('textColor'),
        fontSize: activeValues.andProperty('textSize'),
        fontWeight: activeValues.andProperty('textWeight'),
        padding: activeValues.andProperty('padding'),
      },
    },
    listItemContent: {
      position: 'unset',
    },
  };
});

interface BasicListItemProps<T extends ReactListItem> {
  className?: string;
  disableRipple?: boolean;
  actions?: ReactNode;
  item?: T;
  onSelect?(item: T, index: number): void;
  onDelete?(item: T): void;
}

interface ListItemWithRenderProps<T extends ReactListItem> extends BasicListItemProps<T> {
  children(item: T | undefined, index: number, isLoading: boolean): ReactNode;
}


const ListItemWithRender = createComponent('ListItemWithRender', <T extends ReactListItem = ReactListItem>({
  children,
  ...props
}: ListItemWithRenderProps<T>) => {
  const { item, index, isLoading } = useListItem<T>();

  return (
    <ListItemWithChildren {...props}>
      {children(item, index, isLoading)}
    </ListItemWithChildren>
  );
});

interface ListItemWithChildrenProps<T extends ReactListItem> extends BasicListItemProps<T> {
  children?: ReactNode;
}

const ListItemWithChildren = createComponent('ListItemWithChildren', <T extends ReactListItem = ReactListItem>({
  className,
  disableRipple = false,
  actions: providedActions,
  item: providedItem,
  onSelect,
  onDelete: listItemOnDelete,
  children,
}: ListItemWithChildrenProps<T>) => {
  const { css, join } = useStyles();
  let { item, index, isLoading, onDelete: listOnDelete } = useListItem<T>();
  item = providedItem ?? item;
  const { isReadOnly } = useUIState();
  const { Ripple, rippleTarget } = useRipple();
  const isClickable = is.function(onSelect) || is.function(item?.onSelect);

  const onDelete = useMemo(() => {
    if ((!is.function(listItemOnDelete) && !is.function(listOnDelete)) || item == null) return undefined;
    return () => {
      listItemOnDelete?.(item!);
      listOnDelete?.(item!);
    };
  }, [listItemOnDelete, listOnDelete, item]);

  const actions = useMemo(() => {
    if (providedActions == null && onDelete == null) return null;
    return (
      <Flex tagName="list-item-actions" disableGrow>
        {providedActions}
        {onDelete != null && (
          <Button variant="hover" size="small" iconOnly onSelect={onDelete}>
            <Icon name="delete-list-item" size="small" />
          </Button>
        )}
      </Flex>
    );
  }, [providedActions, onDelete]);

  const handleSelect = useBound(() => {
    if (isReadOnly) return;
    if (item == null || is.promise(item)) return;
    if (is.function(onSelect)) onSelect(item, index);
    if (is.function(item?.onSelect)) item.onSelect();
  });

  return (
    <UIState isLoading={isLoading}>
      <Flex
        gap="fields"
        tagName="list-item"
        ref={rippleTarget}
        className={join(css.listItem, isLoading && 'is-loading', isReadOnly && 'is-read-only', isClickable && 'is-clickable', className)}
        allowFocus
        onClick={handleSelect}
        disableGrow
        disableShrink
      >
        <Ripple stayWithinContainer isDisabled={disableRipple} />
        <Flex tagName="list-item-content" gap="fields" valign="center" className={css.listItemContent}>
          {item?.iconName != null && (<Icon name={item.iconName} size="small" />)}
          {children}
        </Flex>
        {actions}
      </Flex>
    </UIState>
  );
});

export type ListItemProps<T extends ReactListItem> = ListItemWithRenderProps<T> | ListItemWithChildrenProps<T>;

export const ListItem = createComponent('ListItem', <T extends ListItemType = ReactListItem>({
  className,
  disableRipple = false,
  actions,
  onSelect,
  onDelete,
  children = ReactListItem.render,
  ...props
}: ListItemProps<T>) => {
  if (is.function(children)) {
    return (
      <ListItemWithRender {...props} className={className} disableRipple={disableRipple} actions={actions} onSelect={onSelect} onDelete={onDelete}>
        {children}
      </ListItemWithRender>
    );
  }
  return (
    <ListItemWithChildren {...props} className={className} disableRipple={disableRipple} actions={actions} onSelect={onSelect} onDelete={onDelete}>
      {children}
    </ListItemWithChildren>
  );
});
