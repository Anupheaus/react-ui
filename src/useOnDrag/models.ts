import { Omit, ICoordinates } from 'anux-common';

export interface IUseOnDragResult {
  isDragging: boolean;
  dragTarget(element: HTMLElement): HTMLElement;
  applyDraggingClass(element: HTMLElement): HTMLElement;
}

export interface IUseOnDragConfig {
  classToApplyWhileDragging?: string;
  threshold?: number;
}

export interface IOnDragData<TData = void> {
  target: HTMLElement;
  currentTarget: HTMLElement;
  coordinates: ICoordinates;
  coordinatesDiff: ICoordinates;
  data: TData;
}

export interface IOnDragStartData<TData = void> extends Omit<IOnDragData<TData>, 'coordinatesDiff' | 'data'> { }
export interface IOnDragEndData<TData = void> extends IOnDragData<TData> { }
