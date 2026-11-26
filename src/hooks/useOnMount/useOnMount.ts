import { useEffect } from 'react';

export function useOnMount(delegate: () => void): void {
  useEffect(() => {
    delegate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount by design
  }, []);
}
