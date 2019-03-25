import { IOnDragStartData, IOnDragData, IOnDragEndData, IUseOnDragResult, IUseOnDragConfig } from './models';
import { Omit, ICoordinates } from 'anux-common';
import { useState, useRef, MutableRefObject, useCallback } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';

interface IUseOnDragApi<TData> {
  onDragStart<TNewData>(delegate: (data: Omit<IOnDragData<TData>, 'data'>) => TNewData): Omit<IUseOnDragApi<TNewData>, 'onDragStart'>;
  onDragging(delegate: (data: IOnDragData<TData>) => TData): Pick<IUseOnDragApi<TData>, 'onDragEnd'>;
  onDragEnd(delegate: (data: IOnDragData<TData>) => void): IUseOnDragResult;
}

interface IUseOnDragInternalConfig extends IUseOnDragConfig {
  isUnmounted?: boolean;
  onDragStart?(data: IOnDragStartData<any>): any;
  onDragging?(data: IOnDragData<any>): any;
  onDragEnd?(data: IOnDragEndData<any>): void;
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

function dragStartHandler(config: IUseOnDragInternalConfig, target: HTMLElement,
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

function createUseOnDragResult(config: IUseOnDragInternalConfig): IUseOnDragResult {
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

function useOnDragApiFactory(config: IUseOnDragInternalConfig): IUseOnDragApi<any> {
  return {
    onDragStart: delegate => useOnDragApiFactory({ ...config, onDragStart: delegate }),
    onDragging: delegate => useOnDragApiFactory({ ...config, onDragging: delegate }),
    onDragEnd: delegate => createUseOnDragResult({ ...config, onDragEnd: delegate }),
  };
}

export function useOnDrag(config?: IUseOnDragConfig): IUseOnDragApi<void> {
  return useOnDragApiFactory(config || {});
}
