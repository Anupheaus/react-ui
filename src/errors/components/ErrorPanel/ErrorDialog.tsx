import { createDialog } from '../../../components/Dialog';

interface Props {
  error: Error;
}

export const useErrorDialog = createDialog('ErrorDialog', ({ Dialog, Content, Actions, OkButton }) => ({ error }: Props) => () => (
  <Dialog title={`Error: ${error.name}`}>
    <Content>
      {error.message}
    </Content>
    <Actions>
      <OkButton />
    </Actions>
  </Dialog>
));
