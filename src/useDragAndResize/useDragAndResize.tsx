import { ISize, IGeometry, ICoordinates } from 'anux-common';
import { IUseDragAndResizeResult, IDragAndResizeConfig } from './models';
import { HTMLTargetDelegate, useSingleDOMRef } from '../useDOMRef';
import { useOnResize } from '../useOnResize';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';
import { createResizeTarget } from './resizing';
import { useStaticState, SetStaticState } from '../useStaticState';
import { useOnDrag, IOnDragData } from '../useOnDrag';

export type SetState = SetStaticState<IDragAndResizeState>;

function applyDefaults(config: IDragAndResizeConfig): IDragAndResizeConfig {
  return {
    disableMove: false,
    disableResize: false,
    ...config,
    geometry: {
      ...config.geometry,
    },
  };
}

function adjustElement(element: HTMLElement, adjustment: IGeometry): void {
  element.style.position = 'absolute';
  element.style.transform = `translate(${adjustment.x}px,${adjustment.y}px)`;
  element.style.width = `${adjustment.width}px`;
  element.style.height = `${adjustment.height}px`;
}

function createContainerResizeTarget(state: IDragAndResizeState, setState: SetState): HTMLTargetDelegate {
  const { config: { disableMove, disableResize } } = state;
  return useOnResize({
    isDisabled: disableResize && disableMove,
    onFull: (_size, _prevSize, element) => {
      const { top, left, width, height } = element.dimensions({ excludingBorder: true, excludingMargin: true, excludingPadding: true });
      setState({ maxExtents: { width: width - left, height: height - top } });
    },
  });
}

function createElementResizeTarget(state: IDragAndResizeState, setState: SetState) {
  const { config: { disableResize } } = state;
  return useOnResize({
    isDisabled: disableResize,
    triggerOnInitialise: false,
    onFull: size => setState(s => ({ ...s, geometry: { ...s.geometry, ...size } })),
  });
}

function applyUpdateToElement(state: IDragAndResizeState, prevState: IDragAndResizeState): IDragAndResizeState {
  if (!state.hasInitialised || (state.geometry === prevState.geometry && state.maxExtents === prevState.maxExtents)) { return state; }
  let { element, maxExtents: { width: maxWidth, height: maxHeight } } = state;
  let { x = 0, y = 0, width = 0, height = 0 } = state.geometry;
  const { x: prevX, y: prevY } = prevState.geometry;
  const { minWidth, minHeight } = state.config;
  const [xChanged, yChanged] = [x !== prevX, y !== prevY];
  x = Math.max(0, x);
  y = Math.max(0, y);
  maxWidth = Math.max(minWidth, maxWidth);
  maxHeight = Math.max(minHeight, maxHeight);
  width = Math.max(minWidth, width);
  height = Math.max(minHeight, height);
  if (x + width > maxWidth) {
    if (xChanged || maxWidth - x < minWidth) { x = maxWidth - width; } else { width = maxWidth - x; }
  }
  if (y + height > maxHeight) {
    if (yChanged || maxHeight - y < minHeight) { y = maxHeight - height; } else { height = maxHeight - y; }
  }
  adjustElement(element, { x, y, width, height });
  return {
    ...state,
    geometry: { x, y, width, height },
  };
}

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
  x = x || 0;
  y = y || 0;
  width = width || minWidth;
  height = height || minHeight;
  setState({ geometry: { x, y, width, height } });
}

function createMoveTarget(state: IDragAndResizeState, setState: SetState, containerResizeTarget: HTMLTargetDelegate, elementResizeTarget: HTMLTargetDelegate,
  dragClassTarget: HTMLTargetDelegate) {
  return useSingleDOMRef({
    connected: element => {
      setState({ element });
      containerResizeTarget(element.parentElement);
      elementResizeTarget(element);
      dragClassTarget(element);
      if (!state.hasInitialised) {
        initialiseTarget(state, setState); // on first connect, initialise the target
        setState({ hasInitialised: true });
      }
    },
    disconnected: () => {
      setState({ element: undefined });
      containerResizeTarget(undefined);
      elementResizeTarget(undefined);
      dragClassTarget(undefined);
    },
  });
}

function createMoveDragTarget(state: IDragAndResizeState, setState: SetState) {
  return useOnDrag({
    onDragStart: () => ({ x: state.geometry.x, y: state.geometry.y }),
    onDrag: ({ coordinatesDiff: { x, y }, passthroughData }: IOnDragData<void, ICoordinates>) => {
      setState(s => ({ ...s, geometry: { ...s.geometry, x: passthroughData.x + x, y: passthroughData.y + y } }));
      return passthroughData;
    },
  });
}

export interface IDragAndResizeState {
  hasInitialised: boolean;
  element: HTMLElement;
  geometry: IGeometry;
  maxExtents: ISize;
  config: IDragAndResizeConfig;
  ignoreResizesOnElement: boolean;
}

export function useDragAndResize(config: IDragAndResizeConfig): IUseDragAndResizeResult {
  config = applyDefaults(config);
  const [state, setState, onStateUpdate] = useStaticState<IDragAndResizeState>({
    hasInitialised: false,
    element: undefined,
    ignoreResizesOnElement: false,
    geometry: {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
    },
    maxExtents: {
      width: undefined,
      height: undefined,
    },
    config: undefined,
  });
  setState({ config: applyDefaults(config) });
  onStateUpdate(applyUpdateToElement);
  const containerResizeTarget = createContainerResizeTarget(state, setState);
  const elementResizeTarget = createElementResizeTarget(state, setState);
  const { dragTarget, dragClassTarget } = createMoveDragTarget(state, setState);
  const moveTarget = createMoveTarget(state, setState, containerResizeTarget, elementResizeTarget, dragClassTarget);
  const resizeTarget = createResizeTarget(state, setState);

  useOnUnmount(() => {
    useBound.disposeOf([moveTarget, dragTarget, resizeTarget]);
  });

  return {
    moveTarget,
    dragTarget,
    resizeTarget,
  };
}
