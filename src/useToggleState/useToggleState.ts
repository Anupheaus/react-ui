import { useRef } from 'react';
import { IUseToggleStateResult } from './models';
import { useBound } from '../useBound';

interface IState {
  value: boolean;
  onChange(value: boolean): void | boolean;
  onEnable(): void | boolean;
  onDisable(): void | boolean;
}

export function useToggleState(initialState: boolean = false): IUseToggleStateResult {
  const stateRef = useRef<IState>({
    value: initialState,
    onChange: () => void 0,
    onEnable: () => void 0,
    onDisable: () => void 0,
  });

  const result: IUseToggleStateResult = {
    current: undefined,
    onChange: useBound(delegate => { stateRef.current.onChange = delegate; }),
    onEnable: useBound(delegate => { stateRef.current.onEnable = delegate; }),
    onDisable: useBound(delegate => { stateRef.current.onDisable = delegate; }),
    dispose: useBound(() => {
      useBound.disposeOf([stateRef.current.onChange, stateRef.current.onEnable, stateRef.current.onDisable]);
    }),
  };

  Object.defineProperty(result, 'current', {
    get() { return stateRef.current.value; },
    set(value: boolean) {
      if (value === stateRef.current.value) { return; }
      let returnedValue = stateRef.current.onChange(value);
      if (returnedValue !== undefined && returnedValue !== value) { return; }
      const method = value === true ? 'onEnable' : 'onDisable';
      returnedValue = stateRef.current[method]();
      if (returnedValue === false) { return; }
      stateRef.current.value = value;
    },
    enumerable: false,
    configurable: true,
  });

  return result;
}
