import { AnyFunction, PromiseMaybe, PromiseState } from '@anupheaus/common';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useBound } from '../useBound';

type CallbackFunction = (...args: any[]) => PromiseMaybe<void>;

interface CallbackState {
  isDuringRenderPhase: boolean;
  waitOnRenderPhaseComplete: Promise<void>;
}

type AddCallbackState<T extends AnyFunction> = (this: CallbackState, ...args: Parameters<T>) => void;

export function useCallbacks<T extends CallbackFunction = () => void>() {
  const callbacks = useRef(new Set<T>()).current;

  const register = (delegate: AddCallbackState<T>) => {
    const waitOnRenderPhaseCompleteRef = useRef(useMemo(() => Promise.createDeferred(), []));
    if (waitOnRenderPhaseCompleteRef.current.state !== PromiseState.Pending) waitOnRenderPhaseCompleteRef.current = Promise.createDeferred();
    const boundDelegate = useBound(((...args: Parameters<T>) => delegate.bind({
      isDuringRenderPhase: waitOnRenderPhaseCompleteRef.current.state === PromiseState.Pending,
      waitOnRenderPhaseComplete: waitOnRenderPhaseCompleteRef.current,
    })(...args)) as T);
    callbacks.add(boundDelegate);
    useLayoutEffect(() => { waitOnRenderPhaseCompleteRef.current.resolve(); });
    useEffect(() => () => { callbacks.delete(boundDelegate); }, []);
  };

  const registerOutOfRenderPhaseOnly = (delegate: AddCallbackState<T>, timeout = 5000) => {
    register(async function (...args: Parameters<T>) {
      const cancelTimer = setTimeout(() => { throw new Error('Callback took too long to complete.'); }, timeout);
      await this.waitOnRenderPhaseComplete;
      clearTimeout(cancelTimer);
      return delegate.bind(this)(...args);
    });
  };

  const invoke = useBound((async (...args: unknown[]) => { await Promise.all(Array.from(callbacks).map(callback => callback(...args))); }) as T);

  return { invoke, register, registerOutOfRenderPhaseOnly } as const;
}