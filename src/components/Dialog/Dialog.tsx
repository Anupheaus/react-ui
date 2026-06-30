import { createComponent } from '../Component';
import { Window } from '../Windows/Window';
import { createStyles } from '../../theme';
import type { ComponentProps } from 'react';

export interface Props extends Omit<ComponentProps<typeof Window>, 'hideMaximizeButton' | 'hideCloseButton' | 'disableDrag' | 'disableResize' | 'initialPosition'> {
  allowMaximizeButton?: boolean;
  allowCloseButton?: boolean;
  allowDrag?: boolean;
  allowResize?: boolean;
  /** @deprecated No longer has any effect; retained so existing call sites continue to compile. */
  disableBlurBackground?: boolean;
}

const useStyles = createStyles({
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- soft-deprecated prop intentionally consumed here so it is not forwarded on to Window
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
