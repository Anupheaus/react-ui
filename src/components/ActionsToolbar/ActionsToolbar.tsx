import type { ReactNode } from 'react';
import { useContext } from 'react';
import { ThemeProvider, createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { ConfirmationDialogContext } from '../Dialog/ConfirmationDialogContext';
import { useBound } from '../../hooks/useBound';
import { useFormActions } from '../Form';
import { UIState } from '../../providers/UIStateProvider';

const useStyles = createStyles({
  actionsToolbar: {
    padding: 8,
  },
  deleteButton: {
    order: 10,
    marginLeft: 24,
  },
  deleteButtonWithSiblings: {
    marginRight: 24,
  },
  cancelButton: {
    order: 20,
  },
  saveButton: {
    order: 30,
  },
});

export interface ActionsToolbarProps {
  className?: string;
  saveLabel?: string;
  saveClassName?: string;
  cancelLabel?: string;
  cancelDialogTitle?: string;
  cancelDialogMessage?: ReactNode;
  cancelClassName?: string;
  deleteLabel?: string;
  deleteDialogTitle?: string;
  deleteDialogMessage?: ReactNode;
  deleteClassName?: string;
  isLoading?: boolean;
  isSaveReadOnly?: boolean;
  isCancelReadOnly?: boolean;
  isDeleteReadOnly?: boolean;
  onSave?(): void;
  onCancel?(): void;
  onDelete?(): void;
  children?: ReactNode;
}

export const ActionsToolbar = createComponent('ActionsToolbar', ({
  className,
  saveLabel = 'Save',
  saveClassName,
  cancelLabel = 'Cancel',
  cancelDialogTitle = 'Are you sure?',
  cancelDialogMessage,
  cancelClassName,
  deleteLabel = 'Delete',
  deleteDialogTitle = 'Are you sure?',
  deleteDialogMessage,
  deleteClassName,
  isLoading,
  isSaveReadOnly,
  isCancelReadOnly,
  isDeleteReadOnly,
  onSave,
  onCancel,
  onDelete,
  children,
}: ActionsToolbarProps) => {
  const { isInForm, save: saveForm, cancel: cancelForm } = useFormActions();
  const { css, alterTheme, tools: { modifyColor }, join } = useStyles();
  const confirmationContext = useContext(ConfirmationDialogContext);
  if ((cancelDialogMessage != null || deleteDialogMessage != null) && !confirmationContext) {
    throw new Error('ActionsToolbar with cancelDialogMessage or deleteDialogMessage must be used within Dialogs.');
  }
  const openConfirmationDialog = confirmationContext?.openConfirmationDialog ?? (() => Promise.resolve(true));

  const showSaveButton = onSave != null || (isInForm && saveForm != null);
  const showCancelButton = onCancel != null || (isInForm && cancelForm != null);

  const cancel = useBound(async () => {
    if (cancelDialogMessage != null && !await openConfirmationDialog(cancelDialogTitle, cancelDialogMessage)) return;
    if (onCancel) {
      onCancel();
    } else if (isInForm) {
      await cancelForm();
    }
  });

  const remove = useBound(async () => {
    if (deleteDialogMessage == null) {
      onDelete?.();
    } else {
      if (await openConfirmationDialog(deleteDialogTitle, deleteDialogMessage)) onDelete?.();
    }
  });

  const save = useBound(async () => {
    if (onSave) {
      onSave();
    } else if (isInForm) {
      await saveForm();
    }
  });

  const deleteButtonTheme = alterTheme(({ buttons }) => ({
    buttons: {
      ...buttons,
      default: {
        ...buttons.default,
        normal: {
          ...buttons.default.normal,
          backgroundColor: '#f15a5a',
          textColor: 'white',
        },
        active: {
          ...buttons.default.active,
          backgroundColor: modifyColor('#f15a5a').darken(0.15).hexa(),
          textColor: 'white',
        },
      }
    }
  }));

  return (
    <UIState isLoading={isLoading}>
      <Flex tagName="actions-toolbar" className={join(css.actionsToolbar, className)} gap={8} disableGrow align="right">
        {onDelete != null && (
          <UIState isReadOnly={isDeleteReadOnly}>
            <ThemeProvider theme={deleteButtonTheme}>
              <Button onSelect={remove} className={join(css.deleteButton, (showCancelButton || showSaveButton || children != null) && css.deleteButtonWithSiblings, deleteClassName)}>{deleteLabel}</Button>
            </ThemeProvider>
          </UIState>
        )}
        {showCancelButton && (
          <UIState isReadOnly={isCancelReadOnly}>
            <Button onSelect={cancel} className={join(css.cancelButton, cancelClassName)}>{cancelLabel}</Button>
          </UIState>
        )}
        {showSaveButton && (
          <UIState isReadOnly={isSaveReadOnly}>
            <Button onSelect={save} className={join(css.saveButton, saveClassName)}>{saveLabel}</Button>
          </UIState>
        )}
        {children}
      </Flex>
    </UIState>
  );
});