import { useDrag } from '../useDrag/useDrag';

export function useDragAndDrop() {

  const { dragInitiator, dragMovable } = useDrag({ isEnabled: true, onDragStart, onDragEnd, onDragging });

  return {
    dragInitiator,
    dragMovable,
  };
}
