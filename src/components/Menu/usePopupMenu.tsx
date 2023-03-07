import { PaperProps, Popover, PopoverOrigin, PopoverProps } from '@mui/material';
import { ComponentProps, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBatchUpdates, useBooleanState, useBound, useDOMRef, useOnResize, useOnUnmount } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Menu } from './Menu';
import { PopupMenuContext, PopupMenuContextProps } from './PopupMenuContext';
import { SubMenuProvider } from './SubMenuProvider';

const useStyles = createStyles({
  slotProps: {
    pointerEvents: 'none',
  },
});

interface Props extends ComponentProps<typeof Menu> {
  isOpen?: boolean;
  targetAnchorPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  menuAnchorPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  offsetPosition?: number;
  useWidthOfTargetElement?: boolean;
}

export function usePopupMenu() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setElementRef = useRef((element: HTMLElement | undefined) => void 0);
  const openMenuRef = useRef<() => void>(() => void 0);
  const { isValid: isInPopup, close: closeParentPopup } = useContext(PopupMenuContext);

  const target = useDOMRef({
    connected: element => { setElementRef.current(element); },
    disconnected: () => { setElementRef.current(undefined); },
  });

  const openMenu = useBound(() => openMenuRef.current());

  const PopupMenu = useMemo(() => createComponent('PopupMenu', ({
    isOpen: propsIsOpen,
    targetAnchorPosition = 'bottomRight',
    menuAnchorPosition = 'topLeft',
    offsetPosition = 12,
    useWidthOfTargetElement = false,
    ...props
  }: Props) => {
    const { css } = useStyles();
    const [isOver, setIsOver, setIsNotOver] = useBooleanState(false);
    const [isOpen, setIsOpen] = useState(propsIsOpen === true);
    const cancelTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const autoHideTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const canBeAutoHiddenRef = useRef(false);
    const isUnmounted = useOnUnmount();
    const [element, setElement] = useState<HTMLElement>();
    const { target: resizeTarget, width, height } = useOnResize();
    resizeTarget(element ?? null);
    const batchUpdate = useBatchUpdates();

    setElementRef.current = setElement as typeof setElementRef.current;
    openMenuRef.current = useBound(() => setIsOpen(true));

    useLayoutEffect(() => {
      if (propsIsOpen) {
        clearTimeout(cancelTimeoutRef.current as any);
        setIsOpen(true);
      } else {
        cancelTimeoutRef.current = setTimeout(() => {
          if (isUnmounted()) return;
          setIsOpen(false);
        }, 200);
      }
    }, [propsIsOpen]);

    useEffect(() => {
      if (isOpen && !isOver && canBeAutoHiddenRef.current && propsIsOpen == null) {
        autoHideTimeoutRef.current = setTimeout(() => {
          if (isUnmounted()) return;
          canBeAutoHiddenRef.current = false;
          setIsOpen(false);
        }, 400);
      } else {
        clearTimeout(autoHideTimeoutRef.current as any);
        if (isOpen && isOver && propsIsOpen == null) canBeAutoHiddenRef.current = true;
      }
    }, [isOpen, isOver, propsIsOpen]);

    const close = useBound(() => batchUpdate(() => {
      setIsOpen(false);
      setIsNotOver();
      if (isInPopup) closeParentPopup();
    }));

    const targetElementWidth = useWidthOfTargetElement ? width : undefined;

    const handleIsOver = useBound(() => batchUpdate(() => {
      setIsOver();
      if (propsIsOpen == null) setIsOpen(true);
    }));

    const handleIsNotOver = useBound(() => batchUpdate(() => {
      setIsNotOver();
    }));

    const anchorOrigin = useMemo<PopoverOrigin>(() => ({
      horizontal: targetAnchorPosition === 'topLeft' || targetAnchorPosition === 'bottomLeft' ? offsetPosition : (width ?? 0) - offsetPosition,
      vertical: targetAnchorPosition === 'topLeft' || targetAnchorPosition === 'topRight' ? offsetPosition : (height ?? 0) - offsetPosition,
    }), [width, height, targetAnchorPosition, offsetPosition]);

    const transformOrigin = useMemo<PopoverOrigin>(() => ({
      horizontal: menuAnchorPosition === 'bottomLeft' || menuAnchorPosition === 'topLeft' ? 'left' : 'right',
      vertical: menuAnchorPosition === 'topLeft' || menuAnchorPosition === 'topRight' ? 'top' : 'bottom',
    }), [menuAnchorPosition]);

    const paperProps = useMemo<PaperProps>(() => ({
      onMouseEnter: handleIsOver,
      onMouseOver: handleIsOver,
      onMouseLeave: handleIsNotOver,
      onMouseOut: handleIsNotOver,
    }), []);

    const slotProps = useMemo<PopoverProps['slotProps']>(() => ({
      root: {
        className: css.slotProps,
      },
    }), []);

    const context = useMemo<PopupMenuContextProps>(() => ({
      isValid: true,
      close,
    }), []);

    return (
      <Popover
        open={isOpen || isOver}
        anchorEl={element}
        slotProps={slotProps}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        PaperProps={paperProps}
        hideBackdrop
      >
        <PopupMenuContext.Provider value={context}>
          <SubMenuProvider>
            <Menu {...props} minWidth={props.minWidth ?? targetElementWidth} />
          </SubMenuProvider>
        </PopupMenuContext.Provider>
      </Popover>
    );

  }), []);

  return {
    target,
    PopupMenu,
    openMenu,
  };
}