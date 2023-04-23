import { toast } from 'react-hot-toast';
import { useBound } from '../../hooks';

interface NotificationProps {
  timeout?: number;
}

export function useNotifications() {

  const showSuccess = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast.success(message, {
      duration: timeout,
    });
  });

  const showError = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast.error(message, {
      duration: timeout,
    });
  });

  const showWarning = useBound((message: string, { timeout = 5000 }: NotificationProps = {}) => {
    toast(message, {
      duration: timeout,
    });
  });

  return {
    showSuccess,
    showError,
    showWarning,
  };
}