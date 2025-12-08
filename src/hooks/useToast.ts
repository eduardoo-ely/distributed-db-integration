/**
 * Toast notification hook
 */

import { useNotificationStore } from '@/store/notificationStore';
import type { NotificationType } from '@/store/notificationStore';

export function useToast() {
  const addNotification = useNotificationStore((state) => state.addNotification);

  const toast = (
    message: string,
    type: NotificationType = 'info',
    title?: string,
    duration?: number
  ) => {
    addNotification({
      message,
      type,
      title,
      duration,
    });
  };

  return {
    toast,
    success: (message: string, title?: string, duration?: number) =>
      toast(message, 'success', title, duration),
    error: (message: string, title?: string, duration?: number) =>
      toast(message, 'error', title, duration),
    info: (message: string, title?: string, duration?: number) =>
      toast(message, 'info', title, duration),
    warning: (message: string, title?: string, duration?: number) =>
      toast(message, 'warning', title, duration),
  };
}
