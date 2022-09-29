import { ReactNode, useMemo } from 'react';
import { Dialog as MuiDialog, DialogTitle, DialogProps as MuiDialogProps } from '@mui/material';
import { pureFC } from '../../anuxComponents';
import { useBinder, useBound } from '../../hooks/useBound';
import { DistributedState, useDistributedState } from '../../hooks';
import { Icon, IconType } from '../Icon';
import { Flex } from '../Flex';
import { DialogTheme } from './DialogTheme';
import { Button } from '../Button';

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

export const Dialog = pureFC<InternalProps>()('Dialog', DialogTheme, ({ titleBackgroundColor, titleFontSize, titleFontWeight }) => ({
  dialog: {
    borderRadius: 12,
    gap: 20,
    paddingBottom: 14,
  },
  dialogTitle: {
    backgroundColor: titleBackgroundColor,
    padding: '10px 14px',
  },
  dialogHeader: {
    fontSize: titleFontSize,
    fontWeight: titleFontWeight,
  },
}), ({
  className,
  title,
  state,
  icon,
  theme: {
    css,
    icons,
    join,
    ThemedComponent,
  },
  hideCloseButton = false,
  children = null,
}) => {
  const { getAndObserve: isDialogOpen, set } = useDistributedState(state);
  const close = useBound(() => set(false));
  const bind = useBinder();

  const dialogClasses = useMemo<MuiDialogProps['classes']>(() => ({
    paper: join(css.dialog, className),
  }), [className]);

  return (
    <MuiDialog
      open={isDialogOpen()}
      onClose={close}
      classes={dialogClasses}
    >
      {title != null && (
        <DialogTitle className={css.dialogTitle}>
          <Flex tagName="dialog-header" className={css.dialogHeader} gap={12}>
            {icon != null && <Icon size={'large'}>{icon}</Icon>}
            <Flex tagName="dialog-header-title">{title}</Flex>
            {!hideCloseButton && (
              <ThemedComponent
                component={Button}
                themeDefinition={bind(() => ({ backgroundColor: 'transparent', activeBackgroundColor: 'rgba(0 0 0 / 15%)' }))}
                icon={icons.close}
                onClick={close}
              />
            )}
          </Flex>
        </DialogTitle>
      )}
      {children}
    </MuiDialog>
  );
});
