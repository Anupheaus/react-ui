import { ISize, IGeometry } from 'anux-common';
import { IUseDragAndResizeResult, IAdjustment, IDragAndResizeConfig } from './models';
import { HTMLTargetDelegate } from '../useDOMRef';
import { useOnResize } from '../useOnResize';
import { useBound } from '../useBound';
import { applyMoveExtentsToAdjustment, createDragTarget, createMoveTarget } from './moving';
import { useOnUnmount } from '../useOnUnmount';
import { createResizeTarget } from './resizing';
import { useStaticState, SetStaticState } from '../useStaticState';

export type SetState = SetStaticState<IDragAndResizeState>;

function applyDefaults(config: IDragAndResizeConfig): IDragAndResizeConfig {
  return {
    disableMove: false,
    disableResize: false,
    ...config,
    geometry: {
      ...config.geometry,
    },
  };
}

function adjustElement(element: HTMLElement, adjustment: IAdjustment): void {
  element.style.position = 'absolute';
  element.style.transform = `translate(${adjustment.x1}px,${adjustment.y1}px)`;
  element.style.width = `${adjustment.width}px`;
  element.style.height = `${adjustment.height}px`;
}

function createContainerResizeTarget(state: IDragAndResizeState, setState: SetState): HTMLTargetDelegate {
  const { config: { disableMove, disableResize } } = state;
  return useOnResize({
    isDisabled: disableResize && disableMove,
    onFull: (_size, _prevSize, element) => {
      const { top, left, width, height } = element.dimensions({ excludingBorder: true, excludingMargin: true, excludingPadding: true });
      setState(s => ({ ...s, maxExtents: { width: width - left, height: height - top } }));
      applyAdjustment({}, setState, false); // apply adjustment to make sure that the window is moved to within the max extent bounds
    },
  });
}

function createElementResizeTarget(state: IDragAndResizeState, setState: SetState) {
  const { config: { disableResize } } = state;
  return useOnResize({
    isDisabled: disableResize,
    onFull: (size, _prevSize, element) => {
      const { x, y } = element.coordinates();
      setState(s => ({ ...s, geometry: { x, y, ...size } }));
      applyAdjustment({}, setState, false);
    },
  });
}

export function applyAdjustment(adjustment: IAdjustment, setState: SetState, isResizing: boolean) {
  // TODO: validate state here
  setState(state => {
    adjustment = isResizing ? null : applyMoveExtentsToAdjustment(adjustment, state);
    adjustElement(state.element, adjustment);

    return {
      ...state,
      geometry: { x: adjustment.x1, y: adjustment.y1, width: adjustment.width, height: adjustment.width },
    };
  });
}

export interface IDragAndResizeState {
  hasInitialised: boolean;
  element: HTMLElement;
  geometry: IGeometry;
  maxExtents: ISize;
  config: IDragAndResizeConfig;
}

export function useDragAndResize(config: IDragAndResizeConfig): IUseDragAndResizeResult {
  config = applyDefaults(config);
  const [state, setState] = useStaticState<IDragAndResizeState>({
    hasInitialised: false,
    element: undefined,
    geometry: {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
    },
    maxExtents: {
      width: undefined,
      height: undefined,
    },
    config: undefined,
  });
  setState({ config: applyDefaults(config) });

  // const maxExtentsRef = useRef<ISize>({ width: undefined, height: undefined });
  // const elementPositionRef = useRef<IGeometry>({ x: undefined, y: undefined, width: undefined, height: undefined });
  // const elementRef = useRef<HTMLElement>();
  // const hasInitialisedRef = useRef<boolean>(false);
  const containerResizeTarget = createContainerResizeTarget(state, setState);
  const elementResizeTarget = createElementResizeTarget(state, setState);
  const { dragTarget, dragClassTarget } = createDragTarget(state, setState);
  const moveTarget = createMoveTarget(state, setState, [elementResizeTarget, containerResizeTarget, dragClassTarget]);
  const resizeTarget = createResizeTarget(state, setState);

  useOnUnmount(() => {
    useBound.disposeOf([moveTarget, dragTarget]);
  });

  return {
    moveTarget,
    dragTarget,
    resizeTarget,
  };
}
