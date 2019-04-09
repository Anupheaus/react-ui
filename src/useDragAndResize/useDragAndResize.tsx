import { ISize, IGeometry, ICoordinates } from 'anux-common';
import { IUseDragAndResizeResult, IDragAndResizeConfig } from './models';
import { HTMLTargetDelegate, useSingleDOMRef } from '../useDOMRef';
import { useOnResize } from '../useOnResize';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';
import { createResizeTarget, addOrRemoveResizeHandles } from './resizing';
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
      let { geometry: { x = 0, y = 0, width = 0, height = 0 }, config: { minWidth, minHeight } } = state;
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
    onFull: () => {
      const { element, isResizing, geometry: { width: currentWidth, height: currentHeight } } = state;
      if (!element) { return; }
      const { width, height } = element.dimensions({ excludingMargin: true });
      if (isResizing || (currentWidth === width && currentHeight === height)) { return; }
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
  const { element, geometry, maxExtents } = state;
  const { geometry: prevGeometry, maxExtents: prevMaxExtents } = prevState;
  if (!element || (!hasGeometryChanged(geometry, prevGeometry) && maxExtents === prevMaxExtents)) { return; }
  adjustElement(element, geometry);
}

function handleStateUpdate(state: IDragAndResizeState, prevState: IDragAndResizeState): IDragAndResizeState {
  applyUpdateToElement(state, prevState);
  addOrRemoveResizeHandles(state, prevState);
  raiseOnChangedEvent(state, prevState);
  return state;
}

function moveToCentre(element: HTMLElement, geometry: IGeometry) {
  const centreOfParent = element && element.parentElement && element.parentElement.centreCoordinates();
  [geometry.x, geometry.y] = [Math.round(centreOfParent.x - (geometry.width / 2)), Math.round(centreOfParent.y - (geometry.height / 2))];
}

function applyExtentsToGeometry({ x, y, width, height }: IGeometry, { config: { minWidth, minHeight },
  maxExtents: { width: maxWidth, height: maxHeight } }: IDragAndResizeState): IGeometry {
  width = Math.between(width || 0, minWidth, maxWidth);
  height = Math.between(height || 0, minHeight, maxHeight);
  const maxX = maxWidth - width;
  const maxY = maxHeight - height;
  x = Math.between(x || 0, 0, maxX);
  y = Math.between(y || 0, 0, maxY);
  return { x, y, width, height };
}

function initialiseTarget(state: IDragAndResizeState, setState: SetState): void {
  let { element, config: { geometry: { x: initialX, y: initialY, width: initialWidth = 0, height: initialHeight = 0 } }, geometry: { x, y, width, height } } = state;
  x = x || initialX;
  y = y || initialY;
  width = width || initialWidth;
  height = height || initialHeight;
  const geometry = applyExtentsToGeometry({ x, y, width, height }, state);
  if (!x && !y) { moveToCentre(element, geometry); }
  if (!element.classList.contains(ElementClassName)) { element.classList.add(ElementClassName); }
  if (element.parentElement && !element.parentElement.classList.contains(ElementContainerClassName)) { element.parentElement.classList.add(ElementContainerClassName); }
  setState({ geometry });
}

function createMoveTarget(state: IDragAndResizeState, setState: SetState, containerResizeTarget: HTMLTargetDelegate, elementResizeTarget: HTMLTargetDelegate,
  dragClassTarget: HTMLTargetDelegate) {
  return useSingleDOMRef({
    connected: element => {
      setState({ element });
      containerResizeTarget(element.parentElement);
      elementResizeTarget(element);
      dragClassTarget(element);
      initialiseTarget(state, setState);
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
