import { AnyFunction, is } from 'anux-common';
import { Dispatch, SetStateAction, useLayoutEffect, useMemo, useRef } from 'react';
import { useBound } from '../useBound';

const defaultCallback = (callback: AnyFunction, value: unknown) => callback(value);

interface Props<ValueType, CallbackType extends AnyFunction> {
  invokeCallbackOnRegistration?: boolean;
  defaultState?(): ValueType;
  invokeCallback?(callback: CallbackType, value: ValueType): void;
}

export function useCallbackState<ValueType, CallbackType extends AnyFunction = (value: ValueType) => void>({
  invokeCallbackOnRegistration = true,
  defaultState,
  invokeCallback = defaultCallback
}: Props<ValueType, CallbackType> = {}) {

  const callbacks = useRef(new Set<CallbackType>()).current;
  const valueRef = useRef<ValueType>(useMemo(() => defaultState?.() as ValueType, []));

  const invokeCallbacks = () => callbacks.forEach(callback => invokeCallback(callback, valueRef.current));

  const onChanged = (callback: CallbackType) => {
    useLayoutEffect(() => {
      callbacks.add(callback);
      if (invokeCallbackOnRegistration) invokeCallback(callback, valueRef.current);
      return () => {
        callbacks.delete(callback);
      };
    }, []);
  };

  const change = useBound<Dispatch<SetStateAction<ValueType>>>(valueOrDelegate => {
    if (is.function(valueOrDelegate)) {
      valueRef.current = valueOrDelegate(valueRef.current);
    } else {
      valueRef.current = valueOrDelegate;
    }
    invokeCallbacks();
  });

  return {
    change,
    onChanged,
  };
}