import { useRef } from 'react';
import { useOnUnmount } from '../useOnUnmount';
import { AnonymousFunction, UseBoundFunctionResult, IUseBoundConfig, UseBoundFunction, UseBound } from './models';

interface IBoundFuncState<T extends AnonymousFunction> {
  stub: UseBoundFunctionResult<T>;
  whenUnmounted: T;
  func: T;
}

function createBoundFactory(config: IUseBoundConfig): UseBoundFunction {
  return <TFunc extends AnonymousFunction>(func: TFunc) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const boundFunc = useBoundFunc(func);
    if (config.whenUnmounted) { boundFunc.whenUnmounted(config.whenUnmounted as TFunc); }
    return boundFunc;
  };
}

function disposeOfFuncs(funcs: AnonymousFunction | AnonymousFunction[]): void {
  const funcsArray = funcs instanceof Array ? funcs : [funcs];
  funcsArray.forEach(func => func['dispose'] ? func['dispose']() : null);
}

function useBoundFunc<TFunc extends AnonymousFunction>(func: TFunc): UseBoundFunctionResult<TFunc> {
  const isUnmountedRef = useOnUnmount();
  const state = useRef<IBoundFuncState<TFunc>>({
    stub: undefined,
    func: undefined,
    whenUnmounted: undefined,
  });
  if (!state.current.stub) {
    state.current.stub = ((...args: unknown[]) => {
      if (state.current.whenUnmounted && isUnmountedRef.current) { return state.current.whenUnmounted(...args); }
      if (!state.current.func) { throw new Error('This bound method has been called after being disposed.'); }
      return state.current.func(...args);
    }) as UseBoundFunctionResult<TFunc>;
    state.current.stub.whenUnmounted = (delegate: TFunc) => { state.current.whenUnmounted = delegate; return state.current.stub; };
    state.current.stub.dispose = () => {
      delete state.current.func;
    };
  }
  state.current.func = func;
  return state.current.stub;
}

const useBound = useBoundFunc as UseBound;
useBound.create = createBoundFactory;
useBound.disposeOf = disposeOfFuncs;

export {
  useBound,
};
