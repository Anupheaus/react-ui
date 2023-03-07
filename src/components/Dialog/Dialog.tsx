import { ComponentProps } from 'react';
import { createComponent } from '../Component';
import { Window } from '../Windows';
import { createStyles } from '../../theme';
import { useBound } from '../../hooks';

export interface DialogProps extends Omit<ComponentProps<typeof Window>, 'id' | 'hideMaximizeButton' | 'hideCloseButton' | 'disableDrag' | 'disableResize' | 'initialPosition' | 'onClosing' | 'onClosed'> {
  allowMaximizeButton?: boolean;
  allowCloseButton?: boolean;
  allowDrag?: boolean;
  allowResize?: boolean;
  disableBlurBackground?: boolean;
  onClosing?(reason: string): void;
  onClosed?(reason: string): void;
}

interface Props extends DialogProps {
  id: string;
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
  disableBlurBackground: ignored,
  onClosing,
  onClosed,
  ...props
}: Props) => {
  const { css, join } = useStyles();

  const handleClosing = useBound(() => onClosing?.(''));
  const handleClosed = useBound(() => onClosed?.(''));

  return (
    <Window
      {...props}
      initialPosition={'center'}
      contentClassName={join(css.dialogContent, props.contentClassName)}
      hideMaximizeButton={!allowMaximizeButton}
      hideCloseButton={!allowCloseButton}
      disableDrag={!allowDrag}
      disableResize={!allowResize}
      onClosing={handleClosing}
      onClosed={handleClosed}
    />
  );
});
