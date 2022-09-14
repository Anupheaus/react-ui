import { createContext } from 'react';

export interface RecordErrorsContextProps {
  recordError(error: unknown): void;
}

export const ErrorContexts = {
  recordErrors: createContext<RecordErrorsContextProps>({
    recordError: () => void 0,
  }),
};
