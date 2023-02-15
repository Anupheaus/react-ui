import { Error } from '@anupheaus/common';
import { ReactNode } from 'react';

export interface OnRenderProps {
  error: Error;
  children: ReactNode;
}

export interface OnErrorProps {
  error: Error;
  occurredWithinThisBoundary: boolean;
  handleInThisBoundary(error: Error): void;
}
export interface ErrorHandlerProps {
  onError?(props: OnErrorProps): void;
  onRender?(props: OnRenderProps): ReactNode | void;
}