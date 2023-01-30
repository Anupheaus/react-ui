import { ReactNode, useMemo, useState } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { createStyles, ThemesProvider } from '../../theme';
import { Button } from '../Button';
import { InternalText, InternalTextProps, InternalTextTheme } from '../InternalText';
import { PasswordTheme } from './PasswordTheme';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface Props extends InternalTextProps {
  passwordShowIcon?: ReactNode;
  passwordHideIcon?: ReactNode;
}

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const definition = useTheme(PasswordTheme);
  return {
    styles: {},
    variants: {
      internalTextTheme: createThemeVariant(InternalTextTheme, definition),
    },
  };
});

export const Password = createComponent('Password', ({
  endAdornments: providedButtons,
  passwordHideIcon = <FiEyeOff />,
  passwordShowIcon = <FiEye />,
  ...props
}: Props) => {
  const { variants, join } = useStyles();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleShowPasswordClick = useBound(() => setIsPasswordVisible(!isPasswordVisible));

  const buttons = useMemo(() => [
    <Button
      key="showPassword"
      icon={isPasswordVisible ? passwordHideIcon : passwordShowIcon}
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
});
