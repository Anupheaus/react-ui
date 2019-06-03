import { IUseOnDragResult, IUseOnDragConfig } from './models';
import { ICoordinates } from 'anux-common';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';
import { useSingleDOMRef } from '../useDOMRef';
import { setDraggingData } from '../dragAndDropRegistry/registry';
import { useStaticState, SetStaticState } from '../useStaticState';

type IConfig = IUseOnDragConfig<any, any>;
type SetState = SetStaticState<IState>;

interface IState {
  isDragging: boolean;
  config: IConfig;
  dragTarget: HTMLElement;
  classTarget: HTMLElement;
  isUnmounted: boolean;
  mouseDownHandler(event: MouseEvent): void;
  removeHandlers(): void;
}

function applyDefaults(config: IConfig): IConfig {
  return {
    classToApplyWhileDragging: 'is-dragging',
    data: undefined,
    isDisabled: false,
    threshold: 3,
    onDragStart: () => null,
    onDrag: ({ passthroughData }) => passthroughData,
    onDragEnd: () => void 0,
    ...config,
  };
}

function handleStateUpdated(state: IState, prevState: IState): IState {
  let { config: { isDisabled, classToApplyWhileDragging }, isUnmounted, dragTarget, classTarget, mouseDownHandler, isDragging } = state;
  let { config: { isDisabled: prevIsDisabled, classToApplyWhileDragging: prevClassToApplyWhileDragging }, dragTarget: prevDragTarget, classTarget: prevClassTarget,
    isUnmounted: prevIsUnmounted, isDragging: prevIsDragging, removeHandlers: prevRemoveHandlers } = prevState;
  const isEnabled = !isDisabled && !isUnmounted;
  const prevIsEnabled = !prevIsDisabled && !prevIsUnmounted;
  classTarget = classTarget || dragTarget;
  prevClassTarget = prevClassTarget || prevDragTarget;

  if (classTarget !== prevClassTarget || classToApplyWhileDragging !== prevClassToApplyWhileDragging || isEnabled !== prevIsEnabled || isDragging !== prevIsDragging) {
    if (prevClassTarget && prevClassToApplyWhileDragging) { prevClassTarget.classList.remove(prevClassToApplyWhileDragging); }
    if (isEnabled && isDragging && classTarget) { classTarget.classList.add(classToApplyWhileDragging); }
  }
  if (dragTarget !== prevDragTarget || isEnabled !== prevIsEnabled) {
    prevRemoveHandlers();
    if (prevDragTarget) { prevDragTarget.removeEventListener('mousedown', mouseDownHandler); }
    if (isEnabled && dragTarget) { dragTarget.addEventListener('mousedown', mouseDownHandler); }
  }

  return state;
}

function getCoordinatesDiff(event: MouseEvent, coordinates: ICoordinates): ICoordinates {
  return {
    x: event.clientX - coordinates.x,
    y: event.clientY - coordinates.y,
  };
}

function dragStartHandler(state: IState, setState: SetState, event: MouseEvent): void {
  if (event.button !== 0) { return; }
  const { config: { threshold, onDragStart, onDrag, onDragEnd, data }, dragTarget: target } = state;
  const coordinates: ICoordinates = { x: event.clientX, y: event.clientY };
  const currentTarget = event.target as HTMLElement;
  let passthroughData = null;
  let startedDragging = false;

  const removeHandlers = () => {
    document.removeEventListener('mousemove', dragHandler);
    document.removeEventListener('mouseup', dragEndHandler);
  };

  const dragHandler = (dragEvent: MouseEvent) => {
    const coordinatesDiff = getCoordinatesDiff(dragEvent, coordinates);
    if (!startedDragging) {
      if (Math.abs(coordinatesDiff.x) <= threshold && Math.abs(coordinatesDiff.y) <= threshold) { return; }
      startedDragging = true;
      setState({ isDragging: true, removeHandlers });
      setDraggingData([data]);
      passthroughData = onDragStart({ target, currentTarget, coordinates, data });
    }
    passthroughData = onDrag({ target, currentTarget, coordinates, coordinatesDiff, data, passthroughData });
  };

  const dragEndHandler = (dragEndEvent: MouseEvent) => {
    const coordinatesDiff = getCoordinatesDiff(dragEndEvent, coordinates);
    try {
      onDragEnd({ target, currentTarget, coordinates, coordinatesDiff, data, passthroughData });
    } catch (error) {
      throw error;
    } finally {
      passthroughData = null;
      removeHandlers();
      startedDragging = false;
      setState({ isDragging: false, removeHandlers: () => void 0 });
      setDraggingData(null);
    }
  };

  document.addEventListener('mousemove', dragHandler);
  document.addEventListener('mouseup', dragEndHandler);
}

export function useOnDrag<TData = void, TPassthroughData = void>(config?: IUseOnDragConfig<TData, TPassthroughData>): IUseOnDragResult {
  config = applyDefaults(config);
  const [state, setState, onStateUpdate] = useStaticState<IState>({
    isDragging: false,
    config,
    dragTarget: undefined,
    classTarget: undefined,
    isUnmounted: false,
    mouseDownHandler: event => dragStartHandler(state, setState, event),
    removeHandlers: () => void 0,
  });
  onStateUpdate(handleStateUpdated);
  setState({ config });

  const dragTarget = useSingleDOMRef({ connected: element => setState({ dragTarget: element }), disconnected: () => setState({ dragTarget: undefined }) });
  const dragClassTarget = useSingleDOMRef({ connected: element => setState({ classTarget: element }), disconnected: () => setState({ classTarget: undefined }) });

  useOnUnmount(() => {
    useBound.disposeOf([dragTarget, dragClassTarget]);
    setState({ isUnmounted: true });
  });

  return {
    isDragging: state.isDragging,
    dragTarget,
    dragClassTarget,
  };
}
