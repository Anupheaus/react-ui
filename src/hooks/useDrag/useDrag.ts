import { to } from '@anupheaus/common';
import { DOMAttributes, MouseEvent } from 'react';
import { useMemo, useRef } from 'react';
import { useBound } from '../useBound';
import { useDOMRef } from '../useDOMRef';
import { useOnChange } from '../useOnChange';

interface DragData {
  initiatorElement: HTMLElement;
  movableElement: HTMLElement;
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
  isEnabled?: boolean;
  onDragStart?(props: UseDragEvent): void;
  onDragEnd?(props: UseDragEvent): void;
  onDragging?(props: UseDragEvent): void;
}

export function useDrag({ isEnabled = true, onDragStart, onDragEnd, onDragging }: Props = {}) {
  const unhookFromElementRef = useRef<() => void>(() => void 0);
  const unhookFromDocumentRef = useRef<() => void>(() => void 0);
  const hasDraggingStartedRef = useRef(false);
  const [movableRef, dragMovable] = useDOMRef();

  const hookToDocument = useBound((data: DragData) => {
    const { mouseStartingX, mouseStartingY } = data;
    const onMouseMove = (event: globalThis.MouseEvent) => {
      // event.stopPropagation();
      const diffX = event.pageX - mouseStartingX;
      const diffY = event.pageY - mouseStartingY;
      const maxDiff = Math.max(Math.abs(diffX), Math.abs(diffY));
      if (hasDraggingStartedRef.current) {
        onDragging?.({ ...data, diffX, diffY });
      } else if (maxDiff > 10) {
        hasDraggingStartedRef.current = true;
        onDragStart?.({ ...data, diffX, diffY });
      }
    };
    const onMouseUp = (event: globalThis.MouseEvent) => {
      // event.stopPropagation();
      if (event.button !== 0) return;
      unhookFromDocumentRef.current();
      const diffX = event.pageX - mouseStartingX;
      const diffY = event.pageY - mouseStartingY;
      hasDraggingStartedRef.current = false;
      onDragEnd?.({ ...data, diffX, diffY });
    };

    unhookFromDocumentRef.current(); // unhook first, just in case
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    unhookFromDocumentRef.current = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  });

  const onMouseDown = useBound((event: MouseEvent) => {
    if (!isEnabled) return;
    event.stopPropagation();
    if (event.button !== 0) return;
    const targetElement = event.currentTarget as HTMLElement;
    const { top: startY, left: startX, width, height } = window.getComputedStyle(movableRef.current ?? targetElement);
    const originalTop = to.number(startY, 0);
    const originalLeft = to.number(startX, 0);
    const originalWidth = to.number(width, 0);
    const originalHeight = to.number(height, 0);
    const mouseStartingX = event.pageX;
    const mouseStartingY = event.pageY;
    const movableElement = (movableRef.current ?? event.target) as HTMLElement;
    const data: DragData = { initiatorElement: targetElement, movableElement, mouseStartingX, mouseStartingY, originalTop, originalLeft, originalWidth, originalHeight };
    // onDragStart?.({ ...data, movableElement, diffX: 0, diffY: 0 });
    hookToDocument(data);
  });

  const draggableProps = useMemo<Partial<DOMAttributes<HTMLElement>>>(() => ({
    onMouseDown,
  }), []);

  useOnChange(() => {
    if (isEnabled) return;
    unhookFromElementRef.current();
    unhookFromDocumentRef.current();
  }, [isEnabled]);

  return {
    draggableProps,
    dragMovable,
  };
}