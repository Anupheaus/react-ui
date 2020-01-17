import { ISize } from 'anux-common';
import { HTMLTargetDelegate, useSingleDOMRef } from '../useDOMRef';
import { useStaticState } from '../useStaticState';

interface IResizeObserverEntry {
  target: HTMLElement & { parentElement: HTMLElement & { resizeCallback(): void }; resizeCallback(): void };
}

const ResizeObserver = window['ResizeObserver'];
const MutationObserver = window['MutationObserver'];
const resizeObserver = ResizeObserver ? new ResizeObserver((entries: IResizeObserverEntry[]) => entries.forEach(entry => {
  if (!entry || !entry.target) { return; }
  if (entry.target.resizeCallback) { entry.target.resizeCallback(); return; }
  if (!entry.target.parentElement && entry.target.parentElement.resizeCallback) { entry.target.parentElement.resizeCallback(); return; }
})) : null;

interface IConfig {
  isDisabled?: boolean;
  triggerOnInitialise?: boolean;
  onVisible?(size: ISize, prevSize: ISize, element: HTMLElement): void;
  onFull?(size: ISize, prevSize: ISize, element: HTMLElement): void;
}

interface IState {
  target: HTMLElement;
  observedNodes: HTMLElement[];
  mutationObserver: MutationObserver;
  visible: ISize;
  full: ISize;
  config: IConfig;
  update(): void;
}

function applyDefaults(config: IConfig): IConfig {
  return {
    isDisabled: false,
    onFull: () => void 0,
    onVisible: () => void 0,
    triggerOnInitialise: true,
    ...config,
  };
}

function connect(state: IState) {
  let observedNodes: HTMLElement[] = [];
  const { target, config: { triggerOnInitialise }, update } = state;
  target['resizeCallback'] = update;
  if (resizeObserver) {
    resizeObserver.observe(target);
    observedNodes = Array.from(target.children)
      .cast<HTMLElement>()
      .filter(node => node.nodeType === Node.ELEMENT_NODE)
      .concat(target);
    observedNodes.forEach(node => resizeObserver.observe(node));
  }
  const mutationObserver = new MutationObserver(update);
  mutationObserver.observe(target, { childList: true, subtree: true });
  return { ...state, mutationObserver, observedNodes, ...(triggerOnInitialise ? getSizesFor(target) : {}) };
}

function disconnect(state: IState) {
  const { target, observedNodes, mutationObserver } = state;
  if (resizeObserver) {
    resizeObserver.unobserve(target);
    observedNodes.forEach(node => resizeObserver.unobserve(node));
  }
  if (mutationObserver) { mutationObserver.disconnect(); }
  delete target['resizeCallback'];
  return { ...state, mutationObserver: undefined, observedNodes: [] };
}

function configureObservers(state: IState, prevState: IState): IState {
  const { config: { isDisabled }, target } = state;
  const { config: { isDisabled: prevIsDisabled }, target: prevTarget } = prevState;

  if (isDisabled !== prevIsDisabled || target !== prevTarget) {
    if (prevTarget) { state = disconnect(state); }
    if (target && !isDisabled) { state = connect(state); }
  }
  return state;
}

function triggerEvents(state: IState, prevState: IState): IState {
  const { config: { isDisabled, onFull, onVisible, triggerOnInitialise }, full, visible, target } = state;
  const { config: { isDisabled: prevIsDisabled }, full: prevFull, visible: prevVisible, target: prevTarget } = prevState;

  const shouldTriggerEvents = (size: ISize, prevSize: ISize) => (!isDisabled && !areEqual(size, prevSize))
    || (((!isDisabled && prevIsDisabled) || (target && !prevTarget)) && triggerOnInitialise);

  if (shouldTriggerEvents(full, prevFull)) { onFull(full, prevFull, target); }
  if (shouldTriggerEvents(visible, prevVisible)) { onVisible(visible, prevVisible, target); }

  return state;
}

function handleStateUpdate(state: IState, prevState: IState): IState {
  state = configureObservers(state, prevState);
  return triggerEvents(state, prevState);
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

export function useOnResize(config: IConfig): HTMLTargetDelegate {
  config = applyDefaults(config);
  const [state, setState, onStateUpdate] = useStaticState<IState>({
    config,
    full: { width: undefined, height: undefined },
    visible: { width: undefined, height: undefined },
    mutationObserver: undefined,
    observedNodes: [],
    target: undefined,
    update: () => setState({ ...getSizesFor(state.target) }),
  });
  onStateUpdate(handleStateUpdate);
  setState({ config });

  return useSingleDOMRef({
    connected: target => setState({ target }),
    disconnected: () => setState({ target: undefined }),
  });
}
