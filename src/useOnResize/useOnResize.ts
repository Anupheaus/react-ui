import { ISize } from 'anux-common';
import { HTMLTargetDelegate, useSingleDOMRef } from '../useDOMRef';
import { useRef } from 'react';

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
  onVisible?(size: ISize, prevSize: ISize): void;
  onFull?(size: ISize, prevSize: ISize): void;
}

interface IPrevSizes {
  prevVisible: ISize;
  prevFull: ISize;
}

interface IConnectionRef {
  connect(): void;
  disconnect(): void;
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

export function useOnResize({ isDisabled = false, onFull, onVisible }: IUseOnResizeConfig): HTMLTargetDelegate {
  const observedNodesRef = useRef<HTMLElement[]>([]);
  const mutationObserverRef = useRef<MutationObserver>();
  const prevSizeRef = useRef<IPrevSizes>({ prevVisible: undefined, prevFull: undefined });
  const connectionRef = useRef<IConnectionRef>({ connect: () => void 0, disconnect: () => void 0 });

  const createResizeCallbackFor = (element: HTMLElement) => () => {
    const { visible, full } = getSizesFor(element);
    let { prevVisible, prevFull } = prevSizeRef.current;
    if (!areEqual(visible, prevVisible)) { onVisible(visible, prevVisible || visible); prevVisible = visible; }
    if (!areEqual(full, prevFull)) { onFull(full, prevFull || full); prevFull = full; }
    prevSizeRef.current = { prevVisible, prevFull };
  };

  const connected = (element: HTMLElement) => {
    connectionRef.current = { disconnect: () => disconnected(element), connect: () => void 0 };
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
    resizeCallback();
  };

  const disconnected = (element: HTMLElement) => {
    connectionRef.current = { connect: () => connected(element), disconnect: () => void 0 };
    if (resizeObserver) { resizeObserver.unobserve(element); observedNodesRef.current.forEach(resizeObserver.unobserve); }
    observedNodesRef.current = [];
    mutationObserverRef.current.disconnect();
    delete element['resizeCallback'];
  };

  if (isDisabled) { connectionRef.current.disconnect(); } else { connectionRef.current.connect(); }

  return useSingleDOMRef({
    connected,
    disconnected,
  });
}
