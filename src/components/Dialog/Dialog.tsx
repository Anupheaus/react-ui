import { ReactNode, useMemo } from 'react';
import { Dialog as MuiDialog, DialogTitle, DialogProps as MuiDialogProps } from '@mui/material';
import { createComponent } from '../Component';
import { useBound } from '../../hooks/useBound';
import { DistributedState, useDistributedState } from '../../hooks';
import { Icon, IconType } from '../Icon';
import { Flex } from '../Flex';
import { DialogTheme } from './DialogTheme';
import { Button, IconButtonTheme } from '../Button';
import { Theme, ThemesProvider } from '../../theme';
import { FiX } from 'react-icons/fi';

export type DialogCloseReasons = Parameters<Required<MuiDialogProps>['onClose']>[1];

export interface DialogProps {
  className?: string;
  title?: ReactNode;
  icon?: IconType;
  theme?: typeof DialogTheme;
  hideCloseButton?: boolean;
  closeIcon?: IconType;
  onClose?(reason: DialogCloseReasons): boolean | void;
  children?: ReactNode;
}

interface InternalProps extends DialogProps {
  state: DistributedState<boolean>;
}

export const Dialog = createComponent({
  id: 'Dialog',

  styles: ({ useTheme, createThemeVariant }) => {
    const { definition: { titleBackgroundColor, titleFontSize, titleFontWeight } } = useTheme(DialogTheme);
    return {
      styles: {
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
      },

      variants: {
        iconButtonTheme: createThemeVariant(IconButtonTheme, {
          backgroundColor: 'transparent',
          activeBackgroundColor: 'rgba(0 0 0 / 15%)'
        }) as Theme,
      },
    };
  },

  render({
    className,
    title,
    state,
    icon,
    hideCloseButton = false,
    closeIcon = FiX,
    onClose,
    children = null,
  }: InternalProps, { css, variants, join }) {
    const { getAndObserve: isDialogOpen, set } = useDistributedState(state);
    const handleDialogClose = useBound<Required<MuiDialogProps>['onClose']>((event, reason) => {
      if (onClose?.(reason) === false) return;
      set(false);
    });
    const handleButtonClose = useBound(() => set(false));

    const dialogClasses = useMemo<MuiDialogProps['classes']>(() => ({
      paper: join(css.dialog, className),
    }), [className]);

    return (
      <MuiDialog
        open={isDialogOpen()}
        onClose={handleDialogClose}
        classes={dialogClasses}
      >
        {title != null && (
          <DialogTitle className={css.dialogTitle}>
            <Flex tagName="dialog-header" className={css.dialogHeader} gap={12}>
              {icon != null && <Icon size={'large'}>{icon}</Icon>}
              <Flex tagName="dialog-header-title">{title}</Flex>
              {!hideCloseButton && (
                <ThemesProvider themes={join(variants.iconButtonTheme)}>
                  <Button
                    icon={closeIcon}
                    onClick={handleButtonClose}
                  />
                </ThemesProvider>
              )}
            </Flex>
          </DialogTitle>
        )}
        {children}
      </MuiDialog>
    );
  },
});
