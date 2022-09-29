import { useMemo } from 'react';
import { createRippleEventHandler } from './createRippleEventHandler';
import { Ripple as RippleComponent, RippleProps } from './Ripple';
import { RippleState } from './RippleModels';
import { useDistributedState } from '../../hooks';
import { pureFC } from '../../anuxComponents';

export function useRipple() {
  const { state, modify } = useDistributedState<RippleState>(() => ({ x: 0, y: 0, isActive: false, useCoords: false }));

  const rippleTarget = createRippleEventHandler(modify);

  const UIRipple = useMemo(() => pureFC<RippleProps>()('UIRipple', props => (
    <RippleComponent {...props} state={state} />
  )), []);

  return {
    rippleTarget,
    UIRipple,
  };
}