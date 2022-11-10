import { AnyObject } from '@anupheaus/common';
import { createContext } from 'react';

export interface RecordErrorsContextProps {
  isValid: boolean;
  recordError(error: unknown, isAsync: boolean, meta?: AnyObject): void;
}

export const ErrorContexts = {
  recordErrors: createContext<RecordErrorsContextProps>({
    isValid: false,
    recordError: () => void 0,
  }),
};
