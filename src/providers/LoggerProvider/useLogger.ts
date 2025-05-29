import { useContext, useMemo } from 'react';
import type { Logger } from '@anupheaus/common';
import { InternalError } from '@anupheaus/common';
import { LoggerContext } from './LoggerContext';

export function useLogger(subLogName?: string): Logger {
  const logger = useContext(LoggerContext);
  if (!logger) throw new InternalError('useLogger must be used within LoggerProvider');

  return useMemo(() => {
    if (subLogName) return logger.createSubLogger(subLogName);
    return logger;
  }, [logger, subLogName]);
}
