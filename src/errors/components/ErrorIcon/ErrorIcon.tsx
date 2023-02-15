import { createStyles } from '../../../theme/createStyles';
import { ComponentProps, useMemo } from 'react';
import { createComponent } from '../../../components/Component';
import type { Icon } from '../../../components/Icon';
import { ErrorTooltip } from '../ErrorTooltip';
import { ErrorIconTheme } from './ErrorIconTheme';
import { Error } from '@anupheaus/common';

interface Props extends Omit<ComponentProps<typeof Icon>, 'name'> {
  error: Error;
}

const useStyles = createStyles(({ useTheme }) => {
  const { iconColor } = useTheme(ErrorIconTheme);
  return {
    styles: {
      icon: {
        color: iconColor,
      },
    },
  };
});

export const ErrorIcon = createComponent('ErrorIcon', ({
  error,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const IconComponent = useMemo(() => require('../../../components/Icon').Icon as typeof Icon, []);
  return (
    <ErrorTooltip error={error}>
      <IconComponent {...props} name={'error'} className={join(props.className, css.icon)} />
    </ErrorTooltip>
  );
});
