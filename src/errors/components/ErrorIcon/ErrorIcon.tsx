import { ComponentProps, useMemo } from 'react';
import { createComponent } from '../../../components/Component';
import type { Icon } from '../../../components/Icon';
import { AnuxError } from '../../types';
import { ErrorTooltip } from '../ErrorTooltip';
import { ErrorIconTheme } from './ErrorIconTheme';

interface Props extends Omit<ComponentProps<typeof Icon>, 'name'> {
  error: AnuxError;
}

export const ErrorIcon = createComponent({
  id: 'ErrorIcon',

  styles: ({ useTheme }) => {
    const { iconColor } = useTheme(ErrorIconTheme);
    return {
      styles: {
        icon: {
          color: iconColor,
        },
      },
    };
  },

  render({
    error,
    ...props
  }: Props, { css, join }) {
    const IconComponent = useMemo(() => require('../../../components/Icon').Icon as typeof Icon, []);
    return (
      <ErrorTooltip error={error}>
        <IconComponent {...props} name={'error'} className={join(props.className, css.icon)} />
      </ErrorTooltip>
    );
  },
});
