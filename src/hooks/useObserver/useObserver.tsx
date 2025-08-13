import { useMemo, useRef } from 'react';
import { useBound } from '../useBound';

interface Props {
  isEnabled?: boolean;
  onChange?(element: HTMLElement, mutations: MutationRecord[]): void;
}

export function useObserver({ isEnabled = true, onChange }: Props = {}) {
  const lastElementRef = useRef<HTMLElement | null>(null);

  const observer = useMemo(() => {
    return new MutationObserver(mutations => {
      const element = lastElementRef.current;
      if (!isEnabled || !element) return;
      onChange?.(element, mutations);
    });
  }, []);

  const enableObserver = () => {
    const element = lastElementRef.current;
    if (element == null) return;
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    onChange?.(element, []);
  };

  useMemo(() => {
    if (!isEnabled) observer.disconnect(); else enableObserver();
  }, [isEnabled]);

  const target = useBound((element: HTMLElement | null) => {
    lastElementRef.current = element;
    if (element == null) observer.disconnect(); else enableObserver();
  });

  return {
    target,
  };
}