import { ISize, IGeometry, ICoordinates } from 'anux-common';
import { IUseDragAndResizeResult, IDragAndResizeConfig } from './models';
import { HTMLTargetDelegate, useSingleDOMRef } from '../useDOMRef';
import { useOnResize } from '../useOnResize';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';
import { createResizeTarget, overhangWidth, addOrRemoveResizeHandles } from './resizing';
import { useStaticState, SetStaticState } from '../useStaticState';
import { useOnDrag, IOnDragData } from '../useOnDrag';
import './useDragAndResize.scss';

const ElementClassName = 'anux-drag-and-resize';
const ElementContainerClassName = 'anux-drag-and-resize-container';

export type SetState = SetStaticState<IDragAndResizeState>;

function applyDefaults(config: IDragAndResizeConfig): IDragAndResizeConfig {
  return {
    canBeMoved: true,
    canBeResized: true,
    ...config,
    geometry: {
      ...config.geometry,
    },
  };
}

function adjustElement(element: HTMLElement, adjustment: IGeometry): void {
  element.style.transform = `translate(${adjustment.x}px,${adjustment.y}px)`;
  element.style.width = `${adjustment.width}px`;
  element.style.height = `${adjustment.height}px`;
}

function createContainerResizeTarget(state: IDragAndResizeState, setState: SetState): HTMLTargetDelegate {
  const { config: { canBeMoved, canBeResized } } = state;
  return useOnResize({
    isDisabled: !(canBeMoved && canBeResized),
    onVisible: (_size, _prevSize, element) => {
      let { top, left, width: maxWidth, height: maxHeight } = element.dimensions({ excludingBorder: true, excludingMargin: true, excludingPadding: true });
      let { geometry: { x, y, width, height }, config: { minWidth, minHeight } } = state;
      maxWidth -= left;
      maxHeight -= top;
      const maxX = maxWidth - width;
      const maxY = maxHeight - height;
      x = Math.between(x, 0, maxX);
      y = Math.between(y, 0, maxY);
      width = Math.between(width, minWidth, maxWidth - x);
      height = Math.between(height, minHeight, maxHeight - y);
      setState({ geometry: { x, y, width, height }, maxExtents: { width: maxWidth, height: maxHeight } });
    },
  });
}

function createElementResizeTarget(state: IDragAndResizeState, setState: SetState) {
  return useOnResize({
    isDisabled: !state.config.canBeResized,
    triggerOnInitialise: false,
    onFull: ({ width, height }) => {
      // need to adjust the width and height if we can be resized because the resize handles hang outside the boundaries of the target
      width -= overhangWidth / 2;
      height -= overhangWidth / 2;
      if (state.isResizing || (state.geometry.width === width && state.geometry.height === height)) { return; }
      setState({ geometry: { ...state.geometry, ...{ width, height } } });
    },
  });
}

function hasGeometryChanged({ x, y, width, height }: IGeometry, { x: px, y: py, width: pwidth, height: pheight }: IGeometry): boolean {
  return !(x === px && y === py && width === pwidth && height === pheight);
}

function raiseOnChangedEvent(state: IDragAndResizeState, prevState: IDragAndResizeState): void {
  const { geometry, config: { onChanged }, isMoving, isResizing } = state;
  const { isMoving: prevIsMoving, isResizing: prevIsResizing, geometry: prevGeometry } = prevState;
  const geometryHasChanged = !isMoving && !isResizing && hasGeometryChanged(geometry, prevGeometry);
  const isNowNotMovingOrResizing = (!isMoving && isMoving !== prevIsMoving) || (!isResizing && isResizing !== prevIsResizing);
  if (!isNowNotMovingOrResizing && !geometryHasChanged) { return; }
  onChanged(geometry);
}

function applyUpdateToElement(state: IDragAndResizeState, prevState: IDragAndResizeState): void {
  if (!state.hasInitialised || (state.geometry === prevState.geometry && state.maxExtents === prevState.maxExtents)) { return; }
  const { element, hasInitialised, geometry: { x, y, width, height } } = state;
  const { hasInitialised: prevHasInitialised, geometry: { x: prevX, y: prevY, width: prevWidth, height: prevHeight } } = prevState;
  if (!hasInitialised || (hasInitialised === prevHasInitialised && x === prevX && y === prevY && width === prevWidth && height === prevHeight)) { return; }
  adjustElement(element, state.geometry);
}

function handleStateUpdate(state: IDragAndResizeState, prevState: IDragAndResizeState): IDragAndResizeState {
  applyUpdateToElement(state, prevState);
  addOrRemoveResizeHandles(state, prevState);
  raiseOnChangedEvent(state, prevState);
  return state;
}

function calculateCentre(element: HTMLElement, width: number, height: number): ICoordinates {
  const centreOfParent = element && element.parentElement && element.parentElement.centreCoordinates();
  return {
    x: Math.round(centreOfParent.x - (width / 2)),
    y: Math.round(centreOfParent.y - (height / 2)),
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
  if (!element.classList.contains(ElementClassName)) { element.classList.add(ElementClassName); }
  if (element.parentElement && !element.parentElement.classList.contains(ElementContainerClassName)) { element.parentElement.classList.add(ElementContainerClassName); }
  const geometry = { x, y, width, height };
  setState({ geometry, hasInitialised: true });
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
    isDisabled: !state.config.canBeMoved,
    onDragStart: () => {
      setState({ isMoving: true });
      return { x: state.geometry.x, y: state.geometry.y };
    },
    onDrag: ({ coordinatesDiff: { x: xd, y: yd }, passthroughData }: IOnDragData<void, ICoordinates>) => {
      let { x, y } = passthroughData;
      const { geometry: { width, height }, maxExtents: { width: maxWidth, height: maxHeight } } = state;
      const [maxX, maxY] = [maxWidth - width, maxHeight - height];
      x = Math.between(x + xd, 0, maxX);
      y = Math.between(y + yd, 0, maxY);
      setState({ geometry: { ...state.geometry, x, y } });
      return passthroughData;
    },
    onDragEnd: () => setState({ isMoving: false }),
  });
}

export interface IDragAndResizeState {
  hasInitialised: boolean;
  element: HTMLElement;
  geometry: IGeometry;
  isResizing: boolean;
  isMoving: boolean;
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
    isResizing: false,
    isMoving: false,
    maxExtents: {
      width: undefined,
      height: undefined,
    },
    config,
  });
  onStateUpdate(handleStateUpdate);
  setState({ config });

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
