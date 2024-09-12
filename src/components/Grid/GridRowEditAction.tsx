import { PromiseMaybe, Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useBound } from '../../hooks';

interface Props<RecordType extends Record> {
  record: RecordType | undefined;
  rowIndex: number;
  onEdit?(record: RecordType, index: number): PromiseMaybe<void>;
}

export const GridRowEditAction = createComponent('GridRowEditAction', <RecordType extends Record>({
  record,
  rowIndex,
  onEdit,
}: Props<RecordType>) => {

  const handleSelect = useBound(() => {
    if (record == null || onEdit == null) return;
    return onEdit(record, rowIndex);
  });

  if (onEdit == null) return null;

  return (
    <Button onSelect={handleSelect} variant="hover" size="small">
      <Icon name="grid-edit" size="small" />
    </Button>
  );
});