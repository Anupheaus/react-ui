import { ReactNode, useContext, useEffect, useLayoutEffect } from 'react';
import { DistributedState, useId } from '../../../hooks';
import { createComponent } from '../../Component';
import { TabsContext } from '../TabsContext';

export interface TabProps {
  className?: string;
  label?: ReactNode;
  ordinalPosition?: number;
  children: ReactNode;
}

export interface TabButtonProps {
  tabIndex: number;
}

export interface TabContentProps {
  tabIndex: number;
}

interface Props extends TabProps {
  state: DistributedState<number>;
}

export const TabComponent = createComponent('Tab', ({
  className,
  label,
  ordinalPosition,
  children,
}: Props) => {
  const id = useId();
  const { isValid, upsertTab, removeTab } = useContext(TabsContext);

  if (!isValid) throw new Error('Tab must be a child of Tabs');

  useLayoutEffect(() => {
    upsertTab({
      id,
      label,
      ordinalPosition,
      className,
      children,
    });
  }, [children, label, className]);

  useEffect(() => () => {
    removeTab(id);
  }, []);

  return null;
});
