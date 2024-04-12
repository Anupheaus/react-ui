import { PromiseMaybe } from '@anupheaus/common';
import { ReactNode, useContext, useLayoutEffect, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { useBound, useDOMRef } from '../../../hooks';
import { createStyles } from '../../../theme';
import { Button } from '../../Button';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { Icon } from '../../Icon';
import { useWindowDrag } from '../useWindowDrag';
import { WindowResizer } from '../WindowResizer';
import { InitialWindowPosition } from '../WindowsModels';
import { Titlebar } from '../../Titlebar';
import { WindowsManager } from '../WindowsManager';
import { WindowManagerIdContext, WindowContext } from '../WindowsContexts';
import { useWindowEvents } from './useWindowEvents';
import { useWindowState } from './useWindowState';
import { useWindowDimensions } from './useWindowDimensions';

const useStyles = createStyles(({ windows: { window, content }, transitions }) => ({
  window: {
    position: 'absolute',
    borderRadius: window.active.borderRadius,
    boxShadow: window.active.shadow,
    overflow: 'hidden',
    cursor: 'default',
    transform: 'scale(0.7)',
    transitionProperty: 'opacity, transform, width, height, top, left, border-radius, filter',
    transitionDuration: `${transitions.duration}ms`,
    transitionTimingFunction: transitions.function,
    opacity: 0,
    minWidth: 170,
    minHeight: 100,
    maxWidth: '100%',
    maxHeight: '100%',
    userSelect: 'none',
    filter: window.active.filter,
    backgroundColor: window.active.backgroundColor,

    '&.preparing': {
      transform: 'scale(1)',
      transitionProperty: 'none',
      opacity: 0,
    },

    '&.prepared': {
      transform: 'scale(0.7)',
      transitionProperty: 'none',
      opacity: 0,
    },

    '&.is-visible': {
      transform: 'scale(1)',
      opacity: 1,
    },

    '&.is-maximized': {
      width: '100%!important',
      height: '100%!important',
      top: '0!important',
      left: '0!important',
      borderRadius: 0,
    },

    '&.stop-transitions': {
      transitionProperty: 'none',
    },

    '&.is-not-focused': {
      backgroundColor: window.inactive.backgroundColor ?? window.active.backgroundColor,
      borderRadius: window.inactive.borderRadius ?? window.active.borderRadius,
      boxShadow: window.inactive.shadow ?? window.active.shadow,
      filter: window.inactive.filter ?? window.active.filter,

      '& window-content': {
        backgroundColor: content.inactive.backgroundColor ?? content.active.backgroundColor,
        color: content.inactive.textColor ?? content.active.textColor,
        fontSize: content.inactive.textSize ?? content.active.textSize,
        fontWeight: content.inactive.textWeight ?? content.active.textWeight,
      },
    },
  },
  titlebar: {
    zIndex: 1,
  },
  content: {
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,
  },
}));

interface Props {
  className?: string;
  contentClassName?: string;
  title?: ReactNode;
  isMaximized?: boolean;
  icon?: ReactNode;
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
  onFocus?(isFocused: boolean): void;
}

export const Window = createComponent('Window', ({
  className,
  contentClassName,
  title,
  icon = null,
  initialPosition,
  isMaximized: providedIsMaximized,
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
}: Props) => {
  const managerId = useContext(WindowManagerIdContext);
  const { id: stateId, index: windowIndex, isFocused } = useContext(WindowContext);
  const manager = WindowsManager.get(managerId);
  const [state, setState] = useWindowState(manager, stateId, providedWidth, providedHeight);
  const { id, isMaximized: savedIsMaximized } = state;
  const isMaximized = savedIsMaximized ?? providedIsMaximized;
  const isDraggable = !disableDrag && !isMaximized;
  const { css, join } = useStyles();
  const { ref: resizeTarget, height: actualHeight, width: actualWidth } = useResizeObserver();
  const [isResizing, setIsResizing] = useState(false);

  const onDragEnd = useBound(() => {
    if (windowElementRef.current == null) return;
    setState({
      x: windowElementRef.current.offsetLeft,
      y: windowElementRef.current.offsetTop,
    });
  });

  const focus = useBound(() => manager.focus(id));
  const closeWindow = useBound(() => manager.close(id));
  const maximizeWindow = useBound(() => manager.maximize(id));
  const restoreWindow = useBound(() => manager.restore(id));
  const handleMouseDown = useBound(() => focus());
  const handleDragStart = useBound(() => focus());

  const { dragTargetProps, dragMovableTarget, isDragging } = useWindowDrag({ isEnabled: isDraggable, onDragStart: handleDragStart, onDragEnd });
  const windowElementRef = useRef<HTMLDivElement>(null);
  const { style, preparationClassName, allowIsMaximized } = useWindowDimensions({
    state, minWidth, minHeight, windowIndex, actualWidth, actualHeight,
    windowElementRef, wantingToBeMaximized: providedIsMaximized, initialPosition, setState
  });
  const windowElementTarget = useDOMRef([windowElementRef, resizeTarget, dragMovableTarget]);
  const { isVisible } = useWindowEvents({ manager, windowElementRef, id, onClosing, onClosed, onFocus });

  const shouldStopTransitions = isDragging || isResizing;

  const handleResizingStart = useBound(() => {
    setIsResizing(true);
    focus();
  });

  const handleResizingEnd = useBound(() => {
    setIsResizing(false);
    if (windowElementRef.current == null) return;
    setState({
      x: windowElementRef.current.offsetLeft,
      y: windowElementRef.current.offsetTop,
      width: windowElementRef.current.offsetWidth,
      height: windowElementRef.current.offsetHeight,
    });
  });

  useLayoutEffect(() => {
    if (isMaximized != savedIsMaximized && allowIsMaximized) setState({ isMaximized });
  }, [isMaximized, allowIsMaximized, savedIsMaximized]);

  return (
    <Flex
      ref={windowElementTarget}
      tagName="window"
      data-window-id={id}
      isVertical
      fixedSize
      className={join(
        css.window,
        preparationClassName,
        isVisible && preparationClassName == null && 'is-visible',
        allowIsMaximized && isMaximized && 'is-maximized',
        shouldStopTransitions && 'stop-transitions',
        !isFocused && 'is-not-focused',
        className,
      )}
      style={style}
      onMouseDownCapture={handleMouseDown}
    >
      <Titlebar
        {...dragTargetProps}
        className={css.titlebar}
        icon={icon}
        title={title}
        endAdornment={<>
          {windowControls}
          {!hideMaximizeButton && !isMaximized && <Button variant="hover" onClick={maximizeWindow} size="small"><Icon name="window-maximize" size="small" /></Button>}
          {!hideMaximizeButton && isMaximized && <Button variant="hover" size="small" onClick={restoreWindow}><Icon name="window-restore" size="small" /></Button>}
          {!hideCloseButton && <Button variant="hover" size="small" onClick={closeWindow}><Icon name="window-close" size="small" /></Button>}
        </>}
      />
      <Flex tagName="window-content" className={join(css.content, contentClassName)} disableOverflow>
        {children}
      </Flex>
      <WindowResizer isEnabled={!isMaximized && !disableResize} windowElementRef={windowElementRef} onResizingStart={handleResizingStart} onResizingEnd={handleResizingEnd} />
    </Flex >
  );
});
