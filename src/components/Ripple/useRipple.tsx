import { useMemo } from 'react';
import { createRippleEventHandler } from './createRippleEventHandler';
import { Ripple as RippleComponent } from './Ripple';
import { RippleState } from './RippleModels';
import { useDistributedState } from '../../hooks';
import { createComponent } from '../Component';

export function useRipple() {
  const { state, modify } = useDistributedState<RippleState>(() => ({ x: 0, y: 0, isActive: false, useCoords: false }));

  const rippleTarget = createRippleEventHandler(modify);

  const UIRipple = useMemo(() => createComponent({
    id: 'UIRipple',
    render: props => (<RippleComponent {...props} state={state} />),
  }), []);

  return {
    rippleTarget,
    UIRipple,
  };
}