import type { ReactNode } from 'react';
import { useContext, useEffect, useLayoutEffect } from 'react';
import type { DistributedState } from '../../../hooks';
import { useId } from '../../../hooks';
import { createComponent } from '../../Component';
import { TabsContext } from '../TabsContext';
import type { FlexProps } from '../../Flex';

export interface TabProps extends Pick<FlexProps, 'isVertical' | 'alignCentrally' | 'align' | 'valign' | 'gap' | 'padding' | 'testId'> {
  className?: string;
  label?: ReactNode;
  ordinalPosition?: number;
  children: ReactNode;
  testId?: string;
  noPadding?: boolean;
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
  testId,
  noPadding,
  ...contentProps
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
      testId,
      children,
      noPadding,
      contentProps,
    });
  }, [children, label, className]);

  useEffect(() => () => {
    removeTab(id);
  }, []);

  return null;
});
