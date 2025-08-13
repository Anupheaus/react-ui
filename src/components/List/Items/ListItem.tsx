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
  };
});

interface BasicListItemProps<T extends ReactListItem> {
  className?: string;
  disableRipple?: boolean;
  actions?: ReactNode;
  onSelect?(item: T, index: number): void;
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
  actions = null,
  onSelect,
  children,
}: ListItemWithChildrenProps<T>) => {
  const { css, join } = useStyles();
  const { item, index, isLoading } = useListItem<T>();
  const { isReadOnly } = useUIState();
  const { Ripple, rippleTarget } = useRipple();
  const isClickable = is.function(onSelect) || is.function(item?.onSelect);

  const content = useMemo(() => {
    if (actions == null) return children;
    return (
      <Flex tagName="list-item-content" gap="fields" valign="center">
        {children}
        <Flex tagName="list-item-content-actions" disableGrow>
          {actions}
        </Flex>
      </Flex>
    );
  }, [children, actions]);

  // const alteredTheme = alterTheme(theme => ({
  //   ripple: {
  //     color: theme.buttons.hover.active.backgroundColor,
  //   },
  // }));

  const handleSelect = useBound(() => {
    if (isReadOnly) return;
    if (item == null || is.promise(item)) return;
    if (is.function(onSelect)) onSelect(item, index);
    if (is.function(item?.onSelect)) item.onSelect();
  });

  return (
    <UIState isLoading={isLoading}>
      <Flex
        tagName="list-item"
        ref={rippleTarget}
        className={join(css.listItem, isLoading && 'is-loading', isReadOnly && 'is-read-only', isClickable && 'is-clickable', className)}
        allowFocus
        onClick={handleSelect}
        disableGrow
      >
        {/* <ThemeProvider theme={alteredTheme}> */}
        <Ripple stayWithinContainer isDisabled={disableRipple} />
        {/* </ThemeProvider> */}
        {content}
      </Flex>
    </UIState>
  );
});

export type ListItemProps<T extends ReactListItem> = ListItemWithRenderProps<T> | ListItemWithChildrenProps<T>;

export const ListItem = createComponent('ListItem', <T extends ReactListItem = ReactListItem>({
  className,
  disableRipple = false,
  actions,
  onSelect,
  children = ReactListItem.render,
}: ListItemProps<T>) => {
  if (is.function(children)) {
    return (
      <ListItemWithRender className={className} disableRipple={disableRipple} actions={actions} onSelect={onSelect}>
        {children}
      </ListItemWithRender>
    );
  }
  return (
    <ListItemWithChildren className={className} disableRipple={disableRipple} actions={actions} onSelect={onSelect}>
      {children}
    </ListItemWithChildren>
  );
});
