import { Context, ReactNode, useContext, useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { Logger, is } from '@anupheaus/common';


interface Props {
  children?: ReactNode;
  subLogName?: string;
}

export function createLoggerProvider(ContextComponent: Context<Logger>, logger: Logger) {
  return createComponent('LoggerProvider', ({
    children = null,
    subLogName,
  }: Props) => {
    const currentLogger = useContext(ContextComponent) ?? logger;

    const newLogger = useMemo(() => is.not.empty(subLogName) ? currentLogger.createSubLogger(subLogName) : currentLogger, [currentLogger, subLogName]);

    return (
      <ContextComponent.Provider value={newLogger}>
        {children}
      </ContextComponent.Provider>
    );
  });
}