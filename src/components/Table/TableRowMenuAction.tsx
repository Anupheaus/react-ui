import type { PromiseMaybe, Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { EllipsisMenu, MenuItem } from '../Menu';
import { useConfirmationDialog } from '../Dialog';

interface Props<RecordType extends Record> {
  record: RecordType | undefined;
  rowIndex: number;
  unitName: string;
  removeLabel?: string;
  onRemove?(record: RecordType, index: number): PromiseMaybe<void>;
}

export const TableRowMenuAction = createComponent('TableRowMenuAction', <RecordType extends Record>({
  record,
  rowIndex,
  unitName,
  removeLabel = 'Delete',
  onRemove,
}: Props<RecordType>) => {
  const { openConfirmationDialog, ConfirmationDialog } = useConfirmationDialog();

  const removeRecord = useBound(async () => {
    const title = `${removeLabel.toPascalCase()} ${unitName.toPascalCase()}?`;
    const message = `Are you sure you want to ${removeLabel.toLowerCase()} this ${unitName.toLowerCase()}?`;
    if ((await openConfirmationDialog(title, message)) !== 'yes') return;
    if (record == null || onRemove == null) return;
    return onRemove(record, rowIndex);
  });

  if (onRemove == null) return null;

  return (<>
    <EllipsisMenu buttonSize="small">
      {onRemove != null && <MenuItem onSelect={removeRecord}>{removeLabel.toPascalCase()}</MenuItem>}
    </EllipsisMenu>
    <ConfirmationDialog />
  </>);
});