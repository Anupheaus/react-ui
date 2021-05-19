import { createContext } from 'react';
import { OnErrorProps } from './models';
import { AnuxError } from './types';

export type OptionalOnErrorHandler = (props?: OnErrorProps) => void;

export interface ContextProps {
  isParentAvailable: boolean;
  getError(): AnuxError | undefined;
  registerOnError(onError: OptionalOnErrorHandler): () => void;
  registerOnReset(onReset: () => void): () => void;
  captureError(error: Error, isAsync?: boolean): void;
  bubbleError(error: AnuxError): void;
  tryRenderingError(error: AnuxError): void;
  resetError(): void;
}

export const Context = createContext<ContextProps>({
  isParentAvailable: false,
  getError: () => void 0,
  registerOnError: () => () => void 0,
  registerOnReset: () => () => void 0,
  captureError: () => void 0,
  tryRenderingError: () => void 0,
  bubbleError: () => void 0,
  resetError: () => void 0,
});
