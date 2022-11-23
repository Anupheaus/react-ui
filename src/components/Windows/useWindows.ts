import { useContext } from 'react';
import { WindowsContexts } from './WindowsContexts';

export function useWindows() {
  const { addWindow } = useContext(WindowsContexts.useWindows);

  return {
    addWindow,
  };
}