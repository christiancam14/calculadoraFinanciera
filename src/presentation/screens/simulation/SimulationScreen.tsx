import {StyleSheet, View} from 'react-native';
import {Button} from '@ui-kitten/components';
// import {TextInput} from 'react-native-gesture-handler';
// import {scheduleNotification} from '../../../config/helpers/scheduleNotification';

import {scheduleNotification} from '../../../config/helpers/scheduleNotification';

export const SimulationScreen = () => {
  const handleScheduleNotification = async () => {
    try {
      const scheduleDate = new Date();
      scheduleDate.setSeconds(scheduleDate.getSeconds() + 5);

      await scheduleNotification({
        date: scheduleDate,
        notificationSubtitle: 'Recordatorio',
        notificationBody: 'Este es el cuerpo de tu recordatorio',
      });
      console.log('Notificación programada exitosamente.');
    } catch (error) {
      console.error('Error programando la notificación:', error);
      console.log('Error al programar la notificación.');
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleScheduleNotification}>
        Programar Notificación
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
