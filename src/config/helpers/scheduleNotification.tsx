import notifee, {AndroidCategory, TriggerType} from '@notifee/react-native';

interface Props {
  date: Date;
  notificationSubtitle?: string;
  notificationBody?: string;
}

// Función para programar la notificación
export async function scheduleNotification({
  date,
  notificationSubtitle = '¡A pagar!',
  notificationBody = '¡Es hora de tu evento!',
}: Props): Promise<string> {
  // Asegúrate de que la función retorne un string
  // Asegúrate de que la fecha sea válida
  const timestamp = date.getTime();

  // Crea una notificación
  await notifee.createChannel({
    id: '7815696ecbf1c',
    name: 'Calculadora notificaciones',
    importance: 4,
    sound: 'default',
  });

  // Programa la notificación y captura el ID
  const notificationId = await notifee.createTriggerNotification(
    {
      title: '&#128178; Tienes un pago hoy &#128178;',
      subtitle: notificationSubtitle,
      body: notificationBody,
      android: {
        channelId: '7815696ecbf1c',
        importance: 4,
        category: AndroidCategory.REMINDER,
        timestamp: timestamp,
        showTimestamp: true,
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp, // Usa la marca de tiempo para la fecha y hora que deseas
    },
  );

  return notificationId; // Retorna el ID de la notificación programada
}

export const cancelNotification = async (notificationId: string) => {
  try {
    await notifee.cancelNotification(notificationId);
    console.log(`Notificación con ID: ${notificationId} cancelada.`);
  } catch (error) {
    console.error('Error al cancelar la notificación:', error);
  }
};
