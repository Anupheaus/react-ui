import { toast } from 'react-hot-toast';
import { useBound, useDelegatedBound } from '../../hooks';
import { ThemeProvider, createStyles } from '../../theme';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Icon } from '../Icon';

const useStyles = createStyles({
  notificationContent: {
    paddingRight: 16,
  },
  notificationButton: {
    position: 'absolute',
    right: -8,
    top: 0,
  },
});

interface NotificationProps {
  timeout?: number;
}

export function useNotifications() {
  const { css, alterTheme } = useStyles();

  const closeToast = useDelegatedBound((id: string) => () => toast.dismiss(id));

  const errorTheme = alterTheme(() => ({
    buttons: {
      hover: {
        normal: {
          textColor: 'white',
        },
        active: {
          backgroundColor: '#ffffff44',
        },
      },
    },
  }));

  function generateMessage(message: string, addCloseButton: boolean, isError: boolean) {
    if (!addCloseButton) return message;

    let button = <Button variant="hover" size="small" onClick={closeToast(message)} iconOnly><Icon name="dialog-close" /></Button>;
    if (isError) button = <ThemeProvider theme={errorTheme}>{button}</ThemeProvider>;

    return (
      <Flex tagName="notification-content" className={css.notificationContent}>
        {message}
        <Flex tagName="notification-button" className={css.notificationButton}>
          {button}
        </Flex>
      </Flex>
    );
  }

  const showSuccess = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast.success(generateMessage(message, timeout === 0, false), {
      id: message,
      duration: timeout === 0 ? Number.POSITIVE_INFINITY : timeout,
    });
  });

  const showError = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast.error(generateMessage(message, timeout === 0, true), {
      id: message,
      duration: timeout === 0 ? Number.POSITIVE_INFINITY : timeout,
    });
  });

  const showWarning = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast(generateMessage(message, timeout === 0, false), {
      id: message,
      duration: timeout === 0 ? Number.POSITIVE_INFINITY : timeout,
    });
  });

  return {
    showSuccess,
    showError,
    showWarning,
  };
}