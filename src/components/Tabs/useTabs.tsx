import { is } from '@anupheaus/common';
import { useMemo } from 'react';
import { useBound, useDistributedState } from '../../hooks';
import { createComponent } from '../Component';
import type { TabProps } from './Tab';
import { TabComponent } from './Tab';
import type { TabsProps } from './Tabs';
import { TabsComponent } from './Tabs';

export function useTabs() {
  const { state, set, get, getAndObserve } = useDistributedState(() => 0);

  const selectTab = useBound((index: number | ((currentIndex: number) => number)) => {
    if (is.number(index)) {
      set(index);
    } else if (is.function(index)) {
      set(index(get()));
    }
  });

  const Tabs = useMemo(() => createComponent('Tabs', (props: TabsProps) => (<TabsComponent {...props} state={state} />)), []);
  const Tab = useMemo(() => createComponent('Tab', (props: TabProps) => (<TabComponent {...props} state={state} />)), []);

  return {
    Tabs,
    Tab,
    selectTab,
    get selectedTabIndex() { return getAndObserve(); },
  };
}