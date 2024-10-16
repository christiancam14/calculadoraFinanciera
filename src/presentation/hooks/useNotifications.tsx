// hooks/useNotifications.ts
import {useEffect, useState} from 'react';
import notifee, {DisplayedNotification} from '@notifee/react-native';
import {getScheduledNotifications} from '../../core/services/storeScheduledNotification';

interface Notification {
  subtitle: string;
  id: string;
  title: string;
  message: string;
  body: string;
  date: Date;
  simulationId: string;
}

export const useNotifications = (isFocused: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const allNotifications: DisplayedNotification[] =
        await notifee.getDisplayedNotifications();
      const mappedNotifications: Notification[] = allNotifications.map(
        notif => {
          const date = notif.date ? new Date(notif.date) : new Date();
          return {
            id: notif.id || '',
            title: notif.notification?.title || 'Título no disponible',
            subtitle: notif.notification?.subtitle || 'Título no disponible',
            message: notif.notification?.body || 'Mensaje no disponible',
            body: notif.notification?.body || 'Cuerpo no disponible',
            date,
            simulationId: String(
              notif.notification?.data?.simulationId || 'default',
            ),
          };
        },
      );

      const scheduledNotifications = await getScheduledNotifications();
      const allLoadedNotifications = [
        ...mappedNotifications,
        ...scheduledNotifications.map(notification => ({
          id: notification.id || '',
          title: notification.title || 'Título no disponible',
          subtitle: notification.subtitle || 'Título no disponible',
          message: notification.body || 'Mensaje no disponible',
          body: notification.body || 'Cuerpo no disponible',
          date: new Date(notification.date),
          simulationId: String(notification.simulationId || 'default'),
        })),
      ];

      setNotifications(allLoadedNotifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadNotifications();
    }
  }, [isFocused]);

  return {notifications, loading, loadNotifications, setNotifications};
};
