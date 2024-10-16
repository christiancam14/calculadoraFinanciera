// utils/notifications.ts
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

interface ScheduledNotification {
  simulationId: string;
  id: string;
  title: string;
  subtitle: string;
  message: string;
  body: string;
  date: Date; // Agregada propiedad para la fecha
}

// Obtener notificaciones programadas de MMKV
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

// Guardar notificaciones programadas en MMKV
export const saveScheduledNotifications = async (
  notifications: ScheduledNotification[],
) => {
  try {
    storage.set('scheduledNotifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error al guardar las notificaciones programadas:', error);
  }
};

// Eliminar una notificación programada de MMKV
export const deleteScheduledNotification = async (notificationId: string) => {
  try {
    const notifications = await getScheduledNotifications();

    // Filtrar las notificaciones para eliminar la que coincida con notificationId
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId,
    );

    // Guardar la lista actualizada de notificaciones en MMKV
    await saveScheduledNotifications(updatedNotifications);

    console.log(`Notificación con ID ${notificationId} eliminada de MMKV.`);
  } catch (error) {
    console.error('Error al eliminar la notificación programada:', error);
  }
};

// Guardar una nueva notificación programada (incluyendo la fecha)
export const saveScheduledNotification = async (
  notification: ScheduledNotification,
) => {
  const currentNotifications = await getScheduledNotifications();
  const updatedNotifications = [...currentNotifications, notification];
  await saveScheduledNotifications(updatedNotifications);
};
