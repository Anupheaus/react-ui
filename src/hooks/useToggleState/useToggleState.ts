import { useState } from 'react';
import { useBound } from '../useBound';
import { is } from '@anupheaus/common';

export function useToggleState(initialState: boolean | (() => boolean) = false): [boolean, () => void] {
  const [isOpen, setIsOpen] = useState(() => is.function(initialState) ? initialState() : initialState);

  const toggle = useBound(() => {
    setIsOpen(!isOpen);
  });

  return [isOpen, toggle];
}
