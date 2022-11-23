import { to } from '@anupheaus/common';
import { useRef } from 'react';
import { useBound, useOnChange } from '..';

interface DragData {
  element: HTMLElement;
  mouseStartingX: number;
  mouseStartingY: number;
  originalTop: number;
  originalLeft: number;
  originalWidth: number;
  originalHeight: number;
}

export interface UseDragEvent extends DragData {
  diffX: number;
  diffY: number;
}

interface Props {
  isEnabled: boolean;
  onDragStart?(): void;
  onDragEnd?(props: UseDragEvent): void;
  onDragging?(props: UseDragEvent): void;
}

export function useDrag({ isEnabled, onDragStart, onDragEnd, onDragging }: Props) {
  const unhookFromElementRef = useRef<() => void>(() => void 0);
  const unhookFromDocumentRef = useRef<() => void>(() => void 0);
  const movableRef = useRef<HTMLElement | null>(null);

  const hookToDocument = useBound((data: DragData) => {
    const { mouseStartingX, mouseStartingY } = data;
    const onMouseMove = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      const diffX = event.pageX - mouseStartingX;
      const diffY = event.pageY - mouseStartingY;
      onDragging?.({ ...data, diffX, diffY });
    };
    const onMouseUp = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      if (event.button !== 0) return;
      unhookFromDocumentRef.current();
      const diffX = event.pageX - mouseStartingX;
      const diffY = event.pageY - mouseStartingY;
      onDragEnd?.({ ...data, diffX, diffY });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    unhookFromDocumentRef.current = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });

  const hookToElement = useBound((element: HTMLElement) => {
    const onMouseDown = (event: MouseEvent) => {
      event.stopImmediatePropagation();
      if (event.button !== 0) return;
      const { top: startY, left: startX, width, height } = window.getComputedStyle(movableRef.current ?? element);
      onDragStart?.();
      hookToDocument({
        element: movableRef.current ?? element,
        mouseStartingX: event.pageX,
        mouseStartingY: event.pageY,
        originalTop: to.number(startY, 0),
        originalLeft: to.number(startX, 0),
        originalWidth: to.number(width, 0),
        originalHeight: to.number(height, 0),
      });
    };

    element.addEventListener('mousedown', onMouseDown);

    unhookFromElementRef.current = () => {
      element.removeEventListener('mousedown', onMouseDown);
    };
  });

  const dragInitiator = useBound((element: HTMLDivElement | null) => {
    if (element == null || !isEnabled) { unhookFromElementRef.current(); return; }
    hookToElement(element);
  });

  useOnChange(() => {
    if (!isEnabled) {
      unhookFromElementRef.current();
      unhookFromDocumentRef.current();
    } else if (movableRef.current) {
      hookToElement(movableRef.current);
    }
  }, [isEnabled]);

  return {
    dragInitiator,
    dragMovable: movableRef,
  };
}