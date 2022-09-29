import { useMemo, useState } from 'react';
import { pureFC } from '../../anuxComponents';
import { useBound } from '../../hooks';
import { Button } from '../Button';
import { InternalText, InternalTextProps } from '../InternalText';
import { PasswordTheme } from './PasswordTheme';

interface Props extends InternalTextProps {
  theme?: typeof PasswordTheme;
}

export const Password = pureFC<Props>()('Password', PasswordTheme, () => ({}), ({
  endAdornments: providedButtons,
  theme: {
    icons,
    ThemedComponent,
  },
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleShowPasswordClick = useBound(() => setIsPasswordVisible(!isPasswordVisible));

  const buttons = useMemo(() => [
    <ThemedComponent
      key="showPassword"
      component={Button}
      themeDefinition={({ backgroundColor }) => ({ backgroundColor })}
      icon={isPasswordVisible ? icons.hidePassword : icons.showPassword}
      onClick={handleShowPasswordClick}
    />,
    ...(providedButtons ?? [])
  ], [providedButtons, isPasswordVisible]);

  return (
    <InternalText
      {...props}
      tagName={'password'}
      type={isPasswordVisible ? 'text' : 'password'}
      endAdornments={buttons}
    />
  );
});
