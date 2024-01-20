import { ArgTypes, Meta } from '@storybook/react';
import { FunctionComponent, ReactNode, useMemo } from 'react';
import { AnyObject, Event, MapOf, PromiseMaybe } from '@anupheaus/common';
import { within, userEvent } from '@storybook/testing-library';
import { StorybookContext, StorybookContextProps } from './StorybookContext';
import { StorybookComponent } from './StorybookComponent';
import { Typography } from '@mui/material';
import { TestHookOnRenderProps } from './StorybookModels';
import { createRootThemeProvider } from '../theme/createRootThemeProvider';
import { createComponent } from '../components/Component';
import { createLegacyStyles } from '../theme';

const localModule = global.module as undefined | (NodeModule & { hot: { accept: () => void; addStatusHandler: (handler: (status: string) => void) => void; }; });
if (localModule?.hot) {
  localModule.hot.accept(); // already had this init code 

  localModule.hot.addStatusHandler(status => {
    // eslint-disable-next-line no-console
    if (status === 'check') console.clear();
  });
}

const RootThemeProvider = createRootThemeProvider({
  globalStyles: {
    '@font-face': {
      fontFamily: 'Mulish',
      src: 'url(/font/Mulish-Regular.ttf)',
    },
    'html, body': {
      height: '100%',
      padding: 0,
      margin: 0,
      fontFamily: 'Mulish',
      fontSize: 16,
      overflow: 'hidden',
      userSelect: 'none',
    },
    'input, button': {
      color: 'unset',
      cursor: 'unset',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      fontFamily: 'inherit',
      backgroundColor: 'inherit',
    },
    'div#root': {
      height: '100%',
      overflow: 'auto',
    },
  },
});

interface Props {
  isTestBorderVisible?: boolean;
}

function isStoryConfig(value: unknown): value is StoryConfig {
  return typeof value === 'object' && value !== null && 'component' in value;
}

function addAdditionalHelpers(element: HTMLElement, hookExecutor: (delegate: (renderCount: number) => void) => void) {
  const getByAttribute = (name: string, value: string) => {
    const result = element.querySelector(`[${name}*="${value}"]`);
    if (!result) throw new Error(`Unable to find an element for this test that contains an attribute named "${name}" and contains "${value}" in the value.`);
    return result;
  };

  async function testHook<T>(delegate: (renderCount: number) => T) {
    const results = new Set<T>();
    const onRender = Event.create<(props: TestHookOnRenderProps<T>) => void>({ raisePreviousEventsOnNewSubscribers: true });
    hookExecutor(renderCount => {
      results.add(JSON.parse(JSON.stringify(delegate(renderCount))));
      Event.raise(onRender, { results, renderCount });
    });
    return {
      results,
      onRender,
    };
  }

  return {
    getByAttribute,
    testHook,
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

function walkThroughTheStories<T extends {} = {}>(path: PropertyKey[], stories: StoriesConfig<T>['stories'], module: AnyObject) {
  Reflect.ownKeys(stories).forEach(key => {
    const value = Reflect.get(stories, key) as Stories[0];
    if (value == null) return;
    let InternalComponent: FunctionComponent | undefined;
    const storyName = path.concat(key).join('.');
    const storyId = path.concat(key).join('.');
    let notes: ReactNode = null;
    let title: ReactNode = path.concat(key).join(' ');
    let test: StoryConfig<T>['test'] | undefined;
    let width: string | number | undefined;
    let height: string | number | undefined;
    let delaySnapshot: number | undefined;
    let diffThreshold: number | undefined;
    let wrapInStorybookComponent = true;
    let hookExecutor: (delegate: (renderCount: number) => void) => void = () => void 0;

    if (typeof value === 'function') {
      InternalComponent = value as FunctionComponent;
      (value as any).storyName = storyName;
    } else if (isStoryConfig(value)) {
      InternalComponent = value.component as FunctionComponent;
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
      const useStyles = createLegacyStyles(() => ({
        styles: {
          stories: {
            display: 'flex',
            flex: 'auto',
            flexDirection: 'column',
            gap: 12,
            paddingBottom: 16,
          },
        },
      }));

      const Component = createComponent('StorybookComponent', ({
        isTestBorderVisible = true,
        ...props
      }: Props) => {
        const { css } = useStyles();
        const context = useMemo<StorybookContextProps>(() => ({
          isTestBorderVisible,
          registerHookExecutor: executor => { hookExecutor = executor; },
        }), [isTestBorderVisible]);
        if (InternalComponent == null) return null;
        return (<>
          <RootThemeProvider>
            <StorybookContext.Provider value={context}>
              <div className={css.stories}>
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
          </RootThemeProvider>
        </>);
      });

      /* TH: External Component is output using the no React wrapper (memo or forwardRef) as it seems to have an issue with it when I do. */
      const ExternalComponent = (props: any) => (
        <Component {...props} />
      );
      (ExternalComponent as any).parameters = {
        chromatic: {
          delay: delaySnapshot,
          diffThreshold: diffThreshold ?? 0.08,
        },
      };
      (ExternalComponent as any).storyName = path.concat(key).join(' ');
      module.exports[storyId] = ExternalComponent;
      if (test != null) {
        (ExternalComponent as any).play = async ({ canvasElement }: { canvasElement: HTMLElement; }) => {
          await test?.({ ...within(canvasElement), ...userEvent, ...addAdditionalHelpers(canvasElement, hookExecutor) });
        };
      }
    }
  });
}

interface StoryHelpers<TProps extends {} = {}> {
  createStory<T extends StoryConfig<TProps>>(config: T): T;
}
export function createStories<TProps extends {} = {}>(delegate: (helpers: StoryHelpers<TProps>) => StoriesConfig<TProps>): Meta;
export function createStories<TProps extends {} = {}>(config: StoriesConfig<TProps>): Meta;
export function createStories<TProps extends {} = {}>(delegateOrConfig: ((helpers: StoryHelpers<TProps>) => StoriesConfig<TProps>) | StoriesConfig<TProps>): Meta {
  const delegate = typeof (delegateOrConfig) === 'function' ? delegateOrConfig : () => delegateOrConfig;

  const { name, stories, props, module } = delegate({ createStory: config => config });
  const component: FunctionComponent = () => null;

  const meta: Meta = {
    title: name,
    component,
    argTypes: {
      ...props,
      isTestBorderVisible: { type: 'boolean', defaultValue: true, name: 'Show Test Borders?' },
    },
  };

  walkThroughTheStories([], stories, module);

  return meta;
}
/*
const meta: Meta<typeof Digits> = {
  component: Digits,
  argTypes: {
    onChange: {
      action: 'onChange',
      type: 'function',
      table: {
        disable: true,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Digits>;

export const Default: Story = {
  args: {
    label: 'Digits',
    length: 5,
    value: '123',
  },
  render: props => {
    const [value, setValue] = useUpdatableState<string | undefined>(() => props.value, [props.value]);

    const saveValue = useBound((newValue: string | undefined) => {
      setValue(newValue);
      props.onChange?.(newValue);
    });

    return (
      <Digits {...props} value={value} onChange={saveValue} />
    );
  },
};
*/