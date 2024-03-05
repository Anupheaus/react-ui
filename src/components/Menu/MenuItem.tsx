import { ReactNode, useContext, useState } from 'react';
import { useBooleanState, useBound, useDOMRef } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { PopupMenuContext } from './PopupMenuContext';
import { SubMenuProvider } from './SubMenuProvider';
import { Skeleton } from '../Skeleton';

const useStyles = createStyles(({ activePseudoClasses, menu: { menuItem: { normal: normalMenuItem, active: activeMenuItem } },
  field: { value: { normal: normalField, active: activeField } }, transition
}) => ({
  menuItem: {
    position: 'relative',
    padding: 8,
    cursor: 'default',
    borderRadius: 4,
    ...normalField,
    ...normalMenuItem,
  },
  isInteractable: {
    cursor: 'pointer',
    ...transition,
    transitionProperty: 'background-color, color',

    [activePseudoClasses]: {
      ...activeField,
      ...activeMenuItem,
    },
  },
  subMenuIcon: {
    marginLeft: 4,
  }
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
      className={join(css.menuItem, !isReadOnly && css.isInteractable, className)}
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
        <Skeleton type={'text'}>{children}</Skeleton>
        {hasSubMenu && <Icon name="sub-menu" size="small" className={css.subMenuIcon} />}
      </SubMenuProvider>
    </Flex>
  );
});