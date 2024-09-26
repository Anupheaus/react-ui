import { createDialog } from '../../../components/Dialog';

export const useErrorDialog = createDialog('ErrorDialog', ({ Dialog, Content, Actions, OkButton }) => (error: Error) => (
  <Dialog title={`Error: ${error.name}`}>
    <Content>
      {error.message}
    </Content>
    <Actions>
      <OkButton />
    </Actions>
  </Dialog>
));
