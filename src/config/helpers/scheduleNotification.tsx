import notifee, {TriggerType} from '@notifee/react-native';

interface Props {
  date: Date;
  notificationTitle?: string;
  notificationBody?: string;
}

// Función para programar la notificación
export async function scheduleNotification({
  date,
  notificationTitle = 'Recordatorio',
  notificationBody = '¡Es hora de tu evento!',
}: Props) {
  // Asegúrate de que la fecha sea válida
  const timestamp = date.getTime();

  // Crea una notificación
  await notifee.createChannel({
    id: '7815696ecbf1c',
    name: 'Calculadora notificaciones',
    importance: 4,
    sound: 'default',
  });

  // Programa la notificación
  await notifee.createTriggerNotification(
    {
      title: notificationTitle,
      body: notificationBody,
      android: {
        channelId: '7815696ecbf1c',
        importance: 4,
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp, // Usa la marca de tiempo para la fecha y hora que deseas
    },
  );
}
