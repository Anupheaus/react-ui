import { ComponentProps, useRef } from 'react';
import { useBound } from '../../hooks/useBound';
import { createRippleEventHandler } from './createRippleEventHandler';
import { Ripple as UIRippleComponent } from './Ripple';
import { RippleState } from './RippleModels';
import { is } from 'anux-common';
import { useCreateHookComponent } from '../../hooks';

export function useRipple() {
  const stateRef = useRef<RippleState>({ x: 0, y: 0, isActive: false, useCoords: false });
  const { createComponent, refreshComponent } = useCreateHookComponent();

  const setState = useBound((delegate: (currentState: RippleState) => RippleState) => {
    const existingState = stateRef.current;
    const newState = delegate(existingState);
    if (is.deepEqual(newState, existingState)) return;
    stateRef.current = newState;
    refreshComponent();
  });

  const rippleTarget = createRippleEventHandler(setState);

  const UIRipple = createComponent<Omit<ComponentProps<typeof UIRippleComponent>, 'state'>>('UIRipple', props => (
    <UIRippleComponent {...props} state={stateRef.current} />
  ));

  return {
    rippleTarget,
    UIRipple,
  };
}