import { is, PromiseMaybe } from '@anupheaus/common';
import { ReactNode, useContext, useMemo } from 'react';
import { useBound, useCallbacks, useId } from '../../hooks';
import { createComponent } from '../Component';
import { WindowsManagerContext, WindowsManagerContextProps } from './WindowsContexts';

interface Props {
  id?: string;
  children: ReactNode;
}

export const WindowsManager = createComponent('WindowsManager', ({
  id: providedId,
  children,
}: Props) => {
  let id = useId();
  if (providedId) id = providedId;
  const managerContexts = useContext(WindowsManagerContext);
  const { invoke, registerOutOfRenderPhaseOnly } = useCallbacks<(id: string, action: string, ...args: unknown[]) => Promise<void>>();

  const onAction = useBound((...args: unknown[]) => {
    const windowId = is.string(args[0]) && is.string(args[1]) && is.function(args[2]) ? args[0] : id;
    const action = is.string(args[0]) && is.string(args[1]) && is.function(args[2]) ? args[1] : is.string(args[0]) && is.function(args[1]) ? args[0] : undefined;
    const delegate = (is.string(args[0]) && is.string(args[1]) && is.function(args[2]) ? args[2] : is.string(args[0]) && is.function(args[1]) ? args[1]
      : undefined) as (...args: unknown[]) => PromiseMaybe<unknown>;
    return registerOutOfRenderPhaseOnly((targetId, targetAction, ...actionArgs) => {
      if (action !== targetAction) return;
      if (args.length === 2) return delegate(targetId, ...actionArgs);
      if (targetId !== windowId) return;
      return delegate(...actionArgs);
    });
  });

  const context = useMemo<Map<string, WindowsManagerContextProps>>(() => new Map(Array.from(managerContexts.entries()).concat([[id, {
    id,
    invoke,
    onAction,
  }]])), [id]);

  return (
    <WindowsManagerContext.Provider value={context}>
      {children}
    </WindowsManagerContext.Provider>
  );
});
