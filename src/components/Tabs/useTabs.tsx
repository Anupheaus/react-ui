import { useMemo } from 'react';
import { useBound, useDistributedState } from '../../hooks';
import { createComponent } from '../Component';
import { TabComponent, TabProps } from './Tab';
import { TabsProps, TabsComponent } from './Tabs';

export function useTabs() {
  const { state, set } = useDistributedState(() => 0);

  const selectTab = useBound((index: number) => set(index));

  const Tabs = useMemo(() => createComponent('Tabs', (props: TabsProps) => (<TabsComponent {...props} state={state} />)), []);
  const Tab = useMemo(() => createComponent('Tab', (props: TabProps) => (<TabComponent {...props} state={state} />)), []);

  return {
    Tabs,
    Tab,
    selectTab,
  };
}