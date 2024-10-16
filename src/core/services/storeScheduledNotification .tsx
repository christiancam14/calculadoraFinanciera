// utils/notifications.ts
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

interface ScheduledNotification {
  id: string;
  title: string;
  subtitle: string;
  message: string;
  body: string;
}

export const getScheduledNotifications = async (): Promise<
  ScheduledNotification[]
> => {
  try {
    const storedNotifications = storage.getString('scheduledNotifications');
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  } catch (error) {
    console.error('Error al recuperar las notificaciones programadas:', error);
    return []; // Retornar un array vacío en caso de error
  }
};

export const saveScheduledNotifications = async (
  notifications: ScheduledNotification[],
) => {
  try {
    storage.set('scheduledNotifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error al guardar las notificaciones programadas:', error);
  }
};
