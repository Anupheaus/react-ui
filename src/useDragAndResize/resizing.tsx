import { useSingleDOMRef } from '../useDOMRef';
import * as ReactDOMServer from 'react-dom/server';
import { CustomTag } from '../customTag';
import './resizing.scss';
import { useOnDrag } from '../useOnDrag';
import { IDragAndResizeState, SetState } from './useDragAndResize';

function applyResizeHandlesTo(element: HTMLElement): void {
  const handles = (
    <CustomTag name="drag-and-resize-handles-container">
      <CustomTag name="drag-and-resize-handle" data-handle-position="1"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="2"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="3"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="4"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="5"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="6"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="7"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="8"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="9"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="10"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="11"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-position="12"></CustomTag>
    </CustomTag>
  );
  const content = ReactDOMServer.renderToString(handles);
  element.insertAdjacentHTML('beforeend', content);
}

function removeResizeHandlesFrom(element: HTMLElement): void {
  const container = element.querySelector('drag-and-resize-handles-container');
  if (!container) { return; }
  container.remove();
}

export function createDragTarget(state: IDragAndResizeState, _setState: SetState) {
  return useOnDrag({
    isDisabled: state.config.disableResize,
    classToApplyWhileDragging: 'is-resizing',
    onDragStart: () => state.geometry,
    onDrag: ({ passthroughData, currentTarget }) => {
      console.log(currentTarget);
      return passthroughData;
    },
  });
}

// export function applyResizeExtentsToAdjustment() {
//   const applyAdjustment = (value: number, min: number, max: number) => Math.between(value, 0, maxExtents.width - maxExtents.left);
//   const applyVerticalExtent = (value: number) => Math.between(value, 0, maxExtents.height - maxExtents.top);
//   const [adjustX1, adjustY1, adjustX2, adjustY2] = [adjustment.x1 != null, adjustment.y1 != null, adjustment.x2 != null, adjustment.y2 != null];
//   if (adjustment.x1 != null) { adjustment.x1 = applyHorizontalExtent(adjustment.x1); }
//   if (adjustment.width != null) { adjustment.width = applyHorizontalExtent(adjustment.x + adjustment.width) - adjustment.x; }
//   if (adjustment.y != null) { adjustment.y = applyVerticalExtent(adjustment.y); }
//   if (adjustment.height != null) { adjustment.height = applyVerticalExtent(adjustment.y + adjustment.height) - adjustment.y; }
// }

export function createResizeTarget(state: IDragAndResizeState, setState: SetState) {
  const { dragTarget } = createDragTarget(state, setState);
  return useSingleDOMRef({
    connected: element => {
      applyResizeHandlesTo(element);
      dragTarget(element);
    },
    disconnected: element => {
      removeResizeHandlesFrom(element);
      dragTarget(undefined);
    },
  });
}
