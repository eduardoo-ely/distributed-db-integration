/**
 * Notification store - manages toast notifications
 */

import { create } from 'zustand';
import { generateId } from '@/utils/helpers';
import { TOAST_DURATION } from '@/utils/constants';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = generateId();
    const duration = notification.duration ?? TOAST_DURATION[notification.type.toUpperCase() as keyof typeof TOAST_DURATION] ?? TOAST_DURATION.INFO;

    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id,
          duration,
        },
      ],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },
}));
