import type { Context, ReactNode } from 'react';
import { useContext, useMemo } from 'react';
import { createComponent } from '../../components/Component';
import type { Logger } from '@anupheaus/common';
import { is } from '@anupheaus/common';


export interface LoggerProviderProps {
  children?: ReactNode;
  subLogName?: string;
}

export function createLoggerProvider(ContextComponent: Context<Logger>, logger: Logger) {
  return createComponent('LoggerProvider', ({
    children = null,
    subLogName,
  }: LoggerProviderProps) => {
    const currentLogger = useContext(ContextComponent) ?? logger;

    const newLogger = useMemo(() => is.not.empty(subLogName) ? currentLogger.createSubLogger(subLogName) : currentLogger, [currentLogger, subLogName]);

    return (
      <ContextComponent.Provider value={newLogger}>
        {children}
      </ContextComponent.Provider>
    );
  });
}