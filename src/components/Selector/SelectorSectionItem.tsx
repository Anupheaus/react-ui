import { useLayoutEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useBound } from '../../hooks';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Typography } from '../Typography';
import { useRipple } from '../Ripple';

const useStyles = createStyles(({ fields: { content: { normal: { borderRadius, borderColor } } }, buttons: { default: { normal: button } }, pseudoClasses }, { applyTransition }) => ({
  item: {
    borderRadius,
    border: `1px solid ${borderColor}`,
    height: 30,
    padding: 8,
    cursor: 'pointer',
    overflow: 'hidden',
    ...applyTransition('border-color, background-color'),

    '&.is-selected': {
      borderColor: button.borderColor,
      backgroundColor: button.backgroundColor,
    },

    [pseudoClasses.tablet]: {
      height: 50,
      padding: '8px 16px',
    },
  },
  content: {
    position: 'unset', // unset the position so that any sub-elements that use absolute positioning will be positioned relative to the item
  },
}));

interface Props {
  item: ReactListItem;
  width: number;
  isSelected: boolean;
  fullWidthItems?: boolean;
  onUpdateWidth(width: number): void;
  onSelect(item: ReactListItem): void;
}

export const SelectorSectionItem = createComponent('SelectorSectionItem', ({
  item,
  width,
  isSelected,
  fullWidthItems = false,
  onUpdateWidth,
  onSelect,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const lastItemRef = useRef(item);
  const { Ripple, rippleTarget } = useRipple();

  const saveElement = useBound((element: HTMLDivElement | null) => {
    rippleTarget(element);
    if (!element || fullWidthItems) return;
    onUpdateWidth(element.offsetWidth);
  });

  const selectItem = useBound((event: ReactMouseEvent<HTMLDivElement>) => {
    onSelect(item);
    item.onClick?.(ReactListItem.createClickEvent(event, item));
  });

  const style = useInlineStyle(() => ({
    width: !fullWidthItems && width > 0 && lastItemRef.current === item ? `${width}px` : undefined,
  }), [width, fullWidthItems]);

  useLayoutEffect(() => {
    lastItemRef.current = item;
  }, [item]);

  return (
    <Flex ref={saveElement} tagName="selector-section-item" className={join(css.item, isSelected && 'is-selected')} style={style} allowFocus disableGrow={!fullWidthItems}
      wide={fullWidthItems} valign="center" onClick={selectItem}>
      <Ripple stayWithinContainer />
      {fullWidthItems && item.label != null ? item.label : (
        <Flex tagName="selector-section-item-content" gap={6} isVertical align="center" className={css.content}>
          {item.iconName != null && (
            <Icon name={item.iconName} />
          )}
          {item.label != null ? item.label : (
            <Typography type="field-value" disableWrap>
              {item.text}
            </Typography>
          )}
        </Flex>
      )}
    </Flex>
  );
});

