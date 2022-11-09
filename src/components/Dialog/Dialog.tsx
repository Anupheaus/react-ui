import { ReactNode, useMemo } from 'react';
import { Dialog as MuiDialog, DialogTitle, DialogProps as MuiDialogProps } from '@mui/material';
import { createComponent } from '../Component';
import { useBound } from '../../hooks/useBound';
import { DistributedState, useDistributedState } from '../../hooks';
import { Icon, IconType } from '../Icon';
import { Flex } from '../Flex';
import { DialogTheme } from './DialogTheme';
import { Button, ButtonTheme } from '../Button';
import { Theme, ThemesProvider } from '../../theme';
import { FiX } from 'react-icons/fi';

export interface DialogProps {
  className?: string;
  title?: ReactNode;
  icon?: IconType;
  theme?: typeof DialogTheme;
  hideCloseButton?: boolean;
  closeIcon?: IconType;
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
        buttonTheme: createThemeVariant(ButtonTheme, {
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
    children = null,
  }: InternalProps, { css, variants, join }) {
    const { getAndObserve: isDialogOpen, set } = useDistributedState(state);
    const close = useBound(() => set(false));

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
                <ThemesProvider themes={join(variants.buttonTheme)}>
                  <Button
                    icon={closeIcon}
                    onClick={close}
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