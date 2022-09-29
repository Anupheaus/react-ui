import { Dispatch, SetStateAction, useState } from 'react';
import { useBound } from '../useBound';

export function useBooleanState(defaultValue = false): [boolean, () => void, () => void, Dispatch<SetStateAction<boolean>>] {
  const [flag, setFlag] = useState(defaultValue);
  return [flag, useBound(() => setFlag(true)), useBound(() => setFlag(false)), setFlag];
}
