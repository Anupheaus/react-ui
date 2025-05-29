import { useLayoutEffect, useMemo, useRef } from 'react';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';


interface UseDOMChangeProps {
  isEnabled?: boolean;
  onChange?: (mutations: MutationRecord[], element: HTMLElement) => void;
}

export function useOnDOMChange({ isEnabled = true, onChange }: UseDOMChangeProps = {}) {
  const elementRef = useRef<HTMLElement | null>(null);

  const handleMutations = useBound((mutations: MutationRecord[]) => {
    if (!isEnabled || isUnmounted() || elementRef.current == null) return;
    onChange?.(mutations, elementRef.current);
  });
  const observerRef = useRef<MutationObserver>(useMemo(() => new MutationObserver(handleMutations), []));
  const isUnmounted = useOnUnmount(() => observerRef.current.disconnect());

  const target = useBound((element: HTMLElement | null) => {
    elementRef.current = element;
    observerRef.current.disconnect();
    if (element) observerRef.current.observe(element, { childList: true, subtree: true, attributes: true, characterData: true });
  });

  useLayoutEffect(() => {
    if (isEnabled) return;
    observerRef.current.disconnect();
  }, [isEnabled]);

  return target;
}