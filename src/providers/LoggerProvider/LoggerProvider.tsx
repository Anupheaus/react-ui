import type { ReactNode } from 'react';
import { useContext, useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { Logger } from '@anupheaus/common';
import { LoggerContext } from './LoggerContext';

type LoggerOrNameProps = { logger: Logger; loggerName?: string; } | { logger: Logger | undefined; loggerName: string; };

type Props = LoggerOrNameProps & {
  children?: ReactNode;
};

export const LoggerProvider = createComponent('LoggerProvider', ({
  children = null,
  loggerName,
  logger: providedLogger,
}: Props) => {
  const parentLogger = useContext(LoggerContext);

  const logger = useMemo(() => {
    if (loggerName) {
      if (providedLogger) return providedLogger.createSubLogger(loggerName);
      if (parentLogger) return parentLogger.createSubLogger(loggerName);
      return new Logger(loggerName);
    } else {
      if (providedLogger) return providedLogger;
      if (parentLogger) return parentLogger;
      throw new Error('Neither logger nor loggerName was provided to the LoggerProvider');
    }
  }, [parentLogger, loggerName, providedLogger]);

  return (
    <LoggerContext.Provider value={logger}>
      {children}
    </LoggerContext.Provider>
  );
});
