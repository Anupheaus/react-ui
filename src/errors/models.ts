import { ReactNode } from 'react';
import { AnuxError } from './types';

export interface OnRenderProps {
  error: AnuxError;
  children: ReactNode;
}

export interface OnErrorProps {
  error: AnuxError;
  occurredWithinThisBoundary: boolean;
  handleInThisBoundary(error: AnuxError): void;
}
export interface ErrorHandlerProps {
  onError?(props: OnErrorProps): void;
  onRender?(props: OnRenderProps): ReactNode | void;
}