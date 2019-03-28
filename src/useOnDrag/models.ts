import { ICoordinates } from 'anux-common';
import { HTMLTargetDelegate } from '../useDOMRef';

export interface IUseOnDragResult {
  isDragging: boolean;
  dragTarget: HTMLTargetDelegate;
  dragClassTarget: HTMLTargetDelegate;
}

export interface IUseOnDragConfig<TData, TPassthroughData> {
  classToApplyWhileDragging?: string;
  threshold?: number;
  data?: TData;
  onDragStart?(data: IOnDragStartData<TData>): TPassthroughData;
  onDrag?(data: IOnDragData<TData, TPassthroughData>): TPassthroughData;
  onDragEnd?(data: IOnDragData<TData, TPassthroughData>): void;
}

export interface IOnDragStartData<TData> {
  target: HTMLElement;
  currentTarget: HTMLElement;
  coordinates: ICoordinates;
  data: TData;
}

export interface IOnDragData<TData, TPassthroughData = void> extends IOnDragStartData<TData> {
  coordinatesDiff: ICoordinates;
  passthroughData: TPassthroughData;
}

export interface IOnDragEndData<TData, TPassthroughData = void> extends IOnDragData<TData, TPassthroughData> { }
