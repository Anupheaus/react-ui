import { ReactNode, useContext, useState } from 'react';
import { useBooleanState, useBound, useDOMRef } from '../../hooks';
import { createStyles2 } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { PopupMenuContext } from './PopupMenuContext';
import { SubMenuProvider } from './SubMenuProvider';

const useStyles = createStyles2(({ animation, menu: { menuItem: { default: defaultMenuItem, active: activeMenuItem } }, activePseudoClasses }) => ({
  menuItem: {
    ...defaultMenuItem,
    ...animation,
    position: 'relative',
    cursor: 'default',
    transitionProperty: 'background-color, color',

    '&.is-interactive': {
      cursor: 'pointer',

    },

    [activePseudoClasses]: {
      '&.is-interactive': {
        ...activeMenuItem,
      },
    },
  },
  subMenuIcon: {
    marginLeft: 4,
  },
}));

interface Props {
  className?: string;
  isReadOnly?: boolean;
  children: ReactNode;
  onSelect?(): void;
}

export const MenuItem = createComponent('MenuItem', ({
  className,
  isReadOnly = false,
  children,
  onSelect,
}: Props) => {
  const { css, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const [isOver, setIsOver, setIsNotOver] = useBooleanState(false);
  const [element, setElement] = useState<HTMLDivElement>();
  const target = useDOMRef([rippleTarget, setElement]);
  const [hasSubMenu, setHasSubMenu] = useState(false);
  const { close } = useContext(PopupMenuContext);

  const handleSelect = useBound(() => {
    close();
    onSelect?.();
  });

  return (
    <Flex
      tagName="menu-item"
      ref={target}
      className={join(css.menuItem, !isReadOnly && 'is-interactive', className)}
      allowFocus
      onMouseOver={setIsOver}
      onMouseEnter={setIsOver}
      onMouseLeave={setIsNotOver}
      onMouseOut={setIsNotOver}
      onClick={handleSelect}
      disableGrow
    >
      <Ripple stayWithinContainer />
      <SubMenuProvider element={element} isVisible={isOver} onHasSubMenu={setHasSubMenu}>
        {children}
        {hasSubMenu && <Icon name="sub-menu" size="small" className={css.subMenuIcon} />}
      </SubMenuProvider>
    </Flex>
  );
});