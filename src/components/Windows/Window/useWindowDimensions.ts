import { CSSProperties, RefObject, useEffect, useMemo, useState } from 'react';
import { InitialWindowPosition, WindowState } from '../WindowsModels';
import { useBatchUpdates, useOnUnmount } from '../../../hooks';

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
}

export function useWindowDimensions({ state: { x, y, width, height, isMaximized }, minWidth, minHeight, windowIndex, actualWidth, actualHeight,
  wantingToBeMaximized, windowElementRef, initialPosition, setState }: Props) {
  const [initialDimensionsHaveBeenSet, setInitialDimensionsHaveBeenSet] = useState(false);
  const [preparationClassName, setPreparationClassName] = useState<string | undefined>('preparing');
  const isUnmounted = useOnUnmount();
  const batchUpdates = useBatchUpdates();

  const style = useMemo<CSSProperties>(() => ({
    top: y,
    left: x,
    width,
    height,
    minWidth: minWidth ?? 200,
    minHeight: minHeight ?? 150,
    zIndex: windowIndex + 1,
  }), [x, y, width, height, minWidth, minHeight, windowIndex]);

  useEffect(() => {
    if (initialDimensionsHaveBeenSet || isUnmounted()) return;
    const stateChanges: Partial<WindowState> = {};
    if (width == null && actualWidth != null) { stateChanges.width = actualWidth; width = actualWidth; }
    if (height == null && actualHeight != null) { stateChanges.height = actualHeight; height = actualHeight; }
    if (x == null && actualWidth != null) {
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
    if (y == null && actualHeight != null) {
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
    if (preparationClassName === undefined) return;
    if (actualWidth !== width || actualHeight !== height) {
      batchUpdates(() => {
        setInitialDimensionsHaveBeenSet(false);
        setPreparationClassName('preparing');
      });
    }
  }, [initialDimensionsHaveBeenSet, preparationClassName, actualWidth, actualHeight, width, height]);

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