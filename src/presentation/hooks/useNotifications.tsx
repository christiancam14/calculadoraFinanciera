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

export const useNotifications = (isFocused: boolean, simulationId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const allNotifications: DisplayedNotification[] =
        await notifee.getDisplayedNotifications();

      const mappedNotifications: Notification[] = allNotifications.map(
        notif => {
          const scheduledTime = notif.notification?.data?.scheduledTime;
          const displayDate =
            typeof scheduledTime === 'string' ||
            typeof scheduledTime === 'number'
              ? new Date(scheduledTime)
              : new Date();

          return {
            id: notif.id || '',
            title: notif.notification?.title || 'Título no disponible',
            subtitle: notif.notification?.subtitle || 'Subtítulo no disponible',
            message: notif.notification?.body || 'Mensaje no disponible',
            body: notif.notification?.body || 'Cuerpo no disponible',
            date: displayDate,
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
          subtitle: notification.subtitle || 'Subtítulo no disponible',
          message: notification.body || 'Mensaje no disponible',
          body: notification.body || 'Cuerpo no disponible',
          date: new Date(notification.date),
          simulationId: String(notification.simulationId || 'default'),
        })),
      ];

      // Filtrar las notificaciones aquí si simulationId está definido
      const filteredNotifications = simulationId
        ? allLoadedNotifications.filter(
            notification => notification.simulationId === simulationId,
          )
        : allLoadedNotifications; // Si no hay simulationId, mostrar todas las notificaciones

      setNotifications(filteredNotifications);
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
