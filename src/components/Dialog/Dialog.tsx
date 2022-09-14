import { ReactNode, useMemo } from 'react';
import { Dialog as MuiDialog, DialogTitle, DialogProps as MuiDialogProps } from '@mui/material';
import { anuxPureFC } from '../../anuxComponents';
import { useBound } from '../../hooks/useBound';
import { DistributedState, useDistributedState } from '../../hooks';
import { Icon, IconType } from '../Icon';
import { Flex } from '../Flex';
import { Theme } from '../../providers/ThemeProvider';
import { DialogTheme } from './DialogTheme';
import { Button } from '../Button';
import { ButtonTheme } from '../Button/ButtonTheme';

export interface DialogProps {
  className?: string;
  title?: ReactNode;
  icon?: IconType;
  theme?: typeof DialogTheme;
  hideCloseButton?: boolean;
}

interface InternalProps extends DialogProps {
  state: DistributedState<boolean>;
}

export const Dialog = anuxPureFC<InternalProps>('Dialog', ({
  className,
  title,
  state,
  icon,
  theme,
  hideCloseButton = false,
  children = null,
}) => {
  const { classes, icons, join } = useTheme(theme);
  const { getAndObserve: isDialogOpen, set } = useDistributedState(state);
  const close = useBound(() => set(false));

  const dialogClasses = useMemo<MuiDialogProps['classes']>(() => ({
    paper: join(classes.dialog, className),
  }), [className]);

  return (
    <MuiDialog
      open={isDialogOpen()}
      onClose={close}
      classes={dialogClasses}
      className={classes.theme}
    >
      {title != null && (
        <DialogTitle className={classes.dialogTitle}>
          <Flex tagName="dialog-header" className={classes.dialogHeader} gap={12}>
            {icon != null && <Icon size={'large'}>{icon}</Icon>}
            <Flex tagName="dialog-header-title">{title}</Flex>
            {!hideCloseButton && <Button className={classes.closeButton} icon={icons.close} onClick={close} />}
          </Flex>
        </DialogTitle>
      )}
      {children}
    </MuiDialog>
  );
});

const useTheme = Theme.createThemeUsing(DialogTheme, styles => ({
  dialog: {
    borderRadius: 12,
    gap: 20,
    paddingBottom: 14,
  },
  dialogTitle: {
    backgroundColor: styles.titleBackgroundColor,
    padding: '10px 14px',
  },
  closeButton: {
    ...Theme.createInlineStylesVersionOf(ButtonTheme, {
      backgroundColor: styles.titleBackgroundColor,
      activeBackgroundColor: 'rgba(0 0 0 / 10%)',
    }),
  },
  dialogHeader: {
    fontSize: styles.titleFontSize,
    fontWeight: styles.titleFontWeight,
  },
}));
