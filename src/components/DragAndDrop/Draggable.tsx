import { IDimensions, Record } from '@anupheaus/common';
import { CSSProperties, Fragment, ReactNode, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBound, useDOMRef, useDrag, UseDragEvent } from '../../hooks';
import { createLegacyStyles, TransitionTheme } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { DragAndDropData } from './DragAndDropData';
import { useInteractionProvider } from './InteractionEvents';

interface Props {
  data: Record;
  children: ReactNode;
  tagName?: string;
  className?: string;
  onDraggingClassName?: string;
  clonedClassName?: string;
  onDraggingClonedClassName?: string;
}

const useStyles = createLegacyStyles(({ useTheme }) => {
  const transitionSettings = useTheme(TransitionTheme);
  return {
    styles: {
      draggable: {
        boxSizing: 'border-box',
        opacity: 1,
        transitionProperty: 'opacity',
        ...transitionSettings,
      },
      isDragging: {
        opacity: 0.3,
      },
      clonedDraggable: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        zIndex: 50000,
        cursor: 'grabbing',
        pointerEvents: 'none',
      },
      isDraggingClone: {
        opacity: 0.6,
        pointerEvents: 'all',
      },
    },
  };
});

export const Draggable = createComponent('Draggable', ({
  data,
  children,
  tagName = 'draggable',
  className,
  onDraggingClassName,
  clonedClassName,
  onDraggingClonedClassName,
}: Props) => {
  const { css, join } = useStyles();
  const dimensionsRef = useRef<IDimensions>();
  const [isDragging, setIsDragging] = useState(false);
  const [cloneContent, setCloneContent] = useState<{ __html: string; }>({ __html: '' });
  const interactionTarget = useInteractionProvider({ data });

  const onDragStart = useBound(({ initiatorElement }: UseDragEvent) => {
    const { x: left, y: top } = initiatorElement.screenCoordinates();
    dimensionsRef.current = { ...initiatorElement.dimensions(), top, left };
    DragAndDropData.add(data);
    document.body.setAttribute('style', 'cursor: grabbing!important;');
    setIsDragging(true);
  });
  const onDragEnd = useBound(({ movableElement }: UseDragEvent) => {
    DragAndDropData.remove(data.id);
    movableElement.style.transform = '';
    document.body.removeAttribute('style');
    setIsDragging(false);
  });
  const onDragging = useBound(({ movableElement, diffX, diffY }: UseDragEvent) => {
    movableElement.style.transform = `translate(${diffX}px, ${diffY}px)`;
  });

  const { draggableProps, dragMovable } = useDrag({ onDragStart, onDragEnd, onDragging });

  const style = useMemo<CSSProperties>(() => ({
    ...dimensionsRef.current,
  }), [dimensionsRef.current, isDragging]);

  const saveContent = useBound((element: HTMLDivElement | null) => {
    setCloneContent({ __html: element?.outerHTML ?? '' });
  });

  const draggableTarget = useDOMRef([saveContent, interactionTarget]);

  return (<>
    <Tag
      {...draggableProps}
      ref={draggableTarget}
      name={tagName}
      className={join(css.draggable, isDragging && css.isDragging, className, isDragging && onDraggingClassName)}
      drag-id={data.id}
    >
      {children}
    </Tag>
    {createPortal(<Tag
      ref={dragMovable}
      name={`${tagName}-clone`}
      className={join(css.clonedDraggable, clonedClassName, isDragging && css.isDraggingClone, isDragging && onDraggingClonedClassName)}
      drag-id={data.id}
      style={style}
      dangerouslySetInnerHTML={cloneContent}
    />, document.body)}
  </>);
});
