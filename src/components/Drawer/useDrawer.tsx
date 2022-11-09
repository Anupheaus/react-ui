import { useMemo } from 'react';
import { createComponent } from '../Component';
import { useDistributedState } from '../../hooks';
import { useBound } from '../../hooks/useBound';
import { Drawer as DrawerComponent, DrawerProps } from './Drawer';

export function useDrawer() {
  const { state, set: changeOpenState } = useDistributedState(() => false);

  const Drawer = useMemo(() => createComponent({
    id: 'Drawer',

    render: (props: DrawerProps) => (
      <DrawerComponent {...props} state={state} />
    ),
  }), []);

  return {
    openDrawer: useBound(() => changeOpenState(true)),
    closeDrawer: useBound(() => changeOpenState(false)),
    Drawer,
  };
}
