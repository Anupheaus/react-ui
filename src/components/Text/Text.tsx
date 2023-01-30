import { createComponent } from '../Component';
import { createStyles, ThemesProvider } from '../../theme';
import { InternalText, InternalTextProps, InternalTextTheme } from '../InternalText';
import { TextTheme } from './TextTheme';

interface Props extends InternalTextProps<string> { }

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const definition = useTheme(TextTheme);
  return {
    variants: {
      internalTextTheme: createThemeVariant(InternalTextTheme, definition),
    },
  };
});

export const Text = createComponent('Text', (props: Props) => {
  const { join, variants } = useStyles();
  return (
    <ThemesProvider themes={join(variants.internalTextTheme)}>
      <InternalText
        {...props}
        type={'text'}
        tagName={'text'}
      />
    </ThemesProvider>
  );
});
