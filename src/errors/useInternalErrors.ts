import { useContext } from 'react';
import { ErrorContexts } from './ErrorContexts';

export function useInternalErrors() {
  const { recordError } = useContext(ErrorContexts.recordErrors);

  return {
    recordError,
  };
}