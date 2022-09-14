import { useMemo } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { useForceUpdate } from '../../useForceUpdate';
import { useCallbacks } from '../useCallbacks';

export function useCreateHookComponent() {
  const [invoke, register] = useCallbacks();

  function createComponent<T>(name: string, component: (props: T) => JSX.Element) {
    return useMemo(() => anuxPureFC<T>(name, props => {
      const refresh = useForceUpdate();
      register(() => refresh());
      return component(props);
    }), []);
  }

  return {
    createComponent,
    refreshComponent: invoke,
  };
}