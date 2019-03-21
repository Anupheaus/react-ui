import { Dispatch, SetStateAction, MutableRefObject } from 'react';

/**
 * Writes the value returned from the api method to the given property name on the state.
 * @param setState The dispatch method from useState.
 * @param propertyName The name of the property within the state to set the new value to.
 */
export function saveToState<TState, TKey extends keyof TState>(setState: Dispatch<SetStateAction<TState>>, propertyName: TKey,
  isUnmounted?: MutableRefObject<boolean>): (value: TState[TKey]) => void {
  return value => {
    if (isUnmounted && isUnmounted.current) { return; }
    setState(state => ({ ...state, [propertyName]: value }));
  };
}
