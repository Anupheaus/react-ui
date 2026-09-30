import type { CSSProperties, RefObject } from 'react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { InitialWindowPosition, WindowState } from '../WindowsModels';
import { useBatchUpdates, useOnUnmount } from '../../../hooks';
import { DEFAULT_WINDOW_MIN_HEIGHT, DEFAULT_WINDOW_MIN_WIDTH } from '../WindowsConstants';
import type { WindowFitSize } from './fitWindowToContent';
import type { WindowPlacement } from './keepWindowInsideHost';
import { capMinSizeToHost, keepWindowInsideHost } from './keepWindowInsideHost';

const PLACEMENT_KEYS = ['x', 'y', 'width', 'height'] as const;

/** The size of the space the window sits in (its windows host), or undefined before the window is in the DOM. */
function measureHost(windowElementRef: RefObject<HTMLElement>): WindowFitSize | undefined {
  const host = windowElementRef.current?.parentElement;
  if (host == null) return undefined;
  return { width: host.clientWidth, height: host.clientHeight };
}

function toPx(value: number | string | undefined, fallback: number): number {
  if (value == null) return fallback;
  if (typeof value === 'number') return value;
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : fallback;
}

interface Props {
  state: WindowState;
  minWidth: number | string | undefined;
  minHeight: number | string | undefined;
  windowIndex: number;
  actualWidth: number | undefined;
  actualHeight: number | undefined;
  wantingToBeMaximized: boolean | undefined;
  windowElementRef: RefObject<HTMLDivElement>;
  initialPosition: InitialWindowPosition | undefined;
  setState(changes: Partial<WindowState>): void;
  contentWrapperRef?: RefObject<HTMLElement>;
  disableScrolling?: boolean;
}

export function useWindowDimensions({ state: { x, y, width, height, isMaximized }, minWidth, minHeight, windowIndex, actualWidth, actualHeight,
  wantingToBeMaximized, windowElementRef, initialPosition, setState, contentWrapperRef, disableScrolling = false }: Props) {
  const [initialDimensionsHaveBeenSet, setInitialDimensionsHaveBeenSet] = useState(false);
  const [preparationClassName, setPreparationClassName] = useState<string | undefined>('preparing');
  const isUnmounted = useOnUnmount();
  const batchUpdates = useBatchUpdates();
  const [hostSize, setHostSize] = useState<WindowFitSize>();

  // Track the host's size so a minimum size bigger than the screen can be capped to it (see capMinSizeToHost).
  useLayoutEffect(() => {
    const updateHostSize = () => {
      const measured = measureHost(windowElementRef);
      if (measured == null) return;
      setHostSize(current => (current?.width === measured.width && current?.height === measured.height ? current : measured));
    };
    updateHostSize();
    window.addEventListener('resize', updateHostSize);
    return () => window.removeEventListener('resize', updateHostSize);
  }, [windowElementRef]);

  const style = useMemo<CSSProperties>(() => ({
    top: y,
    left: x,
    width,
    height,
    minWidth: capMinSizeToHost(minWidth ?? DEFAULT_WINDOW_MIN_WIDTH, hostSize?.width),
    minHeight: capMinSizeToHost(minHeight ?? DEFAULT_WINDOW_MIN_HEIGHT, hostSize?.height),
    zIndex: windowIndex + 1,
  }), [x, y, width, height, minWidth, minHeight, windowIndex, hostSize]);

  const minWidthNum = toPx(minWidth, DEFAULT_WINDOW_MIN_WIDTH);
  const minHeightNum = toPx(minHeight, DEFAULT_WINDOW_MIN_HEIGHT);

  useLayoutEffect(() => {
    if (preparationClassName === undefined) return;
    const el = contentWrapperRef?.current;
    if (el == null) return;
    const rect = el.getBoundingClientRect();
    const measuredWidth = Math.round(rect.width);
    const measuredHeight = Math.round(rect.height);
    const stateChanges: Partial<WindowState> = {};
    if (width == null && measuredWidth > 0) stateChanges.width = Math.max(measuredWidth, minWidthNum);
    if (disableScrolling && height == null && measuredHeight > 0) stateChanges.height = Math.max(measuredHeight, minHeightNum);
    if (Object.keys(stateChanges).length > 0) setState(stateChanges);
  }, [preparationClassName, contentWrapperRef, disableScrolling, width, height, minWidthNum, minHeightNum, setState]);

  useEffect(() => {
    if (preparationClassName === undefined) return;
    if (initialDimensionsHaveBeenSet || isUnmounted()) return;
    const stateChanges: Partial<WindowState> = {};
    if (width == null && actualWidth != null && actualWidth > 0) { stateChanges.width = actualWidth; width = actualWidth; }
    if (height == null && actualHeight != null && actualHeight > 0) { stateChanges.height = actualHeight; height = actualHeight; }
    if (x == null && actualWidth != null && actualWidth > 0) {
      if (initialPosition === 'center') {
        if (windowElementRef.current != null) {
          const parent = windowElementRef.current.parentElement!;
          const maxWidth = parent.clientWidth;
          stateChanges.x = Math.round((maxWidth - actualWidth) / 2);
          x = stateChanges.x;
        }
      } else {
        x = 0;
        stateChanges.x = 0;
      }
    }
    if (y == null && actualHeight != null && actualHeight > 0) {
      if (initialPosition === 'center') {
        if (windowElementRef.current != null) {
          const parent = windowElementRef.current.parentElement!;
          const maxHeight = parent.clientHeight;
          stateChanges.y = Math.round((maxHeight - actualHeight) / 2);
          y = stateChanges.y;
        }
      } else {
        y = 0;
        stateChanges.y = 0;
      }
    }
    // Open wholly inside the host: a default or remembered size bigger than the screen, or a remembered position that
    // is now off it (e.g. saved on another monitor), would otherwise leave the title bar or the buttons out of reach.
    const host = measureHost(windowElementRef);
    if (host != null) {
      const placement: WindowPlacement = { x, y, width, height };
      const fitted = keepWindowInsideHost(placement, host);
      PLACEMENT_KEYS.forEach(key => {
        if (fitted[key] !== placement[key]) stateChanges[key] = fitted[key];
      });
      ({ x, y, width, height } = fitted);
    }
    batchUpdates(() => {
      if (width != null && height != null && x != null && y != null) setInitialDimensionsHaveBeenSet(true);
      if (Object.keys(stateChanges).length > 0) setState(stateChanges);
    });
  }); // do after every render

  useEffect(() => {
    if (preparationClassName === undefined || isMaximized === true) return;
    if (actualHeight == null && actualWidth == null) return;
    const safeWidth = actualWidth != null && actualWidth > 0 ? actualWidth : width;
    const safeHeight = actualHeight != null && actualHeight > 0 ? actualHeight : height;
    if (width == null || height == null) {
      if (safeWidth != null && safeHeight != null) {
        batchUpdates(() => {
          setState({ width: safeWidth, height: safeHeight });
          setInitialDimensionsHaveBeenSet(false);
          setPreparationClassName('preparing');
        });
      }
    }
  }, [initialDimensionsHaveBeenSet, preparationClassName, actualWidth, actualHeight, width, height, isMaximized]);

  useEffect(() => {
    if (!initialDimensionsHaveBeenSet) return;
    if (preparationClassName === 'preparing') {
      setPreparationClassName('prepared');
    } else {
      setTimeout(() => {
        if (isUnmounted()) return;
        setPreparationClassName(undefined);
      }, 100);
    }
  }, [initialDimensionsHaveBeenSet, preparationClassName]);

  return { style, preparationClassName, allowIsMaximized: isMaximized || (wantingToBeMaximized === true && preparationClassName == null) };
}