import { IUseOnDropConfig, IUseOnDropResult, IUseOnDropStateClasses } from './models';
import { useRef, MutableRefObject } from 'react';
import { useSingleDOMRef, HTMLElementRef } from '../useDOMRef';
import { retrieveDraggingData } from '../dragAndDropRegistry/registry';

enum DraggableValidityStates {
  None,
  IsValid,
  IsPartiallyValid,
  IsInvalid,
}

namespace DraggableValidityStates {

  export function toClassName(classes: IUseOnDropStateClasses, state: DraggableValidityStates): string[] {
    return [
      state === DraggableValidityStates.None || state === DraggableValidityStates.IsValid ? classes.isDraggableValid : undefined,
      state === DraggableValidityStates.None || state === DraggableValidityStates.IsInvalid ? classes.isDraggableInvalid : undefined,
      state === DraggableValidityStates.None || state === DraggableValidityStates.IsPartiallyValid ? classes.isDraggablePartiallyValid : undefined,
    ].removeNull();
  }
}

interface IStateData<TData, TPassthroughData> {
  data: TData[];
  passthroughData: TPassthroughData;
  state: DraggableValidityStates;
}

function isDragging(event: MouseEvent): boolean {
  return event.which === 1;
}

function applyStateClass<TData, TPassthroughData>(element: HTMLElement, stateClasses: IUseOnDropConfig<TData, TPassthroughData>['classes'], state: DraggableValidityStates): void {
  element.classList.remove(...DraggableValidityStates.toClassName(stateClasses, DraggableValidityStates.None));
  if (state !== DraggableValidityStates.None) { element.classList.add(...DraggableValidityStates.toClassName(stateClasses, state)); }
}

function handleDraggableEntered<TData, TPassthroughData>(config: IUseOnDropConfig<TData, TPassthroughData>, dropTargetRef: HTMLElementRef,
  dropClassTargetRef: HTMLElementRef, stateDataRef: MutableRefObject<IStateData<TData, TPassthroughData>>): void {
  const draggingData = retrieveDraggingData();
  if (draggingData.length > 0) {
    const validDraggingData = draggingData.filter(config.validate);
    const validityState = validDraggingData.length === 0 ? DraggableValidityStates.IsInvalid : validDraggingData.length !== draggingData.length
      ? DraggableValidityStates.IsPartiallyValid : DraggableValidityStates.IsValid;
    applyStateClass(dropClassTargetRef.current || dropTargetRef.current, config.classes, validityState);
    if (validDraggingData.length > 0) {
      const passthroughData = config.onEntered(validDraggingData);
      stateDataRef.current = {
        data: validDraggingData,
        passthroughData,
        state: validityState,
      };
    }
  }
  return;
}

function resetStateAfterLeaveOrDrop<TData, TPassthroughData>(config: IUseOnDropConfig<TData, TPassthroughData>, dropTargetRef: HTMLElementRef, dropClassTargetRef: HTMLElementRef,
  stateDataRef: MutableRefObject<IStateData<TData, TPassthroughData>>, invokeMethod: (data: TData[], passthroughData: TPassthroughData) => void): void {
  applyStateClass(dropClassTargetRef.current || dropTargetRef.current, config.classes, DraggableValidityStates.None);
  const { data, passthroughData } = stateDataRef.current;
  if (data.length > 0) {
    invokeMethod(data, passthroughData);
    stateDataRef.current.data = [];
    stateDataRef.current.passthroughData = undefined;
  }
}

function handleDraggableLeft<TData, TPassthroughData>(config: IUseOnDropConfig<TData, TPassthroughData>, dropTargetRef: HTMLElementRef, dropClassTargetRef: HTMLElementRef,
  stateDataRef: MutableRefObject<IStateData<TData, TPassthroughData>>): void {
  resetStateAfterLeaveOrDrop(config, dropTargetRef, dropClassTargetRef, stateDataRef, config.onExited);
}

function handleDraggableDropped<TData, TPassthroughData>(config: IUseOnDropConfig<TData, TPassthroughData>, dropTargetRef: HTMLElementRef, dropClassTargetRef: HTMLElementRef,
  stateDataRef: MutableRefObject<IStateData<TData, TPassthroughData>>): void {
  resetStateAfterLeaveOrDrop(config, dropTargetRef, dropClassTargetRef, stateDataRef, config.onDropped);
}

function createDropTarget<TData, TPassthroughData>(dropTargetRef: HTMLElementRef, dropClassTargetRef: HTMLElementRef, config: IUseOnDropConfig<TData, TPassthroughData>,
  stateDataRef: MutableRefObject<IStateData<TData, TPassthroughData>>) {
  const draggableEntered = (event: MouseEvent) => isDragging(event) && handleDraggableEntered(config, dropTargetRef, dropClassTargetRef, stateDataRef);
  const draggableLeft = () => handleDraggableLeft(config, dropTargetRef, dropClassTargetRef, stateDataRef);
  const draggableDropped = () => handleDraggableDropped(config, dropTargetRef, dropClassTargetRef, stateDataRef);
  const connected = (element: HTMLElement) => {
    dropTargetRef.current = element;
    element.addEventListener('mouseenter', draggableEntered);
    element.addEventListener('mouseleave', draggableLeft);
    element.addEventListener('mouseup', draggableDropped);
  };
  const disconnected = (element: HTMLElement) => {
    element.removeEventListener('mouseenter', draggableEntered);
    element.removeEventListener('mouseleave', draggableLeft);
    element.removeEventListener('mouseup', draggableDropped);
    dropTargetRef.current = undefined;
  };
  return useSingleDOMRef({ connected, disconnected });
}

function createDropClassTarget<TData, TPassthroughData>(dragClassTargetRef: HTMLElementRef, config: IUseOnDropConfig<TData, TPassthroughData>,
  stateDataRef: MutableRefObject<IStateData<TData, TPassthroughData>>) {
  const connected = (element: HTMLElement) => {
    dragClassTargetRef.current = element;
    applyStateClass(element, config.classes, stateDataRef.current.state);
  };
  const disconnected = (element: HTMLElement) => {
    applyStateClass(element, config.classes, DraggableValidityStates.None);
    dragClassTargetRef.current = undefined;
  };
  return useSingleDOMRef({ connected, disconnected });
}

export function useOnDrop<TData, TPassthroughData = void>(config?: IUseOnDropConfig<TData, TPassthroughData>): IUseOnDropResult {
  const dropTargetRef = useRef<HTMLElement>();
  const dropClassTargetRef = useRef<HTMLElement>();
  const stateDataRef = useRef<IStateData<TData, TPassthroughData>>({ data: [], passthroughData: undefined, state: DraggableValidityStates.None });

  config = {
    validate: () => true,
    onEntered: () => void 0,
    onExited: () => void 0,
    onDropped: () => void 0,
    ...config,
    classes: {
      isDraggableValid: 'draggable-is-valid',
      isDraggableInvalid: 'draggable-is-invalid',
      isDraggablePartiallyValid: 'draggable-is-partially-valid',
      ...(config || {}).classes,
    },
  };

  const dropTarget = createDropTarget(dropTargetRef, dropClassTargetRef, config, stateDataRef);
  const dropClassTarget = createDropClassTarget(dropClassTargetRef, config, stateDataRef);

  return {
    dropTarget,
    dropClassTarget,
  };
}
