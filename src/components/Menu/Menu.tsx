import type { PaperProps, PopoverOrigin, PopoverProps } from '@mui/material';
import { Popover } from '@mui/material';
import { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBatchUpdates, useBooleanState, useBound, useOnResize, useOnUnmount } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { Scroller } from '../Scroller';
import { useSubMenu } from './SubMenuProvider';
import { PopupMenuContext } from './PopupMenuContext';
import type { PopupMenuContextProps } from './PopupMenuContext';
import { SubMenuProvider } from './SubMenuProvider';
import { MenuItemRenderer } from './MenuItemRenderer';
import type { ListItemClickEvent, ReactListItem } from '../../models';

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
      },
    },
  },
  slotProps: {},
}));

export interface MenuProps {
  items: ReactListItem[];
  onClick?(event: ListItemClickEvent): void;
  className?: string;
  gap?: FlexProps['gap'];
  minWidth?: string | number;
  padding?: number | string;
  /** Popup mode - when provided with anchorEl, renders as Popover */
  anchorEl?: HTMLElement | null;
  isOpen?: boolean;
  onClose?(): void;
  targetAnchorPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  menuAnchorPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  offsetPosition?: number;
  useWidthOfTargetElement?: boolean;
  disableEnforceFocus?: boolean;
  disableAutoFocus?: boolean;
}

export const Menu = createComponent('Menu', (props: MenuProps) => {
  const {
    items,
    onClick,
    className,
    gap,
    minWidth,
    padding,
    anchorEl: propsAnchorEl,
    isOpen: propsIsOpen,
    onClose: propsOnClose,
    targetAnchorPosition = 'bottomRight',
    menuAnchorPosition = 'topLeft',
    offsetPosition = 12,
    useWidthOfTargetElement = false,
    disableEnforceFocus,
    disableAutoFocus,
  } = props;

  const { css, join, useInlineStyle } = useStyles();
  const { isVisible, isSubMenu, element, onHasSubMenu } = useSubMenu();
  const [isOver, setIsOver, setIsNotOver] = useBooleanState(false);
  const [controlledIsOpen, setControlledIsOpen] = useState(false);
  const cancelTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isUnmounted = useOnUnmount();
  const [popoverElement, setPopoverElement] = useState<HTMLElement>();
  const anchorForResize = isSubMenu ? element : propsAnchorEl;
  const { target: resizeTarget, width, height } = useOnResize();
  resizeTarget(anchorForResize ?? popoverElement ?? null);
  const batchUpdate = useBatchUpdates();
  const { isValid: isInPopup, close: closeParentPopup } = useContext(PopupMenuContext);

  const isPopupMode = propsAnchorEl != null && propsIsOpen != null;
  const isSubMenuMode = isSubMenu;

  const anchorEl = isSubMenuMode ? element : propsAnchorEl ?? undefined;
  const onClose = isSubMenuMode ? undefined : propsOnClose;

  const close = useBound(() => batchUpdate(() => {
    if (isPopupMode) {
      setControlledIsOpen(false);
      setIsNotOver();
      propsOnClose?.();
    }
    if (isInPopup) closeParentPopup();
  }));

  useLayoutEffect(() => {
    onHasSubMenu(element != null);
  }, [element]);

  useLayoutEffect(() => {
    if (isPopupMode && propsIsOpen != null) {
      if (propsIsOpen) {
        clearTimeout(cancelTimeoutRef.current as any);
        setControlledIsOpen(true);
      } else {
        cancelTimeoutRef.current = setTimeout(() => {
          if (isUnmounted()) return;
          setControlledIsOpen(false);
        }, 200);
      }
    }
  }, [isPopupMode, propsIsOpen]);

  const style = useInlineStyle(() => ({
    minWidth: useWidthOfTargetElement && width ? width : minWidth,
    padding,
  }), [minWidth, padding, useWidthOfTargetElement, width]);

  const handleIsOver = useBound(() => setIsOver());
  const handleIsNotOver = useBound(() => setIsNotOver());

  const anchorOrigin = useMemo<PopoverOrigin>(() => ({
    horizontal: targetAnchorPosition === 'topLeft' || targetAnchorPosition === 'bottomLeft' ? offsetPosition : (width ?? 0) - offsetPosition,
    vertical: targetAnchorPosition === 'topLeft' || targetAnchorPosition === 'topRight' ? offsetPosition : (height ?? 0) - offsetPosition,
  }), [width, height, targetAnchorPosition, offsetPosition]);

  const transformOrigin = useMemo<PopoverOrigin>(() => ({
    horizontal: menuAnchorPosition === 'bottomLeft' || menuAnchorPosition === 'topLeft' ? 'left' : 'right',
    vertical: menuAnchorPosition === 'topLeft' || menuAnchorPosition === 'topRight' ? 'top' : 'bottom',
  }), [menuAnchorPosition]);

  const paperProps = useMemo<PaperProps>(() => ({
    ref: (el: HTMLDivElement | null) => setPopoverElement(el ?? undefined),
    onMouseEnter: handleIsOver,
    onMouseOver: handleIsOver,
    onMouseLeave: handleIsNotOver,
    onMouseOut: handleIsNotOver,
  }), []);

  const slotProps = useMemo<PopoverProps['slotProps']>(() => ({
    root: { className: css.slotProps },
  }), []);

  const context = useMemo<PopupMenuContextProps>(() => ({
    isValid: true,
    close,
  }), []);

  const menuContent = (
    <Flex tagName="menu" isVertical gap={gap} className={join(css.menu, className)} disableGrow style={style}>
      <Scroller className={css.scroller}>
        {items.map((item, index) => (
          <MenuItemRenderer key={item.id} item={item} index={index} onClick={onClick} MenuComponent={Menu} />
        ))}
      </Scroller>
    </Flex>
  );

  const shouldShowPopover = (isSubMenuMode || isPopupMode) && anchorEl != null;

  if (shouldShowPopover) {
    return (
      <Popover
        open={isSubMenuMode ? isVisible : (propsIsOpen ?? controlledIsOpen) || isOver}
        anchorEl={anchorEl}
        slotProps={slotProps}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        PaperProps={paperProps}
        disableEnforceFocus={disableEnforceFocus}
        disableAutoFocus={disableAutoFocus}
        onClose={onClose ?? (() => setControlledIsOpen(false))}
      >
        <PopupMenuContext.Provider value={context}>
          <SubMenuProvider>
            {menuContent}
          </SubMenuProvider>
        </PopupMenuContext.Provider>
      </Popover>
    );
  }

  return menuContent;
});
