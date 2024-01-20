import { ReactElement, useMemo, useState } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { Button } from '../Button';
import { InternalText, InternalTextProps } from '../InternalText';
import { Icon } from '../Icon';

interface Props extends InternalTextProps<string> {
  endAdornments?: ReactElement[];
}

export const Password = createComponent('Password', ({
  endAdornments: providedButtons,
  ...props
}: Props) => {
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
    <InternalText
      {...props}
      tagName={'password'}
      type={isPasswordVisible ? 'text' : 'password'}
      endAdornments={buttons}
    />
  );
});
