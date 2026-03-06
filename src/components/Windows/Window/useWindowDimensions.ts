import type { CSSProperties, RefObject } from 'react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { InitialWindowPosition, WindowState } from '../WindowsModels';
import { useBatchUpdates, useOnUnmount } from '../../../hooks';
import { DEFAULT_WINDOW_MIN_HEIGHT, DEFAULT_WINDOW_MIN_WIDTH } from '../WindowsConstants';

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

  const style = useMemo<CSSProperties>(() => ({
    top: y,
    left: x,
    width,
    height,
    minWidth: minWidth ?? DEFAULT_WINDOW_MIN_WIDTH,
    minHeight: minHeight ?? DEFAULT_WINDOW_MIN_HEIGHT,
    zIndex: windowIndex + 1,
  }), [x, y, width, height, minWidth, minHeight, windowIndex]);

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