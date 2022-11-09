import { useMemo, useState } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { ThemesProvider } from '../../theme';
import { Button } from '../Button';
import { InternalText, InternalTextProps, InternalTextTheme } from '../InternalText';
import { PasswordTheme } from './PasswordTheme';

interface Props extends InternalTextProps {
  theme?: typeof PasswordTheme;
}

export const Password = createComponent({
  id: 'Password',

  styles: ({ useTheme, createThemeVariant }) => {
    const { definition, icons } = useTheme(PasswordTheme);
    return {
      variants: {
        internalTextTheme: createThemeVariant(InternalTextTheme, definition),
      },
      icons,
    };
  },

  render: ({ endAdornments: providedButtons, ...props }: Props, { variants, icons, join }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleShowPasswordClick = useBound(() => setIsPasswordVisible(!isPasswordVisible));

    const buttons = useMemo(() => [
      <Button
        key="showPassword"
        icon={isPasswordVisible ? icons.hidePassword : icons.showPassword}
        onClick={handleShowPasswordClick}
      />,
      ...(providedButtons ?? [])
    ], [providedButtons, isPasswordVisible]);

    return (
      <ThemesProvider themes={join(variants.internalTextTheme)}>
        <InternalText
          {...props}
          tagName={'password'}
          type={isPasswordVisible ? 'text' : 'password'}
          endAdornments={buttons}

        />
      </ThemesProvider>
    );
  },
});
