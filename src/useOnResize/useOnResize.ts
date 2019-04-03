import { ISize } from 'anux-common';
import { HTMLTargetDelegate, useSingleDOMRef } from '../useDOMRef';
import { useRef } from 'react';
import { useToggleState } from '../useToggleState';

interface IResizeObserverEntry {
  target: HTMLElement & { parentElement: HTMLElement & { resizeCallback(): void; }; resizeCallback(): void; };
}

const ResizeObserver = window['ResizeObserver'];
const MutationObserver = window['MutationObserver'];
const resizeObserver = ResizeObserver ? new ResizeObserver((entries: IResizeObserverEntry[]) => entries.forEach(entry => {
  if (!entry || !entry.target) { return; }
  if (entry.target.resizeCallback) { entry.target.resizeCallback(); return; }
  if (!entry.target.parentElement && entry.target.parentElement.resizeCallback) { entry.target.parentElement.resizeCallback(); return; }
})) : null;

interface IUseOnResizeConfig {
  isDisabled?: boolean;
  triggerOnInitialise?: boolean;
  onVisible?(size: ISize, prevSize: ISize, element: HTMLElement): void;
  onFull?(size: ISize, prevSize: ISize, element: HTMLElement): void;
}

interface IPrevSizes {
  prevVisible: ISize;
  prevFull: ISize;
}

function areEqual(current: ISize, previous: ISize): boolean {
  return current.width === (previous ? previous.width : undefined) && current.height === (previous ? previous.height : undefined);
}

function getSizesFor(element: HTMLElement) {
  return {
    full: { width: element.scrollWidth, height: element.scrollHeight },
    visible: { width: element.clientWidth, height: element.clientHeight },
  };
}

export function useOnResize({ isDisabled = false, onFull, onVisible, triggerOnInitialise = true }: IUseOnResizeConfig): HTMLTargetDelegate {
  const observedNodesRef = useRef<HTMLElement[]>([]);
  const mutationObserverRef = useRef<MutationObserver>();
  const prevSizeRef = useRef<IPrevSizes>({ prevVisible: undefined, prevFull: undefined });
  const isEnabledRef = useToggleState(!isDisabled);
  isEnabledRef.current = !isDisabled;

  const createResizeCallbackFor = (element: HTMLElement) => () => {
    const { visible, full } = getSizesFor(element);
    let { prevVisible, prevFull } = prevSizeRef.current;
    if (onVisible && !areEqual(visible, prevVisible)) { onVisible(visible, prevVisible || visible, element); prevVisible = visible; }
    if (onFull && !areEqual(full, prevFull)) { onFull(full, prevFull || full, element); prevFull = full; }
    prevSizeRef.current = { prevVisible, prevFull };
  };

  const connected = (element: HTMLElement) => {
    isEnabledRef.onChange(() => disconnected(element));
    const resizeCallback = createResizeCallbackFor(element);
    element['resizeCallback'] = resizeCallback;
    if (resizeObserver) {
      resizeObserver.observe(element);
      const observedNodes = Array.from(element.children)
        .cast<HTMLElement>()
        .filter(node => node.nodeType === Node.ELEMENT_NODE);
      observedNodes.map(node => resizeObserver.observe(node));
      observedNodesRef.current = observedNodes;
    }
    const mutationObserver = new MutationObserver(resizeCallback);
    mutationObserver.observe(element, { childList: true, subtree: true });
    mutationObserverRef.current = mutationObserver;
    if (triggerOnInitialise) { resizeCallback(); }
  };

  const disconnected = (element: HTMLElement) => {
    isEnabledRef.onChange(() => connected(element));
    if (resizeObserver) {
      resizeObserver.unobserve(element);
      observedNodesRef.current.forEach(node => resizeObserver.unobserve(node));
    }
    observedNodesRef.current = [];
    mutationObserverRef.current.disconnect();
    delete element['resizeCallback'];
  };

  return useSingleDOMRef({
    connected,
    disconnected,
  });
}
