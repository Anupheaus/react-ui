import { MutableRefObject } from 'react';
import { IMap } from 'anux-common';
import { useOnUnmount } from '../useOnUnmount';

const sharedHookStates: IMap = {};

export type SharedHookState = MutableRefObject<Object>;

export function useSharedHookState(): SharedHookState {
  const frame = Function.getStackTrace().skip(2).firstOrDefault();
  if (!frame) { throw new Error('Unable to retrieve a stack frame for the caller of the hook using this shared hook state.'); }
  const key = `${frame.methodName}-${frame.file}`.hash(32);

  useOnUnmount(() => {
    setTimeout(() => {
      delete sharedHookStates[key];
    }, 0);
  });

  return sharedHookStates[key] = sharedHookStates[key] || {};
}