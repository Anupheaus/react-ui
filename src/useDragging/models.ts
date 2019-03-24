import { Omit, ICoordinates } from 'anux-common';

export interface IUseDraggingResult {
  isDragging: boolean;
  dragTarget(element: HTMLElement): HTMLElement;
  applyDraggingClass(element: HTMLElement): HTMLElement;
}

export interface IUseDraggingConfig {
  classToApplyWhileDragging?: string;
  threshold?: number;
}

export interface IDraggingData<TData = void> {
  target: HTMLElement;
  currentTarget: HTMLElement;
  coordinates: ICoordinates;
  coordinatesDiff: ICoordinates;
  data: TData;
}

export interface IDragStartData<TData = void> extends Omit<IDraggingData<TData>, 'coordinatesDiff' | 'data'> { }
export interface IDragEndData<TData = void> extends IDraggingData<TData> { }
