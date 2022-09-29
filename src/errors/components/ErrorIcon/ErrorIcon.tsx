import { useMemo } from 'react';
import type { Icon } from '../../../components/Icon';
import { pureFC } from '../../../anuxComponents';
import { PropsOf } from '../../../extensions';
import { AnuxError } from '../../types';
import { ErrorTooltip } from '../ErrorTooltip';
import { ErrorIconTheme } from './ErrorIconTheme';

interface Props extends Omit<PropsOf<typeof Icon>, 'children'> {
  error: AnuxError;
}

export const ErrorIcon = pureFC<Props>()('ErrorIcon', ErrorIconTheme, ({ iconColor }) => ({
  icon: {
    color: iconColor,
  },
}), ({
  theme: { css, icons, join },
  error,
  ...props
}) => {
  const IconComponent = useMemo(() => require('../../../components/Icon').Icon as typeof Icon, []);
  return (
    <ErrorTooltip error={error}>
      <IconComponent {...props} className={join(props.className, css.icon)}>{icons.error}</IconComponent>
    </ErrorTooltip>
  );
});
