import { Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { EllipsisMenu, MenuItem } from '../Menu';
import { useDialog } from '../Dialog';
import { useMemo } from 'react';

interface Props {
  record: Record | undefined;
  rowIndex: number;
  unitName: string;
  removeLabel?: string;
  onRemove?(record: Record, index: number): void;
}

export const GridRowMenuAction = createComponent('GridRowMenuAction', ({
  record,
  rowIndex,
  unitName,
  removeLabel = 'Delete',
  onRemove,
}: Props) => {
  const { Dialog: RemoveRecordConfirmationDialog, DialogActions: RemoveRecordConfirmationDialogActions, DialogContent: RemoveRecordConfirmationDialogContent,
    OkButton: RemoveRecordConfirmationOkButton, CancelButton: RemoveRecordConfirmationCancelButton,
    openDialog: openRemoveRecordConfirmationDialog } = useDialog();

  const removeRecord = useBound(async () => {
    if ((await openRemoveRecordConfirmationDialog()) !== 'ok') return;
    if (record == null || onRemove == null) return;
    onRemove(record, rowIndex);
  });

  const title = useMemo(() => (<>{removeLabel.toPascalCase()} {unitName.toPascalCase()}?</>), [removeLabel, unitName]);

  if (onRemove == null) return null;

  return (<>
    <EllipsisMenu buttonSize="small">
      {onRemove != null && <MenuItem onSelect={removeRecord}>{removeLabel.toPascalCase()}</MenuItem>}
    </EllipsisMenu>
    <RemoveRecordConfirmationDialog title={title}>
      <RemoveRecordConfirmationDialogContent>
        Are you sure you want to {removeLabel.toLowerCase()} this {unitName.toLowerCase()}?
      </RemoveRecordConfirmationDialogContent>
      <RemoveRecordConfirmationDialogActions>
        <RemoveRecordConfirmationOkButton>Yes</RemoveRecordConfirmationOkButton>
        <RemoveRecordConfirmationCancelButton>No</RemoveRecordConfirmationCancelButton>
      </RemoveRecordConfirmationDialogActions>
    </RemoveRecordConfirmationDialog>
  </>);
});