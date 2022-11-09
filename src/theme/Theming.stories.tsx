import { ThemesProvider } from '..';
import { createComponent } from '../components/Component';
import { createStories, StorybookComponent } from '../Storybook';
import { createTheme } from './createTheme';

const ComponentTheme = createTheme({
  id: 'ComponentTheme',
  definition: {
    backgroundColor: 'red',
    textColor: 'black',
    width: 200,
    height: 200,
  }
});

interface Props {
  className?: string;
}

const Component = createComponent({
  id: 'Component',

  styles: ({ useTheme }) => {
    const { definition: { backgroundColor, textColor, height, width } } = useTheme(ComponentTheme);
    return {
      styles: {
        component: {
          backgroundColor,
          color: textColor,
        },
        width: {
          width,
        },
        height: {
          height,
        },
      },
    };
  },

  render({
    className,
  }: Props, { css, join }) {
    return (
      <div className={join(css.component, css.width, css.height, className)}>
        supposed to be blue with white text
      </div>
    );
  },
});

const HigherComponentTheme = createTheme({
  id: 'HigherComponentTheme',
  definition: {
    backgroundColor: '#5353ff',
    color: 'white',
  },
});

const HigherComponent = createComponent({
  id: 'HigherComponent',

  styles: ({ useTheme, createThemeVariant }) => {
    const { definition: { backgroundColor, color } } = useTheme(HigherComponentTheme);

    return {
      variants: {
        componentTheme: createThemeVariant(ComponentTheme, {
          backgroundColor,
          textColor: color,
        }),
      },
    };
  },

  render: (_, { variants, join }) => (
    <ThemesProvider themes={join(variants.componentTheme)}>
      <Component />
    </ThemesProvider>
  ),
});

createStories(() => ({
  module,
  name: 'Components/Theming',
  stories: {
    'Playground': {
      wrapInStorybookComponent: false,
      component: () => (<>
        <StorybookComponent title="Test">
          <HigherComponent />
        </StorybookComponent>
      </>),
    }
  },
}));
