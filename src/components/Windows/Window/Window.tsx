import type { PromiseMaybe } from '@anupheaus/common';
import type { ReactNode } from 'react';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { useBound, useDOMRef } from '../../../hooks';
import { createStyles } from '../../../theme';
import { Button } from '../../Button';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { Icon } from '../../Icon';
import { useWindowDrag } from '../useWindowDrag';
import { WindowResizer } from '../WindowResizer';
import type { InitialWindowPosition } from '../WindowsModels';
import { Titlebar } from '../../Titlebar';
import { WindowsManager } from '../WindowsManager';
import { WindowRenderContext, WindowContext } from '../WindowsContexts';
import { DEFAULT_WINDOW_MIN_HEIGHT, DEFAULT_WINDOW_MIN_WIDTH } from '../WindowsConstants';
import { useWindowEvents } from './useWindowEvents';
import { useWindowState } from './useWindowState';
import { useWindowDimensions } from './useWindowDimensions';
import { UIState, useValidation } from '../../../providers';
import { WindowValidationProvider } from './WindowValidationContext';
import { useFormObserver } from '../../Form';
import { useNotifications } from '../../Notifications';
import { Tag } from '../../Tag';

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
    minWidth: DEFAULT_WINDOW_MIN_WIDTH,
    minHeight: DEFAULT_WINDOW_MIN_HEIGHT,
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

    '& window-content.no-padding+actions-toolbar': {
      paddingTop: '12px !important',
    },

    '&:not(.preparing):not(.prepared) window-content-wrapper': {
      overflow: 'hidden',
    },
    '&:not(.preparing):not(.prepared) window-content': {
      overflow: 'hidden',
    },
  },
  windowContentWrapper: {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
  },
  titlebar: {
    zIndex: 1,
  },
}));

interface Props {
  id?: string;
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
  disableScrolling?: boolean;
  children?: ReactNode;
  minWidth?: string | number;
  minHeight?: string | number;
  windowControls?: ReactNode;
  width?: string | number;
  height?: string | number;
  isLoading?: boolean;
  onClosing?(reason?: string): PromiseMaybe<boolean | void>;
  onClosed?(reason?: string): void;
  onFocus?(isFocused: boolean): void;
}

export const Window = createComponent('Window', ({
  id: providedId,
  className,
  title,
  icon = null,
  initialPosition,
  isMaximized: providedIsMaximized,
  hideCloseButton = false,
  hideMaximizeButton = false,
  disableDrag = false,
  disableResize = false,
  disableScrolling = false,
  windowControls = null,
  width: providedWidth,
  height: providedHeight,
  minWidth,
  minHeight,
  isLoading = false,
  children,
  onClosing,
  onClosed,
  onFocus,
}: Props) => {
  const { id: contextId, managerId, title: contextTitle } = useContext(WindowRenderContext);
  const displayTitle = contextTitle ?? title;
  const manager = WindowsManager.get(managerId);
  const id = providedId ?? contextId;
  const [state, setState] = useWindowState(manager, id, providedWidth, providedHeight);
  const { isMaximized: savedIsMaximized, index: windowIndex, isFocused } = state;
  const isMaximized = savedIsMaximized ?? providedIsMaximized;
  const isDraggable = !disableDrag && !isMaximized;
  const { css, join } = useStyles();
  const { ref: resizeTarget, height: actualHeight, width: actualWidth } = useResizeObserver();
  const [isResizing, setIsResizing] = useState(false);
  const { ValidateSection, isValid } = useValidation();
  const { FormObserver, getIsDirty } = useFormObserver();
  const { showError } = useNotifications();

  const onDragEnd = useBound(() => {
    if (windowElementRef.current == null) return;
    setState({
      x: windowElementRef.current.offsetLeft,
      y: windowElementRef.current.offsetTop,
    });
  });

  const focus = useBound(() => manager.focus(id));
  const closeWindow = useBound(() => {
    if (getIsDirty()) return showError('There are changes in this window that must be saved or discarded before closing.');
    manager.close(id);
  });
  const maximizeWindow = useBound(() => manager.maximize(id));
  const restoreWindow = useBound(() => manager.restore(id));
  const handleMouseDown = useBound(() => focus());
  const handleDragStart = useBound(() => focus());

  const { dragTargetProps, dragMovableTarget, isDragging } = useWindowDrag({ isEnabled: isDraggable, onDragStart: handleDragStart, onDragEnd });
  const windowElementRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const { style, preparationClassName, allowIsMaximized } = useWindowDimensions({
    state, minWidth, minHeight, windowIndex, actualWidth, actualHeight,
    windowElementRef, wantingToBeMaximized: providedIsMaximized, initialPosition, setState,
    contentWrapperRef, disableScrolling,
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
      <Tag
        name="window-content-wrapper"
        ref={contentWrapperRef}
        className={css.windowContentWrapper}
      >
        <Titlebar
          {...dragTargetProps}
          className={css.titlebar}
          icon={icon}
          title={displayTitle}
          endAdornment={<>
            {windowControls}
            {!hideMaximizeButton && !isMaximized && <Button variant="hover" onClick={maximizeWindow} size="small"><Icon name="window-maximize" size="small" /></Button>}
            {!hideMaximizeButton && isMaximized && <Button variant="hover" size="small" onClick={restoreWindow}><Icon name="window-restore" size="small" /></Button>}
            {!hideCloseButton && <Button variant="hover" size="small" onClick={closeWindow}><Icon name="window-close" size="small" /></Button>}
          </>}
        />
        <UIState isLoading={isLoading}>
          <WindowValidationProvider onCheckIsValid={isValid}>
            <FormObserver>
              <ValidateSection id={`window-validation-${id}`}>
                <WindowContext.Provider value={{ disableScrolling }}>
                  {children}
                </WindowContext.Provider>
              </ValidateSection>
            </FormObserver>
          </WindowValidationProvider>
          <WindowResizer isEnabled={!isMaximized && !disableResize} windowElementRef={windowElementRef} onResizingStart={handleResizingStart} onResizingEnd={handleResizingEnd} />
        </UIState>
      </Tag>
    </Flex >
  );
});
