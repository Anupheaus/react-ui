import { is, PromiseMaybe } from '@anupheaus/common';
import { CSSProperties, MouseEvent, ReactNode, TransitionEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useBound, useDOMRef, useForceUpdate } from '../../hooks';
import { ThemesProvider } from '../../theme';
import { Button, IconButtonTheme } from '../Button';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Icon, IconType } from '../Icon';
import { WindowResizer } from './WindowResizer';
import { WindowApi, WindowState } from './WindowsModels';
import { WindowTheme } from './WindowTheme';
import { useWindowDrag } from './useWindowDrag';

export interface WindowProps {
  id: string;
  title?: ReactNode;
  isMaximized?: boolean;
  icon?: IconType;
  hideCloseButton?: boolean;
  hideMaximizeButton?: boolean;
  disableDrag?: boolean;
  disableResize?: boolean;
  children?: ReactNode;
  minWidth?: string | number;
  minHeight?: string | number;
  windowControls?: ReactNode;
  onClosing?(): PromiseMaybe<boolean | void>;
  onClosed?(): void;
  onFocus?(): void;
}

interface Props extends WindowProps {
  initialState: WindowState;
  registerApi(api: WindowApi): void;
  onStateChange(state: WindowState): void;
}

export const WindowRenderer = createComponent({
  id: 'WindowRenderer',

  styles: ({ useTheme, useThemeIcons, createThemeVariant }, { minWidth, minHeight }: Props) => {
    const { backgroundColor, textColor, fontSize, titleBar } = useTheme(WindowTheme);
    const icons = useThemeIcons(WindowTheme);
    return {
      styles: {
        window: {
          position: 'absolute',
          borderRadius: 8,
          boxShadow: 'rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px',
          overflow: 'hidden',
          backgroundColor,
          color: textColor,
          fontSize,
          cursor: 'default',
          transform: 'scale(0.7)',
          transitionProperty: 'opacity, transform, width, height, top, left, border-radius, filter',
          transitionDuration: '400ms',
          transitionTimingFunction: 'ease-in-out',
          opacity: 0,
          minWidth: minWidth ?? 170,
          minHeight: minHeight ?? 100,
          userSelect: 'none',
          filter: 'blur(0px)',
        },
        titleBar: {
          backgroundColor: titleBar.backgroundColor,
          color: titleBar.textColor,
          fontSize: titleBar.fontSize,
          padding: '8px 8px 8px 16px',
          minHeight: 40,
          boxSizing: 'border-box',
        },
        isDraggableTitleBar: {
          cursor: 'grab',
        },
        isDraggingTitleBar: {
          cursor: 'grabbing',
        },
        title: {
        },
        content: {
          padding: '8px 16px',
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
        stopTransitions: {
          transitionProperty: 'none',
        },
      },
      icons,
      variants: {
        windowControlIconButton: createThemeVariant(IconButtonTheme, {
          backgroundColor: titleBar.backgroundColor,
          activeBackgroundColor: 'rgba(0 0 0 / 10%)',
          borderRadius: 4,
        }),
      },
    };
  },

  render({
    id,
    title,
    icon,
    initialState,
    hideCloseButton = false,
    hideMaximizeButton = false,
    disableDrag = false,
    disableResize = false,
    windowControls = null,
    registerApi,
    children,
    onClosing,
    onClosed,
    onFocus,
    onStateChange,
  }: Props, { css, icons, variants, join }) {
    const closingRef = useRef<() => void>();
    const [{ isMaximized, x, y, width, height }, setState] = useState(initialState);
    const isDraggable = !disableDrag && !isMaximized;
    const [isResizing, setIsResizing] = useState(false);
    const focus = useBound(() => onFocus?.());
    const updateState = (newState: Partial<WindowState>) => setState(currentState => {
      const nextState = { ...currentState, ...newState };
      if (is.deepEqual(nextState, currentState)) return currentState;
      onStateChange(nextState);
      return nextState;
    });
    const onDragEnd = useBound(() => {
      if (windowElementRef.current == null) return;
      updateState({
        x: windowElementRef.current.offsetLeft,
        y: windowElementRef.current.offsetTop,
      });
    });
    const { dragInitiatorTarget, dragMovableTarget, isDragging } = useWindowDrag({ isEnabled: isDraggable, onDragStart: focus, onDragEnd });
    const shouldStopTransitions = isDragging || isResizing;
    const windowElementRef = useRef<HTMLDivElement>(null);
    const windowElementTarget = useDOMRef([windowElementRef, dragMovableTarget]);
    const [hasRendered, setHasRendered] = useState(false);
    const update = useForceUpdate();

    const isVisible = hasRendered && closingRef.current == null;

    const closeWindow = useBound(async () => {
      if (await onClosing?.() === false) return;
      await new Promise<void>(resolve => {
        closingRef.current = resolve;
        update();
      });
      onClosed?.();
    });

    const maximizeWindow = useBound(() => updateState({ isMaximized: true }));

    const restoreWindow = useBound(() => updateState({ isMaximized: false }));

    useMemo(() => {
      registerApi({
        id,
        closeWindow,
        focus,
        maximizeWindow,
        restoreWindow,
      });
    }, []);

    const style = useMemo<CSSProperties>(() => ({
      top: y,
      left: x,
      width,
      height,
    }), [x, y, width, height]);

    const handleTransitionEnd = useBound((event: TransitionEvent) => {
      if (event.target !== windowElementRef.current) return;
      if (closingRef.current && event.propertyName === 'opacity') closingRef.current();
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
        )}
        style={style}
        onTransitionEnd={handleTransitionEnd}
        onMouseDown={handleMouseDown}
      >
        <Flex
          ref={dragInitiatorTarget}
          tagName="window-title-bar"
          fixedSize
          className={join(css.titleBar, isDraggable && css.isDraggableTitleBar, isDragging && css.isDraggingTitleBar)}
          gap={8}
          valign="center"
        >
          <Icon>{icon}</Icon>
          <Flex tagName="window-title" className={css.title}>{title}</Flex>
          <Flex tagName="window-controls" fixedSize>
            <ThemesProvider themes={join(variants.windowControlIconButton)}>
              {windowControls}
              {!hideMaximizeButton && !isMaximized && <Button icon={icons.maximize} size="small" onClick={maximizeWindow} />}
              {!hideMaximizeButton && isMaximized && <Button icon={icons.restore} size="small" onClick={restoreWindow} />}
              {!hideCloseButton && <Button icon={icons.close} size="small" onClick={closeWindow} />}
            </ThemesProvider>
          </Flex>
        </Flex>
        <Flex tagName="window-content" className={css.content}>
          {children}
        </Flex>
        <WindowResizer isEnabled={!isMaximized && !disableResize} windowElementRef={windowElementRef} onResizingStart={handleResizingStart} onResizingEnd={handleResizingEnd} />
      </Flex>
    );
  },
});
