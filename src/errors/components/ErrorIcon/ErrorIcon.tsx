import { createStyles } from '../../../theme';
import type { ComponentProps} from 'react';
import { useMemo } from 'react';
import { createComponent } from '../../../components/Component';
import type { Icon } from '../../../components/Icon';
import { ErrorTooltip } from '../ErrorTooltip';
import type { Error } from '@anupheaus/common';

interface Props extends Omit<ComponentProps<typeof Icon>, 'name'> {
  error: Error;
}

const useStyles = createStyles(({ errorIcon }) => ({
  icon: {
    color: errorIcon.iconColor,
  },
}));

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
