import type { Context } from 'react';
import { useContext, useMemo } from 'react';
import type { Logger } from '@anupheaus/common';
import { InternalError } from '@anupheaus/common';

export function createUseLogger(context: Context<Logger>) {
  return function useLogger(subLogName?: string): Logger {
    const logger = useContext(context);
    if (!logger) throw new InternalError('useLogger must be used within LoggerProvider');
    return useMemo(() => {
      if (subLogName) return logger.createSubLogger(subLogName);
      return logger;
    }, [logger, subLogName]);
  };
}
