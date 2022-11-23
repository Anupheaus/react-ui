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
  const onDragStart = useBound(() => {
    setIsDragging(true);
    propsOnDragStart?.();
    if (dragMovable.current != null) {
      const parentElement = dragMovable.current.parentElement;
      if (parentElement == null) return;
      boundsRef.current = { maxWidth: parentElement.clientWidth, maxHeight: parentElement.clientHeight };
    }
  });
  const onDragEnd = useBound(({ element, originalTop, originalLeft, diffX, diffY }: UseDragEvent) => {
    element.style.left = `${originalLeft + diffX}px`;
    element.style.top = `${originalTop + diffY}px`;
    element.style.transform = '';
    propsOnDragEnd?.();
    setIsDragging(false);
  });
  const onDragging = useBound(({ element, diffX, diffY, originalTop, originalLeft, originalWidth, originalHeight }: UseDragEvent) => {
    const { maxWidth, maxHeight } = boundsRef.current;
    if (maxHeight != null && originalTop + diffY + originalHeight > maxHeight) diffY = maxHeight - originalTop - originalHeight;
    if (maxWidth != null && originalLeft + diffX + originalWidth > maxWidth) diffX = maxWidth - originalLeft - originalWidth;
    if (originalTop + diffY < 0) diffY = -originalTop;
    if (originalLeft + diffX < 0) diffX = -originalLeft;
    element.style.transform = `translate(${diffX}px, ${diffY}px)`;
  });
  const { dragInitiator, dragMovable } = useDrag({ isEnabled, onDragStart, onDragEnd, onDragging });

  return {
    isDragging,
    dragInitiatorTarget: dragInitiator,
    dragMovableTarget: dragMovable,
  };
}