import { IUseOnDragResult, IUseOnDragConfig } from './models';
import { ICoordinates } from 'anux-common';
import { useState, useRef, Dispatch, SetStateAction } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';
import { useSingleDOMRef, HTMLElementRef, HTMLTargetDelegate } from '../useDOMRef';
import { setDraggingData } from '../dragAndDropRegistry/registry';

interface IUseOnDragInternalConfig<TData, TPassthroughData> extends IUseOnDragConfig<TData, TPassthroughData> {
  isUnmounted?: boolean;
}

interface IState {
  isDragging: boolean;
}

function applyClassToElement(applyDraggingClassTo: HTMLElement, classToApply: string, isDragging: boolean): void {
  // apply the class to the element
  if (!applyDraggingClassTo || !classToApply) { return; }
  const method = isDragging ? 'add' : 'remove';
  applyDraggingClassTo.classList[method](classToApply);
}

function getCoordinatesDiff(event: MouseEvent, coordinates: ICoordinates): ICoordinates {
  return {
    x: event.clientX - coordinates.x,
    y: event.clientY - coordinates.y,
  };
}

function dragStartHandler<TData, TPassthroughData>(config: IUseOnDragInternalConfig<TData, TPassthroughData>, target: HTMLElement,
  setIsDragging: (isDragging: boolean) => void, event: MouseEvent): void {
  const { threshold, onDragStart, onDrag, onDragEnd, data } = config;
  if (event.button !== 0) { return; }
  event.stopPropagation();
  const coordinates: ICoordinates = { x: event.clientX, y: event.clientY };
  const currentTarget = event.target as HTMLElement;
  let passthroughData = null;
  let startedDragging = false;

  const dragHandler = (dragEvent: MouseEvent) => {
    if (config.isUnmounted) { removeHandlers(); return; }
    dragEvent.stopPropagation();
    const coordinatesDiff = getCoordinatesDiff(dragEvent, coordinates);
    if (!startedDragging) {
      if (Math.abs(coordinatesDiff.x) <= threshold && Math.abs(coordinatesDiff.y) <= threshold) { return; }
      startedDragging = true;
      setIsDragging(true);
      setDraggingData([data]);
      passthroughData = onDragStart({ target, currentTarget, coordinates, data });
    }
    passthroughData = onDrag({ target, currentTarget, coordinates, coordinatesDiff, data, passthroughData });
  };

  const dragEndHandler = (dragEndEvent: MouseEvent) => {
    if (config.isUnmounted) { removeHandlers(); return; }
    const coordinatesDiff = getCoordinatesDiff(dragEndEvent, coordinates);
    try {
      onDragEnd({ target, currentTarget, coordinates, coordinatesDiff, data, passthroughData });
    } catch (error) {
      throw error;
    } finally {
      passthroughData = null;
      removeHandlers();
      startedDragging = false;
      setIsDragging(false);
      setDraggingData(null);
    }
  };

  const removeHandlers = () => {
    document.removeEventListener('mousemove', dragHandler);
    document.removeEventListener('mouseup', dragEndHandler);
  };

  document.addEventListener('mousemove', dragHandler);
  document.addEventListener('mouseup', dragEndHandler);
}

function createDragTarget<TData, TPassthroughData>(dragTargetRef: HTMLElementRef, dragClassTargetRef: HTMLElementRef, config: IUseOnDragInternalConfig<TData, TPassthroughData>,
  setState: Dispatch<SetStateAction<IState>>): [HTMLTargetDelegate, (element: HTMLElement) => void] {
  const setIsDragging = useBound((isDragging: boolean) => {
    setState(s => ({ ...s, isDragging }));
    applyClassToElement(dragClassTargetRef.current || dragTargetRef.current, config.classToApplyWhileDragging, isDragging);
  });
  const boundDragStartHandler = useBound((event: MouseEvent) => dragStartHandler(config, dragTargetRef.current, setIsDragging, event));
  const connected = (element: HTMLElement) => { dragTargetRef.current = element; element.addEventListener('mousedown', boundDragStartHandler); };
  const disconnected = (element: HTMLElement) => { dragTargetRef.current = undefined; element.removeEventListener('mousedown', boundDragStartHandler); };
  const dragTarget = useSingleDOMRef({ connected, disconnected });
  return [dragTarget, disconnected];
}

function createDragClassTarget<TData, TPassthroughData>(dragClassTargetRef: HTMLElementRef, config: IUseOnDragInternalConfig<TData, TPassthroughData>, isDragging: boolean) {
  const connected = (element: HTMLElement) => {
    dragClassTargetRef.current = element;
    applyClassToElement(element, config.classToApplyWhileDragging, isDragging);
  };
  const disconnected = (element: HTMLElement) => {
    applyClassToElement(element, config.classToApplyWhileDragging, false);
    dragClassTargetRef.current = undefined;
  };
  return useSingleDOMRef({ connected, disconnected });
}

export function useOnDrag<TData = void, TPassthroughData = void>(config?: IUseOnDragConfig<TData, TPassthroughData>): IUseOnDragResult {
  const [state, setState] = useState<IState>({
    isDragging: false,
  });
  const dragTargetRef = useRef<HTMLElement>(undefined);
  const dragClassTargetRef = useRef<HTMLElement>(undefined);

  const internalConfig: IUseOnDragInternalConfig<TData, TPassthroughData> = {
    classToApplyWhileDragging: 'is-dragging',
    threshold: 3,
    onDragStart: () => null,
    onDrag: ({ passthroughData }) => passthroughData,
    onDragEnd: () => void 0,
    isUnmounted: false,
    ...config,
  };

  const [dragTarget, disconnectTarget] = createDragTarget(dragTargetRef, dragClassTargetRef, internalConfig, setState);
  const dragClassTarget = createDragClassTarget(dragClassTargetRef, internalConfig, state.isDragging);

  useOnUnmount(() => {
    if (dragTargetRef.current) { disconnectTarget(dragTargetRef.current); }
    internalConfig.isUnmounted = true;
  });

  return {
    isDragging: state.isDragging,
    dragTarget,
    dragClassTarget,
  };
}
