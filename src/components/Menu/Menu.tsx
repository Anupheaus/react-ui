import { ReactNode, useLayoutEffect, useMemo } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Scroller } from '../Scroller';
import { useSubMenu } from './SubMenuProvider';
import { usePopupMenu } from './usePopupMenu';

const useStyles = createStyles(({ menu: { normal } }) => ({
  menu: {
    ...normal,
    margin: 0,
    padding: 0,
    appearance: 'none',
    pointerEvents: 'all',
    width: '100%',
  },
}));

interface Props {
  className?: string;
  gap?: number;
  children: ReactNode;
  minWidth?: string | number;
}

export const Menu = createComponent('Menu', (props: Props) => {
  const {
    className,
    gap,
    children,
    minWidth,
  } = props;
  const { css, join } = useStyles();
  const { PopupMenu, target } = usePopupMenu();
  const { isVisible, isSubMenu, element, onHasSubMenu } = useSubMenu();

  const style = useMemo(() => ({
    minWidth,
  }), [minWidth]);

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
      <Flex tagName="menu" isVertical gap={gap} className={join(css.menu, className)} disableGrow style={style}>
        <Scroller>
          {children}
        </Scroller>
      </Flex>
    );
  }
});