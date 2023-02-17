import { createComponent } from '../Component';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories } from '../../Storybook';
import { InternalText, InternalTextProps } from './InternalText';
import { generateInternalTextStories } from './InternalText.stories.utils';
import { createStyles, ThemesProvider } from '../../theme';
import { InternalTextTheme } from './InternalTextTheme';

const useStyles = createStyles(({ createThemeVariant }) => {
  return {
    variants: {
      internalText: createThemeVariant(InternalTextTheme, {
        backgroundColor: '#efefef',
      }),
    },
  };
});

export const EditableText = createComponent('EditableText', (props: InternalTextProps) => {
  const [value, setValue] = useUpdatableState(() => props.value, [props.value]);
  const { variants, join } = useStyles();

  return (
    <ThemesProvider themes={join(variants.internalText)}>
      <InternalText tagName="text" type="text" width={150} label={'Label'} {...props} value={value} onChange={setValue} />
    </ThemesProvider>
  );
});

createStories(() => ({
  module,
  name: 'Components/Internal Text',
  stories: {
    ...generateUIStateStories(props => <EditableText {...props} />),
    ...generateInternalTextStories(EditableText),
  },
}));
