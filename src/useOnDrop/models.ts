import { HTMLTargetDelegate } from '../useDOMRef';

export interface IUseOnDropResult {
  dropTarget: HTMLTargetDelegate;
  dropClassTarget: HTMLTargetDelegate;
}

export interface IUseOnDropStateClasses {
  isDraggableValid?: string;
  isDraggableInvalid?: string;
  isDraggablePartiallyValid?: string;
}

export interface IUseOnDropConfig<TData, TPassthroughData> {
  classes?: IUseOnDropStateClasses;
  validate?(data: TData): boolean;
  onEntered?(data: TData[]): TPassthroughData;
  onExited?(data: TData[], passthroughData: TPassthroughData): void;
  onDropped?(data: TData[], passthroughData: TPassthroughData): void;
}
