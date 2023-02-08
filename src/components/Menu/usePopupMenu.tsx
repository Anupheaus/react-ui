import { ComponentProps, CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBooleanState, useBound, useDOMRef, useOnResize, useOnUnmount } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Menu } from './Menu';
import { SubMenuProvider } from './SubMenuProvider';

function calculatePosition(elementRect: DOMRect, { width: menuWidth, height: menuHeight }: { width: number, height: number; }) {
  const { x: elementX, y: elementY, width: elementWidth, height: elementHeight } = elementRect;
  const { width: totalWidth, height: totalHeight } = document.body.getBoundingClientRect();
  let x = elementX + elementWidth - 8;
  let y = elementY + elementHeight - 8;
  if (x + menuWidth > totalWidth) x = totalWidth - menuWidth;
  if (y + menuHeight > totalHeight) y = totalHeight - menuHeight;
  if (x < elementX + (elementWidth / 2)) x = elementX - menuWidth + 8;
  return {
    left: x,
    top: y,
  };
}

const useStyles = createStyles({
  popupMenu: {
    position: 'absolute',
    zIndex: 10000,
    boxShadow: '0 0 10px 0 rgba(0 0 0 / 20%)',
    borderRadius: 4,
    overflow: 'hidden',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.4s ease',
  },
  isOpen: {
    opacity: 1,
    pointerEvents: 'all',
  },
});

interface Props extends ComponentProps<typeof Menu> {
  isOpen?: boolean;
}

export function usePopupMenu() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setElementRef = useRef((element: HTMLElement | undefined) => void 0);
  const openMenuRef = useRef<() => void>(() => void 0);

  const target = useDOMRef({
    connected: element => { setElementRef.current(element); },
    disconnected: () => { setElementRef.current(undefined); },
  });

  const openMenu = useBound(() => openMenuRef.current());

  const PopupMenu = useMemo(() => createComponent('PopupMenu', ({ isOpen: propsIsOpen, ...props }: Props) => {
    const { css, join } = useStyles();
    const [isOver, setIsOver, setIsNotOver] = useBooleanState(false);
    const [isOpen, setIsOpen] = useState(propsIsOpen === true);
    const cancelTimeoutRef = useRef<unknown>();
    const autoHideTimeoutRef = useRef<unknown>();
    const canBeAutoHiddenRef = useRef(false);
    const isUnmounted = useOnUnmount();
    const [element, setElement] = useState<HTMLElement>();
    const { width, height, target: resizeTarget } = useOnResize();

    setElementRef.current = setElement as typeof setElementRef.current;
    openMenuRef.current = useBound(() => setIsOpen(true));

    const style = useMemo<CSSProperties>(() => {
      if (element == null || width == null || height == null) return {};
      return calculatePosition(element.getBoundingClientRect(), { width, height });
    }, [isOpen, isOver, width, height]);

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
      if (isOpen && isOver && propsIsOpen == null) {
        canBeAutoHiddenRef.current = true;
      } else if (isOpen && !isOver && canBeAutoHiddenRef.current && propsIsOpen == null) {
        autoHideTimeoutRef.current = setTimeout(() => {
          if (isUnmounted()) return;
          canBeAutoHiddenRef.current = false;
          setIsOpen(false);
        }, 400);
      } else {
        clearTimeout(autoHideTimeoutRef.current as any);
      }
    }, [isOpen, isOver, propsIsOpen]);

    if (!location) return null;

    return createPortal(
      <Flex
        ref={resizeTarget}
        tagName="popup-menu"
        className={join(css.popupMenu, (isOpen || isOver) && css.isOpen)}
        style={style}
        onMouseOver={setIsOver}
        onMouseEnter={setIsOver}
        onMouseLeave={setIsNotOver}
        onMouseOut={setIsNotOver}
      >
        <SubMenuProvider>
          <Menu {...props} />
        </SubMenuProvider>
      </Flex>,
      document.body);
  }), []);

  return {
    target,
    PopupMenu,
    openMenu,
  };
}