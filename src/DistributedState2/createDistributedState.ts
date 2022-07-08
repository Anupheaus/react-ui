import { createDistributedStateContext } from './createDistributedStateContext';
import { createDistributedStateHook } from './createDistributedStateHook';
import { createDistributedStateProvider } from './createDistributedStateProvider';
import { DistributedStateChangeMeta } from './DistributedStateModels';

export function createDistributedState<TState, TStateChangeMeta extends DistributedStateChangeMeta = DistributedStateChangeMeta>() {
  const context = createDistributedStateContext<TState, TStateChangeMeta>();
  const Provider = createDistributedStateProvider<TState, TStateChangeMeta>(context);
  const useProvider = createDistributedStateHook<TState, TStateChangeMeta>(context);

  return {
    Provider,
    useProvider,
  };
}
