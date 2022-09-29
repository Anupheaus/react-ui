import { useRef, useEffect } from 'react';

export function useOnChange(delegate: () => void, dependencies: unknown[]): void {
  const isFirstCall = useRef(true);

  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      return;
    }
    delegate();
  }, dependencies);
}