import { pureFC } from '../anuxComponents';
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

interface ComponentProps {
  className?: string;
  somethingElse?: string;
}

const Component = pureFC<ComponentProps>()('Component', ComponentTheme, ({ backgroundColor, textColor, height, width }) => ({
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
}), ({
  className,
  theme: {
    css,
    join,
  },
}) => {
  return (
    <div className={join(css.component, css.width, css.height, className)}>
      supposed to be blue with white text
    </div>
  );
});

const HigherComponentTheme = createTheme({
  id: 'HigherComponentTheme',
  definition: {
    backgroundColor: '#5353ff',
    color: 'white',
  },
});

interface HigherComponentProps { }

const HigherComponent = pureFC<HigherComponentProps>()('HigherComponent', HigherComponentTheme, ({ backgroundColor }) => ({
  component: {
    backgroundColor,
  },
}), ({
  theme: {
    ThemedComponent,
  },
}) => {
  return (
    <ThemedComponent component={Component} themeDefinition={({ backgroundColor, color }) => ({ backgroundColor, textColor: color })} />
  );
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
