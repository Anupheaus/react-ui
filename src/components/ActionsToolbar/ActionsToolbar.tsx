import type { ReactNode } from 'react';
import { ThemeProvider, createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Flex } from '../Flex';
import { useConfirmationDialog } from '../Dialog';
import { useBound } from '../../hooks';

const useStyles = createStyles({
  actionsToolbar: {
    padding: 8,
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
  onSave,
  onCancel,
  onDelete,
  children,
}: ActionsToolbarProps) => {
  const { css, alterTheme, tools: { modifyColor }, join } = useStyles();
  const { ConfirmationDialog: CancelConfirmationDialog, openConfirmationDialog: openCancelConfirmationDialog } = useConfirmationDialog();
  const { ConfirmationDialog: DeleteConfirmationDialog, openConfirmationDialog: openDeleteConfirmationDialog } = useConfirmationDialog();

  const cancel = useBound(async () => {
    if (cancelDialogMessage == null) {
      onCancel?.();
    } else {
      const result = await openCancelConfirmationDialog();
      if (result == 'yes') onCancel?.();
    }
  });

  const remove = useBound(async () => {
    if (deleteDialogMessage == null) {
      onDelete?.();
    } else {
      const result = await openDeleteConfirmationDialog();
      if (result == 'yes') onDelete?.();
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
    <Flex tagName="actions-toolbar" className={join(css.actionsToolbar, className)} gap={8} disableGrow align="right">
      {onDelete != null && (
        <ThemeProvider theme={deleteButtonTheme}>
          <Button onSelect={remove} className={deleteClassName}>{deleteLabel}</Button>
        </ThemeProvider>
      )}
      {onCancel != null && <Button onSelect={cancel} className={cancelClassName}>{cancelLabel}</Button>}
      {onSave != null && <Button onSelect={onSave} className={saveClassName}>{saveLabel}</Button>}
      {children}
      <CancelConfirmationDialog title={cancelDialogTitle} message={cancelDialogMessage} />
      <DeleteConfirmationDialog title={deleteDialogTitle} message={deleteDialogMessage} />
    </Flex>
  );
});