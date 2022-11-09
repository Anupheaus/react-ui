import { createComponent } from '../Component';
import { ThemesProvider } from '../../theme';
import { InternalText, InternalTextProps, InternalTextTheme } from '../InternalText';
import { TextTheme } from './TextTheme';

interface Props extends InternalTextProps<string> { }

export const Text = createComponent({
  id: 'Text',

  styles: ({ useTheme, createThemeVariant }) => {
    const { definition } = useTheme(TextTheme);
    return {
      variants: {
        internalTextTheme: createThemeVariant(InternalTextTheme, definition),
      },
    };
  },

  render(props: Props, { join, variants }) {
    return (
      <ThemesProvider themes={join(variants.internalTextTheme)}>
        <InternalText
          {...props}
          type={'text'}
          tagName={'text'}
        />
      </ThemesProvider>
    );
  },
});
