import { useLayoutEffect, useRef } from 'react';
import { useBound } from '../../hooks';
import type { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Typography } from '../Typography';
import { useRipple } from '../Ripple';

const useStyles = createStyles(({ fields: { content: { normal: { borderRadius, borderColor } } }, buttons: { default: { normal: button } } }, { applyTransition }) => ({
  item: {
    borderRadius,
    border: `1px solid ${borderColor}`,
    height: 50,
    padding: 8,
    cursor: 'pointer',
    overflow: 'hidden',
    ...applyTransition('border-color, background-color'),

    '&.is-selected': {
      borderColor: button.borderColor,
      backgroundColor: button.backgroundColor,
    },
  },
}));

interface Props {
  item: ReactListItem;
  width: number;
  isSelected: boolean;
  onUpdateWidth(width: number): void;
  onSelect(item: ReactListItem): void;
}

export const SelectorSectionItem = createComponent('SelectorSectionItem', ({
  item,
  width,
  isSelected,
  onUpdateWidth,
  onSelect,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const lastItemRef = useRef(item);
  const { Ripple, rippleTarget } = useRipple();

  const saveElement = useBound((element: HTMLDivElement | null) => {
    rippleTarget(element);
    if (!element) return;
    onUpdateWidth(element.offsetWidth);
  });

  const selectItem = useBound(() => onSelect(item));

  const style = useInlineStyle(() => ({
    width: width > 0 && lastItemRef.current === item ? `${width}px` : undefined,
  }), [width]);

  useLayoutEffect(() => {
    lastItemRef.current = item;
  }, [item]);

  return (
    <Flex ref={saveElement} tagName="selector-section-item" className={join(css.item, isSelected && 'is-selected')} style={style} allowFocus disableGrow valign="center" onClick={selectItem}>
      <Ripple stayWithinContainer />
      <Flex tagName="selector-section-item-content" gap={6} isVertical align="center">
        {item.iconName != null && (
          <Icon name={item.iconName} />
        )}
        <Typography type="field-value" disableWrap>
          {item.label ?? item.text}
        </Typography>
      </Flex>
    </Flex>
  );
});

