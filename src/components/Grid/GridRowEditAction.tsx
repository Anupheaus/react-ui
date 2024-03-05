import { Record } from '@anupheaus/common';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useBound } from '../../hooks';

interface Props {
  record: Record | undefined;
  rowIndex: number;
  onEdit?(record: Record, index: number): void;
}

export const GridRowEditAction = createComponent('GridRowEditAction', ({
  record,
  rowIndex,
  onEdit,
}: Props) => {

  const handleSelect = useBound(() => {
    if (record == null || onEdit == null) return;
    onEdit(record, rowIndex);
  });

  if (onEdit == null) return null;

  return (
    <Button onSelect={handleSelect} variant="hover" size="small">
      <Icon name="grid-edit" size="small" />
    </Button>
  );
});