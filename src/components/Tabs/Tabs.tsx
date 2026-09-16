import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { DistributedState } from '../../hooks';
import { useBound, useDistributedState } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Tag } from '../Tag';
import type { TabsContextProps, UpsertTabProps } from './TabsContext';
import { TabsContext } from './TabsContext';
import { TabButton, TabContent } from './Tab';
import { UIState } from '../../providers';

const useStyles = createStyles(({ tabs: { buttons } = {}, buttons: { default: { normal: { backgroundColor: activeButtonBackgroundColor } } } }) => {
  const stripColor = buttons?.stripColor ?? activeButtonBackgroundColor ?? 'rgba(0 0 0 / 5%)';
  const stripWidth = buttons?.stripWidth ?? 1;

  return {
    hidden: {
      display: 'none',
    },
    tabsButtons: {
      position: 'relative',
      borderBottomStyle: 'solid',
      borderBottomWidth: stripWidth,
      borderBottomColor: stripColor,

      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
      },

      '&.is-hidden': {
        display: 'none',
      },
    },
    tabsButtonsVertical: {
      position: 'relative',
      borderRightStyle: 'solid',
      borderRightWidth: stripWidth,
      borderRightColor: stripColor,

      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
      },

      '&.is-hidden': {
        display: 'none',
      },
    },
    // Navigation variant: a mobile-style nav bar. Horizontal sits at the bottom with a top divider;
    // buttons are stretched to equal widths via `flex: 1` on each TabButton (see TabButton nav styles).
    tabsButtonsNav: {
      position: 'relative',
      borderTopStyle: 'solid',
      borderTopWidth: stripWidth,
      borderTopColor: stripColor,

      '&.is-hidden': {
        display: 'none',
      },
    },
    tabsContent: {
      display: 'grid',
      position: 'relative',
      gridTemplateColumns: '1fr',
      flexGrow: 1,
      overflow: 'hidden',
    },
  };
});

export type TabsVariant = 'tabs' | 'navigation';

export interface TabsProps {
  className?: string;
  children: ReactNode;
  alwaysShowTabs?: boolean;
  orientation?: 'horizontal' | 'vertical';
  /**
   * `'tabs'` (default) renders a standard tab strip above (or, when vertical, beside) the content.
   * `'navigation'` renders a mobile-style nav bar — icon-over-label buttons of equal width, at the
   * bottom for a horizontal orientation or as a left rail for a vertical one.
   */
  variant?: TabsVariant;
  onChange?(index: number): void;
}

interface Props extends TabsProps {
  state: DistributedState<number>;
}

export const TabsComponent = createComponent('Tabs', ({
  className,
  state,
  alwaysShowTabs = false,
  orientation = 'horizontal',
  variant = 'tabs',
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

  const renderedTabButtons = useMemo(() => tabs.map(({ id, label, icon, testId }, index) => (
    <TabButton key={id} tabIndex={index} state={state} label={label} icon={icon} testId={testId} orientation={orientation} variant={variant} />
  )), [tabs, orientation, variant]);

  const renderedTabs = useMemo(() => tabs.map(({ id, className: tabContentClassName, children: tabContent, noPadding, disableScroller, contentProps }, index) => (
    <TabContent
      key={id}
      className={tabContentClassName}
      tabIndex={index}
      state={state}
      noPadding={noPadding}
      disableScroller={disableScroller}
      contentProps={contentProps}
      orientation={orientation}
    >{tabContent}</TabContent>
  )), [tabs, orientation]);

  // Navigation + horizontal renders as a bottom nav bar (strip after the content).
  const isBottomNav = variant === 'navigation' && orientation !== 'vertical';
  const buttonsClassName = variant === 'navigation'
    ? (orientation === 'vertical' ? css.tabsButtonsVertical : css.tabsButtonsNav)
    : (orientation === 'vertical' ? css.tabsButtonsVertical : css.tabsButtons);

  const buttonsStrip = (
    <Flex tagName="tabs-buttons" isVertical={orientation === 'vertical'} disableGrow className={join(buttonsClassName, isTabsHidden && 'is-hidden')}>
      <UIState isReadOnly={false}>
        {renderedTabButtons}
      </UIState>
    </Flex>
  );

  const contentTag = (
    <Tag name="tabs-content" className={css.tabsContent}>
      {renderedTabs}
    </Tag>
  );

  return (
    <Flex tagName="tabs" isVertical={orientation !== 'vertical'} className={className} maxHeight>
      <Tag name="hidden" className={css.hidden}>
        <TabsContext.Provider value={context}>
          {children}
        </TabsContext.Provider>
      </Tag>
      {isBottomNav
        ? <>{contentTag}{buttonsStrip}</>
        : <>{buttonsStrip}{contentTag}</>}
    </Flex>
  );
});