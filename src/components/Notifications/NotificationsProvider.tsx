import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { createComponent } from '../Component';

interface Props {
  children: ReactNode;
}

export const NotificationsProvider = createComponent('NotificationsProvider', ({
  children,
}: Props) => {
  return (<>
    <Toaster
      position="bottom-center"
      reverseOrder
    />
    {children}
  </>);
});
