import { IDragStartData, IDraggingData, IDragEndData, IUseDraggingResult, IUseDraggingConfig } from './models';
import { Omit, ICoordinates } from 'anux-common';
import { useState, useRef, MutableRefObject, useCallback } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

interface IUseDraggingApi<TData> {
  onDragStart<TNewData>(delegate: (data: Omit<IDraggingData<TData>, 'data'>) => TNewData): Omit<IUseDraggingApi<TNewData>, 'onDragStart'>;
  onDragging(delegate: (data: IDraggingData<TData>) => TData): Pick<IUseDraggingApi<TData>, 'onDragEnd'>;
  onDragEnd(delegate: (data: IDraggingData<TData>) => void): IUseDraggingResult;
}

interface IUseDraggingInternalConfig extends IUseDraggingConfig {
  isUnmounted?: boolean;
  onDragStart?(data: IDragStartData<any>): any;
  onDragging?(data: IDraggingData<any>): any;
  onDragEnd?(data: IDragEndData<any>): void;
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

function dragStartHandler(config: IUseDraggingInternalConfig, target: HTMLElement,
  setIsDragging: (isDragging: boolean) => void, event: MouseEvent): void {
  const { threshold, onDragStart, onDragging, onDragEnd } = config;
  if (event.button !== 0) { return; }
  event.stopPropagation();
  const coordinates: ICoordinates = { x: event.clientX, y: event.clientY };
  const currentTarget = event.target as HTMLElement;
  let data = null;
  let startedDragging = false;

  const dragHandler = (dragEvent: MouseEvent) => {
    if (config.isUnmounted) { removeHandlers(); return; }
    dragEvent.stopPropagation();
    const coordinatesDiff = getCoordinatesDiff(dragEvent, coordinates);
    if (!startedDragging) {
      if (Math.abs(coordinatesDiff.x) <= threshold && Math.abs(coordinatesDiff.y) <= threshold) { return; }
      startedDragging = true;
      setIsDragging(true);
      data = onDragStart({ target, currentTarget, coordinates });
    }
    data = onDragging({ target, currentTarget, coordinates, coordinatesDiff, data });
  };

  const dragEndHandler = (dragEndEvent: MouseEvent) => {
    if (config.isUnmounted) { removeHandlers(); return; }
    const coordinatesDiff = getCoordinatesDiff(dragEndEvent, coordinates);
    try {
      onDragEnd({ target, currentTarget, coordinates, coordinatesDiff, data });
    } catch (error) {
      throw error;
    } finally {
      data = null;
      removeHandlers();
      startedDragging = false;
      setIsDragging(false);
    }
  };

  const removeHandlers = () => {
    document.removeEventListener('mousemove', dragHandler);
    document.removeEventListener('mouseup', dragEndHandler);
  };

  document.addEventListener('mousemove', dragHandler);
  document.addEventListener('mouseup', dragEndHandler);
}

function connectElement(element: HTMLElement, boundDragStartHandler: (event: MouseEvent) => void): HTMLElement {
  if (element) { element.addEventListener('mousedown', boundDragStartHandler); }
  return element;
}

function disconnectElement(element: HTMLElement, boundDragStartHandler: (event: MouseEvent) => void): HTMLElement {
  if (element) { element.removeEventListener('mousedown', boundDragStartHandler); }
  return element;
}

function saveElement(currentElement: MutableRefObject<HTMLElement>, element: HTMLElement, boundDragStartHandler: (event: MouseEvent) => void): HTMLElement {
  if (currentElement.current === element) { return; }
  if (currentElement.current) { disconnectElement(currentElement.current, boundDragStartHandler); }
  currentElement.current = element;
  return connectElement(element, boundDragStartHandler);
}

function createUseDraggingApiResult(config: IUseDraggingInternalConfig): IUseDraggingResult {
  const [state, setState] = useState<IState>({
    isDragging: false,
  });
  const dragTargetRef = useRef<HTMLElement>(undefined);
  const applyDraggingClassRef = useRef<HTMLElement>(undefined);

  config = {
    classToApplyWhileDragging: 'is-dragging',
    threshold: 3,
    onDragStart: () => null,
    onDragging: ({ data }) => data,
    onDragEnd: () => void 0,
    isUnmounted: false,
    ...config,
  };

  const setIsDragging = useBound((isDragging: boolean) => {
    setState(s => ({ ...s, isDragging }));
    applyClassToElement(applyDraggingClassRef.current || dragTargetRef.current, config.classToApplyWhileDragging, isDragging);
  });
  const boundDragStartHandler = useBound((event: MouseEvent) => dragStartHandler(config, dragTargetRef.current, setIsDragging, event));
  const dragTarget = useCallback((element: HTMLElement) => saveElement(dragTargetRef, element, boundDragStartHandler), []);
  const applyDraggingClass = useBound((element: HTMLElement) => applyDraggingClassRef.current = element);

  useOnUnmount(() => {
    disconnectElement(dragTargetRef.current, boundDragStartHandler);
    config.isUnmounted = true;
  });

  return {
    isDragging: state.isDragging,
    dragTarget,
    applyDraggingClass,
  };
}

function useDraggingApiFactory(config: IUseDraggingInternalConfig): IUseDraggingApi<any> {
  return {
    onDragStart: delegate => useDraggingApiFactory({ ...config, onDragStart: delegate }),
    onDragging: delegate => useDraggingApiFactory({ ...config, onDragging: delegate }),
    onDragEnd: delegate => createUseDraggingApiResult({ ...config, onDragEnd: delegate }),
  };
}

export function useDragging(config?: IUseDraggingConfig): IUseDraggingApi<void> {
  return useDraggingApiFactory(config || {});
}
