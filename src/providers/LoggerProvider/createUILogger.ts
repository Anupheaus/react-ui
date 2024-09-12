import { Logger } from '@anupheaus/common';
import { createContext } from 'react';
import { createLoggerProvider } from './createLoggerProvider';
import { createUseLogger } from './useLogger';

function createInternalUILogger(nameOrLogger: string | Logger) {
  const logger = nameOrLogger instanceof Logger ? nameOrLogger : new Logger(nameOrLogger);
  const context = createContext<Logger>(logger);
  return {
    LoggerProvider: createLoggerProvider(context, logger),
    useLogger: createUseLogger(context),
  };
}

export function createUILogger(name: string): ReturnType<typeof createInternalUILogger>;
export function createUILogger(logger: Logger): ReturnType<typeof createInternalUILogger>;
export function createUILogger(nameOrLogger: string | Logger) {
  return createInternalUILogger(nameOrLogger);
}