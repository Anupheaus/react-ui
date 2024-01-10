import { is, PromiseMaybe } from '@anupheaus/common';
import { CSSProperties, MouseEvent, ReactNode, TransitionEvent, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { useBatchUpdates, useBound, useDOMRef, useForceUpdate, useId } from '../../hooks';
import { createStyles2 } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { useWindowDrag } from './useWindowDrag';
import { WindowResizer } from './WindowResizer';
import { WindowIdContext, WindowsManagerContext, WindowsManagerIdContext } from './WindowsContexts';
import { InitialWindowPosition, WindowState } from './WindowsModels';

const useStyles = createStyles2(({ surface: { asAContainer: theme, titleArea } }) => ({
  window: {
    ...theme,
    position: 'absolute',
    borderRadius: 8,
    boxShadow: 'rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px',
    overflow: 'hidden',
    cursor: 'default',
    transform: 'scale(0.7)',
    transitionProperty: 'opacity, transform, width, height, top, left, border-radius, filter',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease-in-out',
    opacity: 0,
    minWidth: 170,
    minHeight: 100,
    userSelect: 'none',
    filter: 'blur(0px)',
  },
  titleBar: {
    ...titleArea,
    padding: '8px 8px 8px 16px',
    minHeight: 40,
    boxSizing: 'border-box',
    boxShadow: '0 0 8px 0 rgb(0 0 0 / 30%)',
    zIndex: 2,

    '&.is-draggable': {
      cursor: 'grab',
    },

    '&.is-dragging': {
      cursor: 'grabbing',
    },
  },
  title: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    outline: 'none',
    position: 'relative',
    flex: 'auto',
  },
  content: {
  },
  isVisible: {
    transform: 'scale(1)',
    opacity: 1,
  },
  isMaximized: {
    width: '100%!important',
    height: '100%!important',
    top: '0!important',
    left: '0!important',
    borderRadius: 0,
  },
  isNotFocused: {
    filter: 'blur(2px)',
  },
  stopTransitions: {
    transitionProperty: 'none',
  },
}));

interface Props {
  id?: string;
  className?: string;
  contentClassName?: string;
  title?: ReactNode;
  isMaximized?: boolean;
  icon?: ReactNode;
  initialState?: WindowState;
  initialPosition?: InitialWindowPosition;
  hideCloseButton?: boolean;
  hideMaximizeButton?: boolean;
  disableDrag?: boolean;
  disableResize?: boolean;
  children?: ReactNode;
  minWidth?: string | number;
  minHeight?: string | number;
  windowControls?: ReactNode;
  width?: string | number;
  height?: string | number;
  onClosing?(): PromiseMaybe<boolean | void>;
  onClosed?(): void;
  onFocus?(): void;
  onStateUpdated?(state: WindowState): void;
}

export const Window = createComponent('Window', ({
  id: providedId,
  className,
  contentClassName,
  title,
  icon = null,
  initialState,
  initialPosition,
  hideCloseButton = false,
  hideMaximizeButton = false,
  disableDrag = false,
  disableResize = false,
  windowControls = null,
  width: providedWidth,
  height: providedHeight,
  minWidth,
  minHeight,
  children,
  onClosing,
  onClosed,
  onFocus,
  onStateUpdated,
}: Props) => {
  const managerId = useContext(WindowsManagerIdContext);
  if (managerId == null) throw new Error('Window must be rendered within a WindowsManager component.');
  const windowId = useContext(WindowIdContext);
  const { css, join } = useStyles();
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const closingRef = useRef<() => void>();
  const [state, setState] = useState<WindowState>(useMemo(() => ({ id, isMaximized: false, x: 0, y: 0, width: providedWidth, height: providedHeight, ...initialState }), []));
  const { isMaximized, x, y, width, height } = state;
  const isDraggable = !disableDrag && !isMaximized;
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximising, setIsMaximising] = useState(false);
  const initialPositionHasBeenSetRef = useRef(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const { ref: resizeTarget, height: actualHeight, width: actualWidth } = useResizeObserver();
  const managerContexts = useContext(WindowsManagerContext);
  const { onAction, invoke } = managerContexts.get(managerId) ?? {};

  const batchUpdate = useBatchUpdates();
  if (onAction == null || invoke == null) throw new Error('Window must be rendered within a Windows component.');
  const update = useForceUpdate();

  const focus = useBound(() => {
    invoke(id, 'focus');
  });

  const closeWindow = useBound(async () => {
    if (await onClosing?.() === false) return;
    await new Promise<void>(resolve => {
      closingRef.current = resolve;
      update();
    });
    invoke(id, 'closed');
    onClosed?.();
  });

  onAction(id, 'focus', () => onFocus?.());

  onAction(id, 'updateOrdinal', (ordinal, innerIsFocused) => batchUpdate(() => {
    setFocusIndex(ordinal);
    setIsFocused(innerIsFocused);
  }));

  onAction(id, 'close', closeWindow);

  const updateState = (newState: Partial<WindowState>) => setState(currentState => {
    const nextState = { ...currentState, ...newState };
    if (is.deepEqual(nextState, currentState)) return currentState;
    invoke(managerId, 'updateState', nextState);
    onStateUpdated?.(nextState);
    return nextState;
  });

  const onDragEnd = useBound(() => {
    if (windowElementRef.current == null) return;
    updateState({
      x: windowElementRef.current.offsetLeft,
      y: windowElementRef.current.offsetTop,
    });
  });

  // if initial position is central and our size has changed, and we are still in the centre, then re-position
  useLayoutEffect(() => {
    if (!initialPositionHasBeenSetRef.current || isMaximising || isResizing || isMaximized) return;
    let newX = x;
    let newY = y;
    if (typeof (x) === 'string' && x.startsWith('calc(50% - ') && actualWidth != null) newX = 'calc(50% - ' + (actualWidth / 2) + 'px)';
    if (typeof (y) === 'string' && y.startsWith('calc(50% - ') && actualHeight != null) newY = 'calc(50% - ' + (actualHeight / 2) + 'px)';
    updateState({ x: newX, y: newY, height: actualHeight, width: actualWidth });
  }, [initialPositionHasBeenSetRef.current, isMaximising, isResizing, actualWidth, actualHeight, isMaximized]);

  useLayoutEffect(() => {
    if (windowId == null) return;
    invoke(managerId, 'link', id, windowId);
  }, [id, windowId, managerId]);

  const { dragTargetProps, dragMovableTarget, isDragging } = useWindowDrag({ isEnabled: isDraggable, onDragStart: focus, onDragEnd });
  const shouldStopTransitions = isDragging || isResizing;
  const windowElementRef = useRef<HTMLDivElement>(null);
  const windowElementTarget = useDOMRef([windowElementRef, resizeTarget, dragMovableTarget]);
  const [hasRendered, setHasRendered] = useState(false);

  const isVisible = hasRendered && closingRef.current == null;

  const maximizeWindow = useBound(() => batchUpdate(() => {
    focus();
    setIsMaximising(true);
    updateState({ isMaximized: true });
  }));

  const restoreWindow = useBound(() => batchUpdate(() => {
    setIsMaximising(true);
    updateState({ isMaximized: false });
  }));

  useMemo(() => { // should only run on initial mounting
    invoke(managerId, 'updateState', state);
  }, [managerId]);

  // set up the initial position of the window
  useLayoutEffect(() => {
    if (initialPositionHasBeenSetRef.current) return;
    const windowElement = windowElementRef.current;
    if (windowElement == null) return;
    const boundingElement = windowElement.parentElement;
    if (boundingElement == null) return;
    initialPositionHasBeenSetRef.current = true;
    const { width: currentWidth, height: currentHeight } = windowElement.getBoundingClientRect();
    let newX: string | number = 0;
    let newY: string | number = 0;
    const { transitionProperty: currentTransitionProperty } = window.getComputedStyle(windowElement);
    windowElement.style.transitionProperty = currentTransitionProperty.replace('top,', '').replace('left,', '');
    switch (initialPosition) {
      case 'center': {
        newX = `calc(50% - ${currentWidth / 2}px)`;
        newY = `calc(50% - ${currentHeight / 2}px)`;
        break;
      }
    }
    windowElement.style.left = typeof (newX) === 'number' ? `${newX}px` : newX;
    windowElement.style.top = typeof (newY) === 'number' ? `${newY}px` : newY;
    updateState({ x: newX, y: newY });
  }, [windowElementRef.current]);

  const style = useMemo<CSSProperties>(() => ({
    top: y,
    left: x,
    width,
    height,
    minWidth: minWidth ?? 200,
    minHeight: minHeight ?? 150,
    zIndex: focusIndex * 1000,
  }), [x, y, width, height, minWidth, minHeight, focusIndex]);

  const handleTransitionEnd = useBound((event: TransitionEvent) => {
    if (event.target !== windowElementRef.current || windowElementRef.current == null) return;
    if (closingRef.current && event.propertyName === 'opacity') closingRef.current();
    if (event.propertyName === 'width' || event.propertyName === 'height') {
      if (isMaximising) setIsMaximising(false);
      if (isResizing) setIsResizing(false);
    }
    windowElementRef.current.style.transitionProperty = ''; // clear any style set transition properties (this might have been set when setting the initial position of the window)
  });

  const handleMouseDown = useBound((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    focus();
  });

  const handleResizingStart = useBound(() => {
    setIsResizing(true);
    focus();
  });
  const handleResizingEnd = useBound(() => {
    setIsResizing(false);
    if (windowElementRef.current == null) return;
    updateState({
      width: windowElementRef.current.offsetWidth,
      height: windowElementRef.current.offsetHeight,
    });
  });

  const stopPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  useEffect(() => setHasRendered(true), []);

  return (
    <Flex
      ref={windowElementTarget}
      tagName="window"
      data-window-id={id}
      isVertical
      fixedSize
      className={join(
        css.window,
        isVisible && css.isVisible,
        isMaximized && css.isMaximized,
        shouldStopTransitions && css.stopTransitions,
        !isFocused && css.isNotFocused,
        className,
      )}
      style={style}
      onTransitionEnd={handleTransitionEnd}
      onMouseDown={handleMouseDown}
    >
      <Flex
        {...dragTargetProps}
        tagName="window-title-bar"
        fixedSize
        className={join(css.titleBar, isDraggable && 'is-draggable', isDragging && 'is-dragging')}
        gap={8}
        valign="center"
      >
        {icon}
        <Tag name="window-title" className={css.title}>{title}</Tag>
        <Flex tagName="window-controls" fixedSize gap={4} onMouseDown={stopPropagation}>
          {windowControls}
          {!hideMaximizeButton && !isMaximized && <Button variant="hover" onClick={maximizeWindow} size="small"><Icon name="window-maximize" size="small" /></Button>}
          {!hideMaximizeButton && isMaximized && <Button variant="hover" size="small" onClick={restoreWindow}><Icon name="window-restore" size="small" /></Button>}
          {!hideCloseButton && <Button variant="hover" size="small" onClick={closeWindow}><Icon name="window-close" size="small" /></Button>}
        </Flex>
      </Flex>
      <Flex tagName="window-content" className={join(css.content, contentClassName)} disableOverflow>
        {children}
      </Flex>
      <WindowResizer isEnabled={!isMaximized && !disableResize} windowElementRef={windowElementRef} onResizingStart={handleResizingStart} onResizingEnd={handleResizingEnd} />
    </Flex>
  );
});
