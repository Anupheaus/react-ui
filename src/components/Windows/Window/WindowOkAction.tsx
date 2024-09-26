import { createComponent } from '../../Component';
import { WindowAction } from './WindowAction';

interface Props {
  onClick?(): Promise<void>;
}

export const WindowOkAction = createComponent('WindowOkAction', ({
  onClick,
}: Props) => (
  <WindowAction
    value="ok"
    onClick={onClick}
  >Okay</WindowAction>
));
