import type { ReactNode } from 'react';
import { createComponent } from '../../Component';
import { WindowAction } from './WindowAction';

interface Props {
  onClick?(): Promise<void>;
  children?: ReactNode;
}

export const WindowOkAction = createComponent('WindowOkAction', ({
  onClick,
  children = 'Okay',
}: Props) => (
  <WindowAction
    value="ok"
    onClick={onClick}
  >{children}</WindowAction>
));
