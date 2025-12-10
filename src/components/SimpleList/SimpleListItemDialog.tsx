import type { ReactNode } from 'react';
import { useState } from 'react';
import { useBound } from '../../hooks';
import type { ReactListItem } from '../../models';
import type { DialogDefinitionUtils } from '../Dialog';
import { createDialog } from '../Dialog';
import { useFields } from '../Field';
import { Text } from '../Text';

interface Props {
  textFieldLabel?: ReactNode;
  allowDelete?: boolean;
}

export const useSimpleListItemDialog = createDialog('SimpleListItemDialog', ({ Dialog, Content, Actions, close }: DialogDefinitionUtils<ReactListItem | null | undefined>) =>
  ({ allowDelete = false, textFieldLabel = 'Text' }: Props) => (initialItem?: ReactListItem) => {
    const [item, setItem] = useState(() => initialItem ?? { id: Math.uniqueId(), text: '' });
    const { Field } = useFields(item, setItem);

    const isNew = initialItem == null;

    const title = isNew ? 'Add Item' : 'Edit Item';

    const saveItem = useBound(() => {
      close(item);
    });

    const deleteItem = useBound(() => {
      close(null);
    });

    return (
      <Dialog title={title} minWidth={300} minHeight={200} allowCloseButton>
        <Content>
          <Field field="text" component={Text} label={textFieldLabel} wide />
        </Content>
        <Actions
          onDelete={allowDelete && !isNew ? deleteItem : undefined}
          onSave={saveItem}
        />
      </Dialog>
    );
  });