import { ReactNode, useMemo, useState } from 'react';
import { DistributedState, useBound, useDistributedState } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Tag } from '../Tag';
import { TabsContext, TabsContextProps, UpsertTabProps } from './TabsContext';
import { TabButton, TabContent } from './Tab';
import { UIState } from '../../providers';

const useStyles = createStyles(({ tabs }) => ({
  hidden: {
    display: 'none',
  },
  tabsButtons: {
    position: 'relative',
    backgroundColor: tabs.buttons.container.backgroundColor,

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
    },
  },
  tabsContent: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    flexGrow: 1,
    overflow: 'hidden',
  },
  tabsButtonsHidden: {
    display: 'none',
  },
}));

export interface TabsProps {
  className?: string;
  children: ReactNode;
  alwaysShowTabs?: boolean;
  onChange?(index: number): void;
}

interface Props extends TabsProps {
  state: DistributedState<number>;
}

export const TabsComponent = createComponent('Tabs', ({
  className,
  state,
  alwaysShowTabs = false,
  children,
  onChange: providedOnChange,
}: Props) => {
  const { css, join } = useStyles();
  const [tabs, setTabs] = useState<UpsertTabProps[]>([]);
  const { onChange } = useDistributedState(state);

  const isTabsHidden = (tabs.length <= 1 || tabs.every(({ label }) => label == null)) && !alwaysShowTabs;

  onChange(index => providedOnChange?.(index));

  const upsertTab = useBound((props: UpsertTabProps) => setTabs(innerTabs => {
    const newTabs = (() => {
      const existingIndex = innerTabs.findIndex(({ id }) => id === props.id);
      if (existingIndex === -1) return innerTabs.concat(props);
      const copyOfTabs = innerTabs.slice();
      copyOfTabs[existingIndex] = props;
      return copyOfTabs;
    })();
    return newTabs.orderBy(tab => tab.ordinalPosition ?? ((newTabs.indexOf(tab) + 1) * 1000));
  }));

  const removeTab = useBound((id: string) => setTabs(innerTabs => innerTabs.removeById(id)));

  const context = useMemo<TabsContextProps>(() => ({
    isValid: true,
    upsertTab,
    removeTab,
  }), []);

  const renderedTabButtons = useMemo(() => tabs.map(({ id, label }, index) => (
    <TabButton key={id} tabIndex={index} state={state} label={label} />
  )), [tabs]);

  const renderedTabs = useMemo(() => tabs.map(({ id, className: tabContentClassName, children: tabContent }, index) => (
    <TabContent key={id} className={tabContentClassName} tabIndex={index} state={state}>{tabContent}</TabContent>
  )), [tabs]);

  return (
    <Flex tagName="tabs" isVertical className={className}>
      <Tag name="hidden" className={css.hidden}>
        <TabsContext.Provider value={context}>
          {children}
        </TabsContext.Provider>
      </Tag>
      <Flex tagName="tabs-buttons" disableGrow className={join(css.tabsButtons, isTabsHidden && css.tabsButtonsHidden)}>
        <UIState isReadOnly={false}>
          {renderedTabButtons}
        </UIState>
      </Flex>
      <Tag name="tabs-content" className={css.tabsContent}>
        {renderedTabs}
      </Tag>
    </Flex>
  );
});