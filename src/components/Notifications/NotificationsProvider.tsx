import { CSSProperties, ReactNode, useMemo } from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { createComponent } from '../Component';

interface Props {
  children: ReactNode;
}

export const NotificationsProvider = createComponent('NotificationsProvider', ({
  children,
}: Props) => {
  const toastOptions = useMemo<ToasterProps['toastOptions']>(() => {
    const mainStyle: CSSProperties = {
      fontSize: 13,
      fontWeight: 400,
      boxShadow: '0 0 8px 2px rgba(0 0 0 / 30%)',
    };
    return {
      style: {
        ...mainStyle,
      },
      error: {
        style: {
          ...mainStyle,
          backgroundColor: '#6e0000',
          color: '#fff',
        },
      },
    };
  }, []);

  return (<>
    <Toaster
      position="bottom-center"
      reverseOrder
      toastOptions={toastOptions}
    />
    {children}
  </>);
});
