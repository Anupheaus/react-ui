import type { ReactNode } from 'react';
import { ThemeProvider, createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { useConfirmationDialog } from '../Dialog';
import { useBound } from '../../hooks/useBound';
import { useFormActions } from '../Form';
import { UIState } from '../../providers/UIStateProvider';

const useStyles = createStyles({
  actionsToolbar: {
    padding: 8,
  },
  deleteButton: {
    order: 10,
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
  onSave,
  onCancel,
  onDelete,
  children,
}: ActionsToolbarProps) => {
  const { isInForm, save: saveForm, cancel: cancelForm } = useFormActions();
  const { css, alterTheme, tools: { modifyColor }, join } = useStyles();
  const { ConfirmationDialog: CancelConfirmationDialog, openConfirmationDialog: openCancelConfirmationDialog } = useConfirmationDialog();
  const { ConfirmationDialog: DeleteConfirmationDialog, openConfirmationDialog: openDeleteConfirmationDialog } = useConfirmationDialog();

  const showSaveButton = onSave != null || (isInForm && saveForm != null);
  const showCancelButton = onCancel != null || (isInForm && cancelForm != null);

  const cancel = useBound(async () => {
    if (cancelDialogMessage != null && !await openCancelConfirmationDialog()) return;
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
      if (await openDeleteConfirmationDialog()) onDelete?.();
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
        {onDelete != null && (<>
          <ThemeProvider theme={deleteButtonTheme}>
            <Button onSelect={remove} className={join(css.deleteButton, deleteClassName)}>{deleteLabel}</Button>
          </ThemeProvider>
          {deleteDialogMessage != null && (
            <DeleteConfirmationDialog title={deleteDialogTitle} message={deleteDialogMessage} />
          )}
        </>)}
        {showCancelButton && (<>
          <Button onSelect={cancel} className={join(css.cancelButton, cancelClassName)}>{cancelLabel}</Button>
          {cancelDialogMessage != null && (
            <CancelConfirmationDialog title={cancelDialogTitle} message={cancelDialogMessage} />
          )}
        </>)}
        {showSaveButton && <Button onSelect={save} className={join(css.saveButton, saveClassName)}>{saveLabel}</Button>}
        {children}
      </Flex>
    </UIState>
  );
});