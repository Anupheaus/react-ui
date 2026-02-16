import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { createStyles } from '../../theme';
import type { ListItemClickEvent } from '../../models';
import { ReactListItem } from '../../models';
import { createComponent } from '../Component';
import { UIState, useUIState } from '../../providers';
import { useRipple } from '../Ripple';
import { useAsync, useBound } from '../../hooks';
import { Flex } from '../Flex';
import type { MouseEvent } from 'react';
import { useMemo, useState, type ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useInternalListContext } from './InternalListContext';
import { Skeleton } from '../Skeleton';
import { Checkbox } from '../Checkbox';
import { Expander } from '../Expander';
import { InternalList } from './InternalList';
import { Tag } from '../Tag';

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
    listItemCheckbox: {

    },
    subItemsList: {
      paddingLeft: 24,
    },
    expander: {
      paddingTop: 4,
    },
    expandableListItemClickCapture: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 28,
      bottom: 0,
      zIndex: 1,
      cursor: 'pointer',
    },
  };
});

interface Props<T> {
  item: ReactListItem<T>;
  index: number;
  isSelectable: boolean;
  onClick?(event: ListItemClickEvent<T>): PromiseMaybe<void>;
}

export const InternalListItem = createComponent('InternalListItem', function <T = void>({
  item,
  index,
  isSelectable: providedIsSelectable,
  onClick,
}: Props<T>) {
  const { css, join } = useStyles();
  const { onSelectChange, onActiveChange, onDelete } = useInternalListContext<T>();
  let { isReadOnly } = useUIState();
  const { Ripple, rippleTarget } = useRipple();
  const { response: data, isLoading, error } = useAsync(() => item.data, [item.data]);

  isReadOnly = isReadOnly || item.isDisabled === true;
  const isSelectable = item.isSelectable || is.function(item.onSelectChange) || providedIsSelectable;
  const isDeletable = !isReadOnly && (item.isDeletable || is.function(onDelete ?? item.onDelete));
  const isExpandable = is.array(item.subItems) && item.subItems.length > 0;
  const isClickable = !isReadOnly && (isSelectable || isExpandable || is.function(onClick ?? item.onClick));
  const [isExpanded, setExpanded] = useState(item.isExpanded ?? false);

  let { content, doNotWrap } = useMemo<{ content: ReactNode; doNotWrap: boolean; }>(() => {
    if (is.function(item.renderItem)) return { content: item.renderItem(item, index, data as T), doNotWrap: true };
    const render = item.render;
    if (error != null) return { content: item.renderError?.(item.id, error, index), doNotWrap: false };
    if (!isLoading) {
      if (!is.function(render)) {
        return { content: item.label ?? item.text, doNotWrap: false };
      } else {
        return { content: render(item.id, data as T, index), doNotWrap: false };
      }
    }
    return {
      content: item.renderLoading?.(item.id, index) ?? (isSelectable ? '' : (
        <Skeleton type="text" useRandomWidth isVisible />
      )),
      doNotWrap: false,
    };
  }, [item, data, isLoading, error, index, isSelectable]);

  const actions = useMemo(() => {
    if (doNotWrap) return null;
    if (item.actions == null && isDeletable !== true) return null;
    return (
      <Flex tagName="list-item-actions" disableGrow>
        {item.actions}
        {isDeletable && (
          <Button variant="hover" size="small" iconOnly onSelect={remove}>
            <Icon name="delete-list-item" size="small" />
          </Button>
        )}
      </Flex>
    );
  }, [item.actions, isDeletable, doNotWrap]);

  const remove = useBound(() => {
    if (!isDeletable || isLoading) return;
    item.onDelete?.(item.id, data as T, index);
    onDelete?.(item.id, data as T, index);
  });

  const handleSelect = useBound(() => {
    if (!isSelectable || isLoading) return;
    const newIsSelected = !item.isSelected;
    item.onSelectChange?.(item.id, data as T, index, newIsSelected);
    onSelectChange(item.id, data as T, index, newIsSelected);
  });

  const focus = useBound(() => {
    if (!isClickable || isLoading) return;
    item.onActiveChange?.(item.id, data as T, index, true);
    onActiveChange(item.id, data as T, index, true);
  });

  const blur = useBound(() => {
    if (!isClickable || isLoading) return;
    item.onActiveChange?.(item.id, data as T, index, false);
    onActiveChange(item.id, data as T, index, false);
  });

  const click = useBound((event: MouseEvent) => {
    if (!isClickable || isLoading) return;
    const hasClick = is.function(item.onClick ?? onClick);
    if (isExpandable && !hasClick) setExpanded(prev => !prev);
    const newEvent = ReactListItem.createClickEvent(event, item);
    item.onClick?.(newEvent);
    onClick?.(newEvent);
  });

  const clickExpandableIcon = useBound((event: MouseEvent) => {
    if (!isExpandable) return;
    event.stopPropagation();
    setExpanded(prev => !prev);
  });

  const iconName = is.plainObject<ReactListItem>(item) ? item.iconName : undefined;

  if (!doNotWrap) {

    if (iconName != null) {
      content = (<>
        {iconName != null && (<Icon name={iconName} size="small" />)}
        {content}
      </>);
    }

    if (isSelectable) {
      content = (
        <Checkbox assistiveHelp={false} value={item.isSelected} onChange={handleSelect} wide>{content}</Checkbox>
      );
    }

    if (isExpandable) {
      content = (<>
        <Icon name="dropdown" size="small" rotate={isExpanded ? 0 : -90} />
        <Tag name="expandable-list-item-click-capture" className={css.expandableListItemClickCapture} onClick={clickExpandableIcon} />
        {content}
      </>);
    }

    content = (
      <Flex
        gap="fields"
        tagName="list-item"
        ref={rippleTarget}
        className={join(css.listItem, isLoading && 'is-loading', isReadOnly && 'is-read-only', isClickable && 'is-clickable', item.className)}
        allowFocus
        disableGrow
        disableShrink
        onClick={click}
        onFocus={focus}
        onBlur={blur}
      >
        <Ripple stayWithinContainer isDisabled={item.disableRipple} />
        <Flex tagName="list-item-content" gap="fields" valign="center" className={css.listItemContent}>
          {content}
        </Flex>
        {actions}
      </Flex>
    );

    if (isExpandable) {
      content = (
        <Flex tagName="list-item-with-sub-items" isVertical disableGrow>
          {content}
          <Expander isExpanded={isExpanded} className={css.expander}>
            <InternalList
              tagName="internal-list-sub-items"
              items={item.subItems}
              showSkeletons={false}
              minHeight="auto"
              disableShadowsOnScroller
              contentClassName={css.subItemsList}
              gap={2}
              onClick={onClick}
            />
          </Expander>
        </Flex>
      );
    }
  }

  return (
    <UIState isLoading={isLoading} isReadOnly={isReadOnly}>
      {content}
    </UIState>
  );
});
