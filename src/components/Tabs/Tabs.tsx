import { ReactNode, useMemo, useState } from 'react';
import { DistributedState, useBound } from '../../hooks';
import { createLegacyStyles, ThemesProvider } from '../../theme';
import { ButtonTheme } from '../Button';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Tag } from '../Tag';
import { TabsContext, TabsContextProps, UpsertTabProps } from './TabsContext';
import { TabsTheme } from './TabsTheme';

const useStyles = createLegacyStyles(({ useTheme, createThemeVariant }) => {
  const { backgroundColor, highlightHeight, hightlightColor, inactiveTab } = useTheme(TabsTheme);
  return {
    styles: {
      hidden: {
        display: 'none',
      },
      tabsButtons: {
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundColor,
          borderBottomColor: hightlightColor,
          borderBottomStyle: 'solid',
          borderBottomWidth: highlightHeight,
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
    },
    variants: {
      buttonTheme: createThemeVariant(ButtonTheme, {
        default: {
          backgroundColor: inactiveTab.backgroundColor,
          textColor: inactiveTab.color,
        },
        borderRadius: 0,
      }),
    },
  };
});

export interface TabsProps {
  children: ReactNode;
  alwaysShowTabs?: boolean;
}

interface Props extends TabsProps {
  state: DistributedState<number>;
}

export const TabsComponent = createComponent('Tabs', ({
  alwaysShowTabs = false,
  children,
}: Props) => {
  const { css, variants, join } = useStyles();
  const [tabs, setTabs] = useState<UpsertTabProps[]>([]);

  const isTabsHidden = (tabs.length <= 1 || tabs.every(({ hasLabel }) => !hasLabel)) && !alwaysShowTabs;

  const upsertTab = useBound((props: UpsertTabProps) => setTabs(innerTabs => innerTabs.upsert(props)));

  const context = useMemo<TabsContextProps>(() => ({
    isValid: true,
    upsertTab,
  }), []);

  const renderedTabButtons = useMemo(() => tabs.map(({ id, Button }, index) => (
    <Button key={id} tabIndex={index} />
  )), [tabs]);

  const renderedTabs = useMemo(() => tabs.map(({ id, Content }, index) => (
    <Content key={id} tabIndex={index} />
  )), [tabs]);

  return (
    <Flex tagName="tabs" isVertical>
      <Tag name="hidden" className={css.hidden}>
        <TabsContext.Provider value={context}>
          {children}
        </TabsContext.Provider>
      </Tag>
      <Flex tagName="tabs-buttons" disableGrow className={join(css.tabsButtons, isTabsHidden && css.tabsButtonsHidden)}>
        <ThemesProvider themes={join(variants.buttonTheme)}>
          {renderedTabButtons}
        </ThemesProvider>
      </Flex>
      <Tag name="tabs-content" className={css.tabsContent}>
        {renderedTabs}
      </Tag>
    </Flex>
  );
});