import { Context, useContext, useMemo } from 'react';
import { InternalError, Logger } from '@anupheaus/common';

export function createUseLogger(context: Context<Logger>) {
  return function useLogger(subLogName?: string) {
    const logger = useContext(context);
    if (!logger) throw new InternalError('useLogger must be used within LoggerProvider');
    return useMemo(() => {
      if (subLogName) return logger.createSubLogger(subLogName);
      return logger;
    }, [logger, subLogName]);
  };
}
