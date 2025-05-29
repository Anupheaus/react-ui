import { useRef, useState } from 'react';
import type { UseDragEvent } from '../../hooks';
import { useBound, useDrag } from '../../hooks';

interface Props {
  isEnabled: boolean;
  onDragStart?(): void;
  onDragEnd?(): void;
}

export function useWindowDrag({ isEnabled, onDragStart: propsOnDragStart, onDragEnd: propsOnDragEnd }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const boundsRef = useRef<{ maxWidth?: number; maxHeight?: number; }>({});
  const onDragStart = useBound(({ movableElement }: UseDragEvent) => {
    setIsDragging(true);
    propsOnDragStart?.();
    const parentElement = movableElement.parentElement;
    if (parentElement == null) return;
    boundsRef.current = { maxWidth: parentElement.clientWidth, maxHeight: parentElement.clientHeight };
  });
  const onDragEnd = useBound(({ movableElement, originalTop, originalLeft, originalWidth, originalHeight, diffX, diffY }: UseDragEvent) => {
    const { maxWidth, maxHeight } = boundsRef.current;
    let newLeft = originalLeft + diffX;
    let newTop = originalTop + diffY;
    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (maxWidth != null && newLeft + originalWidth > maxWidth) newLeft = maxWidth - originalWidth;
    if (maxHeight != null && newTop + originalHeight > maxHeight) newTop = maxHeight - originalHeight;
    movableElement.style.left = `${newLeft}px`;
    movableElement.style.top = `${newTop}px`;
    movableElement.style.transform = '';
    propsOnDragEnd?.();
    setIsDragging(false);
  });
  const onDragging = useBound(({ movableElement, diffX, diffY, originalTop, originalLeft, originalWidth, originalHeight }: UseDragEvent) => {
    const { maxWidth, maxHeight } = boundsRef.current;
    if (maxHeight != null && originalTop + diffY + originalHeight > maxHeight) diffY = maxHeight - originalTop - originalHeight;
    if (maxWidth != null && originalLeft + diffX + originalWidth > maxWidth) diffX = maxWidth - originalLeft - originalWidth;
    if (originalTop + diffY < 0) diffY = -originalTop;
    if (originalLeft + diffX < 0) diffX = -originalLeft;
    movableElement.style.transform = `translate(${diffX}px, ${diffY}px)`;
  });
  const { draggableProps, dragMovable } = useDrag({ isEnabled, onDragStart, onDragEnd, onDragging });

  return {
    isDragging,
    dragTargetProps: draggableProps,
    dragMovableTarget: dragMovable,
  };
}