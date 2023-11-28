import { useEffect, useRef, useState } from 'react';
import useOriginalResizeObserver from 'use-resize-observer';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';


interface UseResizerProps {
  isEnabled?: boolean;
  observeWidthOnly?: boolean;
  observeHeightOnly?: boolean;
}

export function useOnResize({ isEnabled = true, observeHeightOnly = false, observeWidthOnly = false }: UseResizerProps = {}) {
  const [{ width, height }, setWidthAndHeight] = useState<{ width: number | undefined; height: number | undefined; }>({ width: undefined, height: undefined });
  const lastElementRef = useRef<HTMLElement | null>(null);
  const isUnmounted = useOnUnmount();

  const update = (newWidth: number | undefined, newHeight: number | undefined) => {
    if (!isEnabled || newWidth == null || newHeight == null) return;
    if (observeHeightOnly && newHeight === height) return;
    if (observeWidthOnly && newWidth === width) return;
    if (newWidth === width && newHeight === height) return;
    setWidthAndHeight({ width: newWidth, height: newHeight });
  };

  const { ref } = useOriginalResizeObserver<HTMLDivElement>({
    onResize: ({ width: newWidth, height: newHeight }) => update(newWidth, newHeight),
  });

  const target = useBound((element: HTMLElement | null) => {
    ref(element as HTMLDivElement | null);
    lastElementRef.current = element;
    if (element) update(element.clientWidth, element.clientHeight);
  });

  const checkDimensions = useBound(() => {
    const element = lastElementRef.current;
    if (element == null || isUnmounted()) return;
    target(element);
  });

  useEffect(() => {
    setTimeout(checkDimensions, 1);
    setTimeout(checkDimensions, 10);
    setTimeout(checkDimensions, 100);
  });

  const hasDimensions = width != null && height != null;

  return {
    hasDimensions,
    width,
    height,
    target,
  };
}