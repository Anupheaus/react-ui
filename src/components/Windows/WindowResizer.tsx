import { createStyles } from '../../theme/createStyles';
import { to } from '@anupheaus/common';
import { RefObject, useRef } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { useDrag, UseDragEvent } from '../../hooks/useDrag/useDrag';

interface Props {
  isEnabled: boolean;
  windowElementRef: RefObject<HTMLElement | null>;
  onResizingStart(): void;
  onResizingEnd(): void;
}
const useStyles = createStyles(() => ({
  styles: {
    windowResizer: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 3,
    },
    windowResizerCommon: {
      position: 'absolute',
      pointerEvents: 'all',
    },
    windowResizerTop: { top: 0, left: 10, right: 10, height: 3, cursor: 'ns-resize' },
    windowResizerTopRight: { top: 0, width: 10, right: 0, height: 3, cursor: 'ne-resize' },
    windowResizerRightTop: { top: 0, width: 3, right: 0, height: 10, cursor: 'ne-resize' },
    windowResizerRight: { top: 10, bottom: 10, right: 0, width: 3, cursor: 'ew-resize' },
    windowResizerRightBottom: { bottom: 0, right: 0, width: 3, height: 10, cursor: 'se-resize' },
    windowResizerBottomRight: { bottom: 0, right: 0, width: 10, height: 3, cursor: 'se-resize' },
    windowResizerBottom: { bottom: 0, left: 10, right: 10, height: 3, cursor: 'ns-resize' },
    windowResizerBottomLeft: { bottom: 0, left: 0, width: 10, height: 3, cursor: 'sw-resize' },
    windowResizerLeftBottom: { bottom: 0, left: 0, width: 3, height: 10, cursor: 'sw-resize' },
    windowResizerLeft: { left: 0, top: 10, bottom: 10, width: 3, cursor: 'ew-resize' },
    windowResizerLeftTop: { left: 0, top: 0, height: 10, width: 3, cursor: 'nw-resize' },
    windowResizerTopLeft: { left: 0, top: 0, height: 3, width: 10, cursor: 'nw-resize' },
  },
}));

export const WindowResizer = createComponent('WindowResizer', ({
  isEnabled,
  windowElementRef,
  onResizingStart,
  onResizingEnd,
}: Props) => {
  const { css, join } = useStyles();
  const startPositionRef = useRef<{ top: number; left: number; width: number; height: number; }>({ top: 0, left: 0, width: 0, height: 0 });
  const boundsRef = useRef<{ maxWidth?: number; maxHeight?: number; }>({});
  const withinBounds = (leftOrTop: number, widthOrHeight: number, diff: number, target: 'top' | 'left' | 'width' | 'height', bothDimensions = false, updateDiff?: (newDiff: number) => void) => {
    const { maxWidth, maxHeight } = boundsRef.current;
    const value = target === 'top' || target === 'left' ? leftOrTop + diff : widthOrHeight + ((bothDimensions ? -1 : 1) * diff);
    if (target === 'left' && value < 0) { updateDiff?.(diff + (0 - value)); return 0; }
    if (target === 'width' && maxWidth != null && leftOrTop + value > maxWidth) return maxWidth - leftOrTop;
    if (target === 'top' && value < 0) { updateDiff?.(diff + (0 - value)); return 0; }
    if (target === 'height') {
      if (maxHeight != null && leftOrTop + value > maxHeight) return maxHeight - leftOrTop;
    }
    return value;
  };
  const convertToNumber = (value: string | number): number | undefined => {
    try {
      return typeof (value) === 'number' ? value
        : typeof (value) === 'string' ? parseInt(value, 10) : undefined;
    } catch { return; }
  };
  const modifySize = ({ top: modifyTop, left: modifyLeft, width: modifyWidth, height: modifyHeight,
    diffX, diffY }: { top?: boolean; left?: boolean; width?: boolean; height?: boolean; diffX?: number; diffY?: number; }) => {
    const element = windowElementRef.current;
    if (element == null) return;
    const { top, left, width, height } = startPositionRef.current;
    let newTop = convertToNumber(element.style.top);
    let newLeft = convertToNumber(element.style.left);
    let newWidth = convertToNumber(element.style.width);
    let newHeight = convertToNumber(element.style.height);
    if (modifyTop && diffY != null) newTop = withinBounds(top, height, diffY, 'top', modifyHeight, newDiffY => { diffY = newDiffY; });
    if (modifyLeft && diffX != null) newLeft = withinBounds(left, width, diffX, 'left', modifyWidth, newDiffX => { diffX = newDiffX; });
    if (modifyHeight && diffY != null) newHeight = withinBounds(newTop ?? top, height, diffY, 'height', modifyTop);
    if (modifyWidth && diffX != null) newWidth = withinBounds(newLeft ?? left, width, diffX, 'width', modifyLeft);
    if (newTop != null) element.style.top = `${newTop}px`;
    if (newLeft != null) element.style.left = `${newLeft}px`;
    if (newWidth != null) element.style.width = `${newWidth}px`;
    if (newHeight != null) element.style.height = `${newHeight}px`;
  };
  const onDragStart = useBound(() => {
    if (windowElementRef.current == null) return;
    const parentElement = windowElementRef.current.parentElement;
    if (parentElement != null) boundsRef.current = { maxWidth: parentElement.clientWidth, maxHeight: parentElement.clientHeight };
    const computedStyle = window.getComputedStyle(windowElementRef.current);
    startPositionRef.current = { top: to.number(computedStyle.top, 0), left: to.number(computedStyle.left, 0), width: to.number(computedStyle.width, 0), height: to.number(computedStyle.height, 0) };
    onResizingStart();
  });
  const onDraggingTop = useBound(({ diffY }: UseDragEvent) => modifySize({ top: true, height: true, diffY }));
  const onDraggingTopRight = useBound(({ diffX, diffY }: UseDragEvent) => modifySize({ top: true, width: true, height: true, diffX, diffY }));
  const onDraggingRight = useBound(({ diffX }: UseDragEvent) => modifySize({ width: true, diffX }));
  const onDraggingBottomRight = useBound(({ diffX, diffY }: UseDragEvent) => modifySize({ height: true, width: true, diffX, diffY }));
  const onDraggingBottom = useBound(({ diffY }: UseDragEvent) => modifySize({ height: true, diffY }));
  const onDraggingBottomLeft = useBound(({ diffX, diffY }: UseDragEvent) => modifySize({ left: true, width: true, height: true, diffX, diffY }));
  const onDraggingLeft = useBound(({ diffX }: UseDragEvent) => modifySize({ left: true, width: true, diffX }));
  const onDraggingTopLeft = useBound(({ diffX, diffY }: UseDragEvent) => modifySize({ left: true, top: true, width: true, height: true, diffX, diffY }));
  const onDragEnd = useBound(() => onResizingEnd());
  const { draggableProps: draggablePropsTop } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingTop, onDragEnd: onDragEnd });
  const { draggableProps: draggablePropsTopRight } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingTopRight, onDragEnd });
  const { draggableProps: draggablePropsRightTop } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingTopRight, onDragEnd });
  const { draggableProps: draggablePropsRight } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingRight, onDragEnd });
  const { draggableProps: draggablePropsRightBottom } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingBottomRight, onDragEnd });
  const { draggableProps: draggablePropsBottomRight } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingBottomRight, onDragEnd });
  const { draggableProps: draggablePropsBottom } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingBottom, onDragEnd });
  const { draggableProps: draggablePropsBottomLeft } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingBottomLeft, onDragEnd });
  const { draggableProps: draggablePropsLeftBottom } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingBottomLeft, onDragEnd });
  const { draggableProps: draggablePropsLeft } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingLeft, onDragEnd });
  const { draggableProps: draggablePropsLeftTop } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingTopLeft, onDragEnd });
  const { draggableProps: draggablePropsTopLeft } = useDrag({ isEnabled, onDragStart, onDragging: onDraggingTopLeft, onDragEnd });

  if (!isEnabled) return null;

  return (
    <Tag name="window-resizer" className={css.windowResizer}>
      <Tag name="window-resizer-top" {...draggablePropsTop} className={join(css.windowResizerCommon, css.windowResizerTop)} />
      <Tag name="window-resizer-top-right" {...draggablePropsTopRight} className={join(css.windowResizerCommon, css.windowResizerTopRight)} />
      <Tag name="window-resizer-right-top" {...draggablePropsRightTop} className={join(css.windowResizerCommon, css.windowResizerRightTop)} />
      <Tag name="window-resizer-right" {...draggablePropsRight} className={join(css.windowResizerCommon, css.windowResizerRight)} />
      <Tag name="window-resizer-right-bottom" {...draggablePropsRightBottom} className={join(css.windowResizerCommon, css.windowResizerRightBottom)} />
      <Tag name="window-resizer-bottom-right" {...draggablePropsBottomRight} className={join(css.windowResizerCommon, css.windowResizerBottomRight)} />
      <Tag name="window-resizer-bottom" {...draggablePropsBottom} className={join(css.windowResizerCommon, css.windowResizerBottom)} />
      <Tag name="window-resizer-bottom-left" {...draggablePropsBottomLeft} className={join(css.windowResizerCommon, css.windowResizerBottomLeft)} />
      <Tag name="window-resizer-left-bottom" {...draggablePropsLeftBottom} className={join(css.windowResizerCommon, css.windowResizerLeftBottom)} />
      <Tag name="window-resizer-left" {...draggablePropsLeft} className={join(css.windowResizerCommon, css.windowResizerLeft)} />
      <Tag name="window-resizer-left-top" {...draggablePropsLeftTop} className={join(css.windowResizerCommon, css.windowResizerLeftTop)} />
      <Tag name="window-resizer-top-left" {...draggablePropsTopLeft} className={join(css.windowResizerCommon, css.windowResizerTopLeft)} />
    </Tag>
  );
});
