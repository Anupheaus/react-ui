import { toast } from 'react-hot-toast';
import { useBound, useDelegatedBound } from '../../hooks';
import type { Theme } from '../../theme';
import { ThemeProvider, createStyles } from '../../theme';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Icon } from '../Icon';

const defaultNotifications: Theme['notifications'] = {
  base: { backgroundColor: 'white', color: 'black', fontSize: 13, fontWeight: 400, boxShadow: '0 0 8px 2px rgba(0 0 0 / 30%)' },
  success: { backgroundColor: '#22c115', color: '#fff' },
  error: { backgroundColor: '#6e0000', color: '#fff' },
  warning: { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 800 },
  info: { backgroundColor: '#dbeafe', color: '#1e40af' },
};

const useStyles = createStyles(({ notifications = defaultNotifications }) => {
  const { base, success, error, warning, info } = notifications;
  return {
    notificationContent: {
      paddingRight: 16,
    },
    notificationButton: {
      position: 'absolute',
      right: -8,
      top: 0,
    },
    success: { ...base, ...success },
    error: { ...base, ...error },
    warning: { ...base, ...warning },
    info: { ...base, ...info },
    warningIcon: { color: warning.color },
  };
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
      className: css.success,
    });
  });

  const showError = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast.error(generateMessage(message, timeout === 0, true), {
      id: message,
      duration: timeout === 0 ? Number.POSITIVE_INFINITY : timeout,
      className: css.error,
    });
  });

  const showWarning = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast(generateMessage(message, timeout === 0, false), {
      id: message,
      duration: timeout === 0 ? Number.POSITIVE_INFINITY : timeout,
      icon: <Icon name="warning" className={css.warningIcon} />,
      className: css.warning,
    });
  });

  const showInfo = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast(generateMessage(message, timeout === 0, false), {
      id: message,
      duration: timeout === 0 ? Number.POSITIVE_INFINITY : timeout,
      className: css.info,
    });
  });

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}