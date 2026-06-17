import type { AnyFunction, DeferredPromise, PromiseMaybe } from '@anupheaus/common';
import { InternalError, PromiseState } from '@anupheaus/common';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useBound } from '../useBound';
import { useForceUpdate } from '../useForceUpdate';
import { useSet } from '../useSet';

type CallbackFunction = (...args: any[]) => PromiseMaybe<void>;

export interface CallbackState {
  isDuringRenderPhase: boolean;
  waitOnRenderPhaseComplete: Promise<void>;
}

export interface RegisterOutOfRenderPhaseProps {
  timeout?: number;
  updateAfterTimeout?: number;
}

type AddCallbackState<T extends AnyFunction> = (this: CallbackState, ...args: Parameters<T>) => void;

function internalUseCallbacks<T extends CallbackFunction = () => void>() {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- internal render-time helper for useCallbacks; the register helpers below are invoked once per callback during render, so hook order is stable
  const callbacks = useSet<T>();

  const register = (delegate: AddCallbackState<T>) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const waitOnRenderPhaseCompleteRef = useRef(useMemo(() => Promise.createDeferred(), []));
    if (waitOnRenderPhaseCompleteRef.current.state !== PromiseState.Pending) waitOnRenderPhaseCompleteRef.current = Promise.createDeferred();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const boundDelegate = useBound((...args: Parameters<T>) => delegate.call({
      isDuringRenderPhase: waitOnRenderPhaseCompleteRef.current.state === PromiseState.Pending,
      waitOnRenderPhaseComplete: waitOnRenderPhaseCompleteRef.current,
    }, ...args)) as T;
    if (!callbacks.has(boundDelegate)) callbacks.add(boundDelegate);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      waitOnRenderPhaseCompleteRef.current.resolve();
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => () => {
      callbacks.delete(boundDelegate);
    }, []);
  };

  const registerOutOfRenderPhaseOnly = (delegate: AddCallbackState<T>, { timeout = 5000, updateAfterTimeout = 5 }: RegisterOutOfRenderPhaseProps = {}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const update = useForceUpdate();
    register(async function (...args: Parameters<T>) {
      const updateTimer = setTimeout(() => update(), updateAfterTimeout);
      const cancelTimer = setTimeout(() => {
        const error = new InternalError('Callback took too long to complete.', {
          meta: {
            waitOnRenderPhaseComplete: (this.waitOnRenderPhaseComplete as DeferredPromise).state,
            isDuringRenderPhase: this.isDuringRenderPhase,
            args,
          },
        });
        (this.waitOnRenderPhaseComplete as DeferredPromise).reject(error);
        // throw error;
      }, timeout);
      await this.waitOnRenderPhaseComplete;
      clearTimeout(updateTimer);
      clearTimeout(cancelTimer);
      return delegate.call(this, ...args);
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const invoke = useBound((async (...args: unknown[]) => { await Promise.all(Array.from(callbacks).map(callback => callback(...args))); }) as T);

  return { invoke, register, registerOutOfRenderPhaseOnly };
}

class UseCallbacksReturnType<T extends CallbackFunction> { public result() { return internalUseCallbacks<T>(); } }

export type UseCallbacks<T extends CallbackFunction> = ReturnType<UseCallbacksReturnType<T>['result']>;

export function useCallbacks<T extends CallbackFunction = () => void>(): UseCallbacks<T> { return internalUseCallbacks<T>(); }
