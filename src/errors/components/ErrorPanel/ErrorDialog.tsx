import { createDialog, useDialog } from '../../../components/Dialog';

const ErrorDialog = createDialog('ErrorDialog', ({ Dialog, Content, Actions, OkButton }) => (error: Error) => (
  <Dialog title={`Error: ${error.name}`}>
    <Content>
      {error.message}
    </Content>
    <Actions>
      <OkButton />
    </Actions>
  </Dialog>
));

export const useErrorDialog = () => useDialog(ErrorDialog);
