import type { ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import type { FlexProps } from '../Flex';
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
  scroller: {
    '@media(pointer: coarse)': {

      '@media(max-height: 800px)': {
        flexDirection: 'row',
        flexWrap: 'wrap',
      }
    },
  },
}));

interface Props {
  className?: string;
  gap?: FlexProps['gap'];
  children: ReactNode;
  minWidth?: string | number;
  padding?: number | string;
}

export const Menu = createComponent('Menu', (props: Props) => {
  const {
    className,
    gap,
    children,
    minWidth,
    padding,
  } = props;
  const { css, join, useInlineStyle } = useStyles();
  const { PopupMenu, target } = usePopupMenu();
  const { isVisible, isSubMenu, element, onHasSubMenu } = useSubMenu();

  const style = useInlineStyle(() => ({
    minWidth,
    padding,
  }), [minWidth, padding]);

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
        <Scroller className={css.scroller}>
          {children}
        </Scroller>
      </Flex>
    );
  }
});