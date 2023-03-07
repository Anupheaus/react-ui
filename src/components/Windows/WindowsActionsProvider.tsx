import { is, PromiseMaybe } from '@anupheaus/common';
import { ReactNode, useMemo } from 'react';
import { useBound, useCallbacks } from '../../hooks';
import { createComponent } from '../Component';
import { WindowsProviderId } from './Windows';
import { WindowsActionsContext, WindowsActionsContextProps } from './WindowsContexts';

interface Props {
  children: ReactNode;
}

export const WindowsActionsProvider = createComponent('WindowsActionsProvider', ({
  children,
}: Props) => {
  const { invoke, registerOutOfRenderPhaseOnly } = useCallbacks<(id: string, action: string, ...args: unknown[]) => Promise<void>>();

  const onAction = useBound((...args: unknown[]) => {
    const id = is.string(args[0]) && is.string(args[1]) && is.function(args[2]) ? args[0] : WindowsProviderId;
    const action = is.string(args[0]) && is.string(args[1]) && is.function(args[2]) ? args[1] : is.string(args[0]) && is.function(args[1]) ? args[0] : undefined;
    const delegate = (is.string(args[0]) && is.string(args[1]) && is.function(args[2]) ? args[2] : is.string(args[0]) && is.function(args[1]) ? args[1]
      : undefined) as (...args: unknown[]) => PromiseMaybe<unknown>;
    return registerOutOfRenderPhaseOnly((targetId, targetAction, ...actionArgs) => {
      if (action !== targetAction) return;
      if (args.length === 2) return delegate(targetId, ...actionArgs);
      if (targetId !== id) return;
      return delegate(...actionArgs);
    });
  });

  const context = useMemo<WindowsActionsContextProps>(() => ({
    isValid: true,
    invoke,
    onAction,
  }), []);

  return (
    <WindowsActionsContext.Provider value={context}>
      {children}
    </WindowsActionsContext.Provider>

  );
});
