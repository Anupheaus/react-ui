import { ComponentProps, useMemo } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { useBound } from '../useBound';
import { useDistributedState } from '../DistributedState';
import { DistributedDrawerState } from './DistributedDrawerState';
import { Drawer as DrawerComponent } from './Drawer';

export function useDrawer() {
  const { State, set: changeOpenState } = useDistributedState(DistributedDrawerState, () => false);

  const Drawer = useMemo(() => anuxPureFC<ComponentProps<typeof DrawerComponent>>('Drawer', props => (
    <State><DrawerComponent {...props} /></State>
  )), []);

  return {
    openDrawer: useBound(() => changeOpenState(true)),
    closeDrawer: useBound(() => changeOpenState(false)),
    Drawer,
  };
}
