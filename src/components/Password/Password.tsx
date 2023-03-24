import { ReactElement, useMemo, useState } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { createStyles, ThemesProvider } from '../../theme';
import { Button } from '../Button';
import { InternalText, InternalTextProps } from '../InternalText';
import { PasswordTheme } from './PasswordTheme';
import { Icon } from '../Icon';
import { InternalFieldTheme } from '../InternalField';

interface Props extends InternalTextProps<string> {
  endAdornments?: ReactElement[];
}

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const definition = useTheme(PasswordTheme);
  return {
    styles: {},
    variants: {
      internalTextTheme: createThemeVariant(InternalFieldTheme, definition),
    },
  };
});

export const Password = createComponent('Password', ({
  endAdornments: providedButtons,
  ...props
}: Props) => {
  const { variants, join } = useStyles();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleShowPasswordClick = useBound(() => setIsPasswordVisible(!isPasswordVisible));

  const buttons = useMemo<ReactElement[]>(() => [
    <Button
      key="showPassword"
      onClick={handleShowPasswordClick}
    >
      <Icon name={isPasswordVisible ? 'password-hide' : 'password-show'} size="small" />
    </Button>,
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
});
