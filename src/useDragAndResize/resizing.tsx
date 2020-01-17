import * as ReactDOMServer from 'react-dom/server';
import { useSingleDOMRef } from '../useDOMRef';
import { CustomTag } from '../customTag';
import './resizing.scss';
import { useOnDrag } from '../useOnDrag';
import { IDragAndResizeState, SetState } from './useDragAndResize';
import { IMap } from 'anux-common';
import { CSSProperties } from 'react';

export const overhangWidth = 4;
export const resizeHandleWidth = 6;

function applyResizeHandlesTo(element: HTMLElement): void {
  const style: CSSProperties & IMap = {
    '--overhangWidth': `${-overhangWidth}px`,
    '--resizeHandleWidth': `${resizeHandleWidth}px`,
  };
  const handles = (
    <CustomTag name="drag-and-resize-handles-container" style={style}>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="nw" data-handle-position="1"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="nw" data-handle-position="2"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="n" data-handle-position="3"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="ne" data-handle-position="4"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="ne" data-handle-position="5"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="e" data-handle-position="6"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="se" data-handle-position="7"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="se" data-handle-position="8"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="s" data-handle-position="9"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="sw" data-handle-position="10"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="sw" data-handle-position="11"></CustomTag>
      <CustomTag name="drag-and-resize-handle" data-handle-direction="w" data-handle-position="12"></CustomTag>
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

function createDragTarget(state: IDragAndResizeState, setState: SetState) {
  return useOnDrag({
    isDisabled: !state.config.canBeResized,
    classToApplyWhileDragging: 'is-resizing',
    onDragStart: () => {
      setState({ isResizing: true });
      return state.geometry;
    },
    onDrag: ({ coordinatesDiff: { x: xd, y: yd }, passthroughData, currentTarget }) => {
      const position = currentTarget.getAttribute('data-handle-direction') || '';
      if (position.length === 0) { return passthroughData; }
      let { x, y, width, height } = passthroughData;
      let { config: { minWidth, minHeight }, maxExtents: { width: maxWidth, height: maxHeight } } = state;
      const maxX = x + width - minWidth;
      const maxY = y + height - minHeight;
      maxWidth -= x;
      maxHeight -= y;
      const fixedHeight = y + height;
      const fixedWidth = x + width;
      switch (position) {
        case 'nw': {
          x = Math.between(x + xd, 0, maxX);
          y = Math.between(y + yd, 0, maxY);
          width = Math.between(width - xd, minWidth, fixedWidth);
          height = Math.between(height - yd, minHeight, fixedHeight);
          break;
        }
        case 'n': {
          y = Math.between(y + yd, 0, maxY);
          height = Math.between(height - yd, minHeight, fixedHeight);
          break;
        }
        case 'ne': {
          y = Math.between(y + yd, 0, maxY);
          width = Math.between(width + xd, minWidth, maxWidth);
          height = Math.between(height - yd, minHeight, fixedHeight);
          break;
        }
        case 'e': {
          width = Math.between(width + xd, minWidth, maxWidth);
          break;
        }
        case 'se': {
          width = Math.between(width + xd, minWidth, maxWidth);
          height = Math.between(height + yd, minHeight, maxHeight);
          break;
        }
        case 's': {
          height = Math.between(height + yd, minHeight, maxHeight);
          break;
        }
        case 'sw': {
          x = Math.between(x + xd, 0, maxX);
          width = Math.between(width - xd, minWidth, fixedWidth);
          height = Math.between(height + yd, minHeight, maxHeight);
          break;
        }
        case 'w': {
          x = Math.between(x + xd, 0, maxX);
          width = Math.between(width - xd, minWidth, fixedWidth);
          break;
        }
      }
      setState({ geometry: { x, y, width, height } });
      return passthroughData;
    },
    onDragEnd: () => setTimeout(() => setState({ isResizing: false }), 0),
  });
}

export function addOrRemoveResizeHandles(state: IDragAndResizeState, prevState: IDragAndResizeState): void {
  const { config: { canBeResized }, element } = state;
  const { config: { canBeResized: prevCanBeResized }, element: prevElement } = prevState;

  if (canBeResized !== prevCanBeResized || element !== prevElement) {
    if (prevElement) { removeResizeHandlesFrom(prevElement); }
    if (element && canBeResized) { applyResizeHandlesTo(element); }
  }
}

export function createResizeTarget(state: IDragAndResizeState, setState: SetState) {
  const { dragTarget } = createDragTarget(state, setState);
  return useSingleDOMRef({
    connected: element => dragTarget(element),
    disconnected: () => dragTarget(undefined),
  });
}
