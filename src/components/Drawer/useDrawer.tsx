import { useMemo } from 'react';
import { createComponent } from '../Component';
import { useDistributedState } from '../../hooks';
import { useBound } from '../../hooks/useBound';
import type { DrawerProps } from './Drawer';
import { Drawer as DrawerComponent } from './Drawer';

export function useDrawer() {
  const { state, set: changeOpenState } = useDistributedState(() => false);

  const Drawer = useMemo(() => createComponent('Drawer', (props: DrawerProps) => (
    <DrawerComponent {...props} state={state} />
  )), []);

  return {
    openDrawer: useBound(() => changeOpenState(true)),
    closeDrawer: useBound(() => changeOpenState(false)),
    Drawer,
  };
}
