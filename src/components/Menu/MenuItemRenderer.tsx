import type { MouseEvent } from 'react';
import { useContext, useState } from 'react';
import { useBooleanState, useBound, useDOMRef } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { ReactListItem } from '../../models';
import { PopupMenuContext } from './PopupMenuContext';
import { SubMenuProvider } from './SubMenuProvider';
import type { ComponentProps, ComponentType } from 'react';
import type { Menu } from './Menu';
import { is } from '@anupheaus/common';
import type { ListItemClickEvent } from '../../models';

const useStyles = createStyles(({
  buttons: { hover: { normal: normalButton, active: activeButton } },
  fields: { content: { normal: normalFieldContent }, value: { normal: normalField, active: activeField } },
  pseudoClasses
}, { applyTransition }) => ({
  menuItem: {
    position: 'relative',
    padding: 8,
    cursor: 'pointer',
    ...normalField,
    ...normalButton,
    ...applyTransition('background-color, color'),

    [pseudoClasses.active]: {
      ...activeField,
      ...activeButton,
    },

    [pseudoClasses.readOnly]: {
      cursor: 'default',
      transition: 'none',
      pointerEvents: 'none',
    },

    '&.is-element-content': {
      gap: 4,
      alignItems: 'center',
    },

    [pseudoClasses.tablet]: {
      margin: 4,
      borderRadius: normalFieldContent.borderRadius,
      border: `1px solid ${normalFieldContent.borderColor}`,
      flexGrow: '1 !important',
      minHeight: 60,
      alignItems: 'center',
    },
  },
  subMenuIcon: {
    marginLeft: 4,
  }
}));

type MenuComponentProps = ComponentProps<typeof Menu>;

interface Props {
  item: ReactListItem;
  index: number;
  onClick?(event: ListItemClickEvent): void;
  MenuComponent: ComponentType<MenuComponentProps>;
}

export const MenuItemRenderer = createComponent('MenuItemRenderer', ({
  item,
  index,
  onClick,
  MenuComponent,
}: Props) => {
  const { css, theme, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const [isOver, setIsOver, setIsNotOver] = useBooleanState(false);
  const [element, setElement] = useState<HTMLDivElement>();
  const target = useDOMRef([rippleTarget, setElement]);
  const hasSubItems = is.array(item.subItems) && item.subItems.length > 0;
  const { isValid, close } = useContext(PopupMenuContext);

  const handleSelect = useBound((event: MouseEvent) => {
    const clickEvent = ReactListItem.createClickEvent(event, item, index);
    if (isValid) {
      close();
      setTimeout(() => {
        item.onClick?.(clickEvent);
        onClick?.(clickEvent);
      }, theme.transitions.duration);
    } else {
      item.onClick?.(clickEvent);
      onClick?.(clickEvent);
    }
  });

  const content = item.label ?? item.text;
  const isElementContent = !is.string(content);

  const itemContent = (
    <Flex
      tagName="menu-item"
      ref={target}
      className={join(css.menuItem, isElementContent && 'is-element-content', item.className)}
      allowFocus
      onMouseOver={setIsOver}
      onMouseEnter={setIsOver}
      onMouseLeave={setIsNotOver}
      onMouseOut={setIsNotOver}
      onClick={handleSelect}
      disableGrow
    >
      <Ripple stayWithinContainer isDisabled={item.disableRipple} />
      {item.iconName != null && <Icon name={item.iconName} size="small" />}
      {content}
      {hasSubItems && <Icon name="sub-menu" size="small" className={css.subMenuIcon} />}
    </Flex>
  );

  if (hasSubItems) {
    return (
      <SubMenuProvider isVisible={isOver} element={element} onHasSubMenu={() => void 0}>
        {itemContent}
        <MenuComponent items={item.subItems!} onClick={onClick} />
      </SubMenuProvider>
    );
  }

  return itemContent;
});
