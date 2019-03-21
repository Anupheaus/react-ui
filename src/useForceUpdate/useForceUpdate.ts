import { useReducer } from 'react';

export function useForceUpdate() {
  const [value, setValue] = useReducer(x => 1 - x, 0);
  return () => setValue(value);
}
