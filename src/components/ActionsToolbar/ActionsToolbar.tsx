import { ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Button } from '../Button';
import { Flex } from '../Flex';

const useStyles = createStyles({
  actionsToolbar: {
    padding: 8,
  },
});

interface Props {
  saveLabel?: string;
  cancelLabel?: string;
  onSave?(): void;
  onCancel?(): void;
  children?: ReactNode;
}

export const ActionsToolbar = createComponent('ActionsToolbar', ({
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  onSave,
  onCancel,
  children,
}: Props) => {
  const { css } = useStyles();

  return (
    <Flex tagName="actions-toolbar" className={css.actionsToolbar} gap={8} disableGrow align="right">
      {onSave != null && <Button onSelect={onSave}>{saveLabel}</Button>}
      {onCancel != null && <Button onSelect={onCancel}>{cancelLabel}</Button>}
      {children}
    </Flex>
  );
});