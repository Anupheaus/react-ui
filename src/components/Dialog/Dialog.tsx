import { createComponent } from '../Component';
import { Window } from '../Windows';
import { createLegacyStyles } from '../../theme';
import type { ComponentProps } from 'react';

export interface Props extends Omit<ComponentProps<typeof Window>, 'hideMaximizeButton' | 'hideCloseButton' | 'disableDrag' | 'disableResize' | 'initialPosition'> {
  allowMaximizeButton?: boolean;
  allowCloseButton?: boolean;
  allowDrag?: boolean;
  allowResize?: boolean;
  disableBlurBackground?: boolean;
}

const useStyles = createLegacyStyles({
  dialogContent: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
});

export const Dialog = createComponent('Dialog', ({
  allowMaximizeButton = false,
  allowCloseButton = false,
  allowDrag = false,
  allowResize = false,
  disableBlurBackground: ignored,
  ...props
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Window
      {...props}
      initialPosition={'center'}
      contentClassName={join(css.dialogContent, props.contentClassName)}
      hideMaximizeButton={!allowMaximizeButton}
      hideCloseButton={!allowCloseButton}
      disableDrag={!allowDrag}
      disableResize={!allowResize}
    />
  );

});
