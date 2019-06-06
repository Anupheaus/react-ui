import { useEffect } from 'react';

export function useOnMount(delegate: () => void): void {
  useEffect(() => {
    delegate();
  }, []);
}
