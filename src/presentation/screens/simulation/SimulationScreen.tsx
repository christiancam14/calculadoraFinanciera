import {StyleSheet, View} from 'react-native';
import {Button, Input} from '@ui-kitten/components';
import {useState} from 'react';
// import {TextInput} from 'react-native-gesture-handler';
import {scheduleNotification} from '../../../config/helpers/scheduleNotification';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

export const SimulationScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateString, setDateString] = useState('');

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
    setDateString(currentDate.toISOString().slice(0, 19)); // Formato 'YYYY-MM-DDTHH:mm:ss'
  };

  const handleScheduleNotification = async () => {
    try {
      const scheduleDate = new Date();
      scheduleDate.setSeconds(scheduleDate.getSeconds() + 5);

      await scheduleNotification({
        date: scheduleDate,
        notificationTitle: 'Recordatorio guardado',
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
      <Input
        placeholder="Fecha y hora"
        value={dateString}
        onFocus={() => setShowPicker(true)}
      />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={onChange}
        />
      )}
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
