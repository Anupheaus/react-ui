import { Logger } from '@anupheaus/common';
import { createContext } from 'react';
import { createLoggerProvider } from './createLoggerProvider';
import { createUseLogger } from './useLogger';

export function createUILogger(nameOrLogger: string | Logger) {
  const logger = nameOrLogger instanceof Logger ? nameOrLogger : new Logger(nameOrLogger);
  const context = createContext<Logger>(logger);
  return {
    LoggerProvider: createLoggerProvider(context, logger),
    useLogger: createUseLogger(context),
  };
}