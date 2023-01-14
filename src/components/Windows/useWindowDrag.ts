import { useRef, useState } from 'react';
import { useBound, useDrag, UseDragEvent } from '../../hooks';

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
  const onDragEnd = useBound(({ movableElement, originalTop, originalLeft, diffX, diffY }: UseDragEvent) => {
    movableElement.style.left = `${originalLeft + diffX}px`;
    movableElement.style.top = `${originalTop + diffY}px`;
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
  const { dragInitiator, dragMovable } = useDrag({ isEnabled, onDragStart, onDragEnd, onDragging });

  return {
    isDragging,
    dragInitiatorTarget: dragInitiator,
    dragMovableTarget: dragMovable,
  };
}