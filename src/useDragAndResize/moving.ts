import { IAdjustment } from './models';
import { ICoordinates } from 'anux-common';
import { useOnDrag, IOnDragData } from '../useOnDrag';
import { useSingleDOMRef, HTMLTargetDelegate } from '../useDOMRef';
import { IDragAndResizeState, SetState, applyAdjustment } from './useDragAndResize';

function calculateCentre(element: HTMLElement, width: number, height: number): ICoordinates {
  const centreOfParent = element && element.parentElement && element.parentElement.centreCoordinates();
  return {
    x: centreOfParent.x - (width / 2),
    y: centreOfParent.y - (height / 2),
  };
}

function initialiseTarget({ element, config: { geometry: { x, y, width, height }, minWidth, minHeight } }: IDragAndResizeState, setState: SetState): void {
  if (!x && !y) {
    const centre = calculateCentre(element, width || minWidth, height || minHeight);
    x = centre.x;
    y = centre.y;
  }
  const adjustment: IAdjustment = {
    x1: x || 0,
    y1: y || 0,
    width: width || minWidth,
    height: height || minHeight,
  };
  applyAdjustment(adjustment, setState, false);
}

export function applyMoveExtentsToAdjustment(adjustment: IAdjustment, { config: { minWidth, minHeight }, geometry: { width, height },
  maxExtents: { width: maxWidth, height: maxHeight } }: IDragAndResizeState): IAdjustment {
  width = Math.between(width, minWidth, maxWidth);
  height = Math.between(height, minHeight, maxHeight);
  maxWidth -= width;
  maxHeight -= height;
  return { x1: Math.between(adjustment.x1, 0, maxWidth), y1: Math.between(adjustment.y1, 0, maxHeight), width, height };
}

export function createDragTarget(state: IDragAndResizeState, setState: SetState) {
  return useOnDrag({
    onDragStart: () => ({ x: state.geometry.x, y: state.geometry.y }),
    onDrag: ({ coordinatesDiff: { x, y }, passthroughData }: IOnDragData<void, ICoordinates>) => {
      applyAdjustment({ x1: passthroughData.x + x, y1: passthroughData.y + y }, setState, false);
      return passthroughData;
    },
  });
}

export function createMoveTarget(state: IDragAndResizeState, setState: SetState, targets: HTMLTargetDelegate[]) {
  return useSingleDOMRef({
    connected: element => {
      targets.forEach(target => target(element));
      if (!state.hasInitialised) {
        initialiseTarget(state, setState); // on first connect, initialise the target
        setState({ hasInitialised: true });
      }
    },
    disconnected: () => {
      setState({ element: undefined });
      targets.forEach(target => target(undefined));
    },
  });
}
