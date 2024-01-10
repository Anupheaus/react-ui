import { ReactNode, useContext, useState } from 'react';
import { useBooleanState, useBound, useDOMRef } from '../../hooks';
import { createStyles, TransitionTheme } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useRipple } from '../Ripple';
import { MenuTheme } from './MenuTheme';
import { PopupMenuContext } from './PopupMenuContext';
import { SubMenuProvider } from './SubMenuProvider';

const useStyles = createStyles(({ activePseudoClasses, useTheme }) => {
  const { menuItem: { active, default: defaultTheme, padding, fontSize, fontWeight } } = useTheme(MenuTheme);
  const transitionSettings = useTheme(TransitionTheme);

  return {
    styles: {
      menuItem: {
        position: 'relative',
        backgroundColor: defaultTheme.backgroundColor,
        color: defaultTheme.color,
        padding,
        cursor: 'default',
        fontSize,
        fontWeight,
      },
      isInteractable: {
        cursor: 'pointer',
        ...transitionSettings,
        transitionProperty: 'background-color, color',

        [activePseudoClasses]: {
          backgroundColor: active.backgroundColor,
          color: active.color,
        },
      },
      subMenuIcon: {
        marginLeft: 4,
      }
    },
  };
});

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
        {children}
        {hasSubMenu && <Icon name="sub-menu" size="small" className={css.subMenuIcon} />}
      </SubMenuProvider>
    </Flex>
  );
});