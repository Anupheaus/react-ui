import { ComponentProps, useMemo } from 'react';
import { createComponent } from '../../../components/Component';
import type { Icon } from '../../../components/Icon';
import { AnuxError } from '../../types';
import { ErrorTooltip } from '../ErrorTooltip';
import { ErrorIconTheme } from './ErrorIconTheme';

interface Props extends Omit<ComponentProps<typeof Icon>, 'children'> {
  error: AnuxError;
}

export const ErrorIcon = createComponent({
  id: 'ErrorIcon',

  styles: ({ useTheme }) => {
    const { definition: { iconColor }, icons } = useTheme(ErrorIconTheme);
    return {
      styles: {
        icon: {
          color: iconColor,
        },
      },
      icons,
    };
  },

  render({
    error,
    ...props
  }: Props, { css, join, icons }) {
    const IconComponent = useMemo(() => require('../../../components/Icon').Icon as typeof Icon, []);
    return (
      <ErrorTooltip error={error}>
        <IconComponent {...props} className={join(props.className, css.icon)}>{icons.error}</IconComponent>
      </ErrorTooltip>
    );
  },
});
