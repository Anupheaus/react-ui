import { useMemo } from 'react';
import { createRippleEventHandler } from './createRippleEventHandler';
import type { RippleProps } from './Ripple';
import { Ripple as RippleComponent } from './Ripple';
import type { RippleConfig, RippleState } from './RippleModels';
import { useDistributedState } from '../../hooks';
import { createComponent } from '../Component';

export function useRipple() {
  const { state: rippleState, modify: modifyRippleState } = useDistributedState<RippleState>(() => ({ x: 0, y: 0, isActive: false, useCoords: false }));
  const rippleConfig = useDistributedState<RippleConfig>(() => ({ ignoreMouseCoords: false, containerElement: null }));

  const rippleTarget = createRippleEventHandler(modifyRippleState, rippleConfig);

  const Ripple = useMemo(() => createComponent('Ripple', (props: RippleProps) => (<RippleComponent {...props} rippleState={rippleState} rippleConfig={rippleConfig.state} />)), []);

  return {
    rippleTarget,
    Ripple,
  };
}