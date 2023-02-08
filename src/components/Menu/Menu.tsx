import { ReactNode, useLayoutEffect } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Scroller } from '../Scroller';
import { MenuTheme } from './MenuTheme';
import { useSubMenu } from './SubMenuProvider';
import { usePopupMenu } from './usePopupMenu';

const useStyles = createStyles(({ useTheme }) => {
  const { default: { backgroundColor, textColor } } = useTheme(MenuTheme);
  return {
    styles: {
      menu: {
        backgroundColor,
        color: textColor,
        margin: 0,
        padding: 0,
        appearance: 'none',
      },
    },
  };
});

interface Props {
  className?: string;
  gap?: number;
  children: ReactNode;
}

export const Menu = createComponent('Menu', (props: Props) => {
  const {
    className,
    gap,
    children,
  } = props;
  const { css, join } = useStyles();
  const { PopupMenu, target } = usePopupMenu();
  const { isVisible, isSubMenu, element, onHasSubMenu } = useSubMenu();

  useLayoutEffect(() => {
    onHasSubMenu(element != null);
    target(element ?? null);
    return () => onHasSubMenu(false);
  }, [element]);

  if (isSubMenu) {
    return (
      <PopupMenu {...props} isOpen={isVisible} />
    );
  } else {
    return (
      <Flex tagName="menu" isVertical gap={gap} className={join(css.menu, className)} disableGrow>
        <Scroller>
          {children}
        </Scroller>
      </Flex>
    );
  }
});