import { AnyFunction } from '@anupheaus/common';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useBound } from '../useBound';

type CallbackFunction = (...args: any[]) => void;

interface CallbackState {
  isDuringRenderPhase: boolean;
}

type AddCallbackState<T extends AnyFunction> = (state: CallbackState, ...args: Parameters<T>) => void;

export function useCallbacks<T extends CallbackFunction = () => void>() {
  const callbacks = useRef(new Set<T>()).current;

  const register = (delegate: AddCallbackState<T>) => {
    const isDuringRenderPhaseRef = useRef(true);
    isDuringRenderPhaseRef.current = true;
    const boundDelegate = useBound(((...args: Parameters<T>) => delegate({ isDuringRenderPhase: isDuringRenderPhaseRef.current }, ...args)) as T);
    callbacks.add(boundDelegate);
    useLayoutEffect(() => { isDuringRenderPhaseRef.current = false; });
    useEffect(() => () => { callbacks.delete(boundDelegate); }, []);
  };

  const invoke = useBound<T>(((...args: unknown[]) => callbacks.forEach(callback => callback(...args))) as T);

  return [invoke, register] as const;
}