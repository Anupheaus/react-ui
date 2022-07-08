import { ArgTypes } from '@storybook/react';
import { FunctionComponent, ReactNode, useMemo } from 'react';
import { theme } from '../theme';
import { AnyObject, MapOf, PromiseMaybe } from 'anux-common';
import { within, userEvent } from '@storybook/testing-library';
import { StorybookContext, StorybookContextProps } from './StorybookContext';
import { StorybookComponent } from './StorybookComponent';
import { ThemeProvider, Typography } from '@mui/material';
import { AnuxFC } from '../anuxComponents';

const useStyles = theme.createStyles({
  '@global': {
    'html, body': {
      height: '100%',
      padding: 0,
      margin: 0,
      fontFamily: 'Mulish',
      fontSize: 16,
    },
    'div#root': {
      height: '100%',
    },
  },
  stories: {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    gap: 12,
  },
});

function setupFont() {
  for (const item of Array.from(document.head.children)) {
    if (item instanceof HTMLLinkElement && item.href.includes('Mulish')) return;
  }
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css?family=Mulish:300,400,500,600,700&display=swap';
  link.rel = 'stylesheet';
  document.head.append(link);
}

function isStoryConfig(value: unknown): value is StoryConfig {
  return typeof value === 'object' && value !== null && 'component' in value;
}

function addAdditionalHelpers(element: HTMLElement) {
  const getByAttribute = (name: string, value: string) => {
    const result = element.querySelector(`[${name}*="${value}"]`);
    if (!result) throw new Error(`Unable to find an element for this test that contains an attribute named "${name}" and contains "${value}" in the value.`);
    return result;
  };
  return {
    getByAttribute,
  };
}

class TestClassProps { public get Within() { return within(null as unknown as HTMLElement); } }
type TestProps = TestClassProps['Within'] & typeof userEvent & ReturnType<typeof addAdditionalHelpers>;

export interface StoryConfig<TProps extends {} = {}> {
  title?: ReactNode;
  component: FunctionComponent<TProps>;
  test?(props: TestProps): PromiseMaybe<void>;
  notes?: ReactNode;
  width?: string | number;
  height?: string | number;
  wrapInStorybookComponent?: boolean;
  chromatic?: {
    delaySnapshot?: number;
    diffThreshold?: number;
  };
}

export type Stories<TProps extends {} = {}> = MapOf<StoryConfig<TProps> | Stories<TProps> | FunctionComponent<TProps>>;

interface StoriesConfig<TProps extends {} = {}> {
  name: string;
  props?: ArgTypes<TProps>;
  stories: Stories<TProps>;
  module: AnyObject;
}

function walkThroughTheStories<T extends {}>(path: PropertyKey[], stories: StoriesConfig<T>['stories'], module: AnyObject) {
  Reflect.ownKeys(stories).forEach(key => {
    const value = Reflect.get(stories, key) as Stories[0];
    if (value == null) return;
    let InternalComponent: AnuxFC<T> | undefined;
    const storyName = path.concat(key).join('.');
    const storyId = Object.hash({ path: path.concat(key).join('.') });
    let notes: ReactNode = null;
    let title: ReactNode = path.concat(key).join(' ');
    let test: StoryConfig<T>['test'] | undefined;
    let width: string | number | undefined;
    let height: string | number | undefined;
    let delaySnapshot: number | undefined;
    let diffThreshold: number | undefined;
    let wrapInStorybookComponent = true;
    if (typeof value === 'function') {
      InternalComponent = value as unknown as AnuxFC<T>;
      (value as any).storyName = storyName;
    } else if (isStoryConfig(value)) {
      InternalComponent = value.component as unknown as AnuxFC<T>;
      notes = value.notes;
      title = value.title ?? title;
      width = value.width;
      height = value.height;
      diffThreshold = value.chromatic?.diffThreshold;
      test = value.test ?? undefined;
      delaySnapshot = value?.chromatic?.delaySnapshot;
      wrapInStorybookComponent = value.wrapInStorybookComponent !== false;
    } else {
      walkThroughTheStories(path.concat(key), value, module);
    }
    if (InternalComponent != null) {
      const Component = ({ isTestBorderVisible, ...props }: any) => {
        const { classes } = useStyles();
        const context = useMemo<StorybookContextProps>(() => ({
          isTestBorderVisible,
        }), [isTestBorderVisible]);
        if (InternalComponent == null) return null;
        return (
          <ThemeProvider theme={theme}>
            <StorybookContext.Provider value={context}>
              <div className={classes.stories}>
                {(() => {
                  if (!wrapInStorybookComponent) {
                    return (<>
                      <Typography variant="h4">{title}</Typography>
                      <InternalComponent {...props} />
                    </>);
                  } else {
                    return (
                      <StorybookComponent title={title} notes={notes} width={width} height={height}>
                        <InternalComponent {...props} />
                      </StorybookComponent>
                    );
                  }
                })()}
              </div>
            </StorybookContext.Provider>
          </ThemeProvider>
        );
      };
      (Component as any).parameters = {
        chromatic: {
          delay: delaySnapshot,
          diffThreshold: diffThreshold ?? 0.08,
        },
      };
      (Component as any).storyName = path.concat(key).join(' ');
      module.exports[storyId] = Component;
      if (test != null) {
        (Component as any).play = async ({ canvasElement }: { canvasElement: HTMLElement; }) => {
          await test?.({ ...within(canvasElement), ...userEvent, ...addAdditionalHelpers(canvasElement) });
        };
      }
    }
  });
}

interface StoryHelpers<TProps extends {} = {}> {
  createStory<T extends StoryConfig<TProps>>(config: T): T;
}
export function createStories<TProps extends {} = {}>(delegate: (helpers: StoryHelpers<TProps>) => StoriesConfig<TProps>): void;
export function createStories<TProps extends {} = {}>(config: StoriesConfig<TProps>): void;
export function createStories<TProps extends {} = {}>(delegateOrConfig: ((helpers: StoryHelpers<TProps>) => StoriesConfig<TProps>) | StoriesConfig<TProps>): void {
  const delegate = typeof (delegateOrConfig) === 'function' ? delegateOrConfig : () => delegateOrConfig;
  const { name, stories, props, module } = delegate({
    createStory: config => config,
  });
  const component: FunctionComponent = () => null;

  setupFont();

  module.exports.default = {
    title: name,
    component,
    argTypes: {
      ...props,
      isTestBorderVisible: { type: 'boolean', defaultValue: true, name: 'Show Test Borders?' },
    },
  };

  walkThroughTheStories([], stories, module);
}
