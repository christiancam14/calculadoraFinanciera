import {NavigationProp, RouteProp} from '@react-navigation/native';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {Button, Layout, Modal} from '@ui-kitten/components';
import {AmortizationTable} from '../../components/Amortizationtable';
import {ModalCalendar} from '../../components/modalCalendar';
import {useModal} from '../../../core/providers/ModalProvider';
import {MyIcon} from '../../components/ui/MyIcon';
import {scheduleNotification} from '../../../config/helpers/scheduleNotification';
import {useEffect, useState, useCallback} from 'react';

import {ScheduledNotification} from '../../../core/entities/notificationEntities';
import {
  getScheduledNotifications,
  saveScheduledNotifications,
} from '../../../core/services/storeScheduledNotification';

type RootStackParamList = {
  SimulationDetails: {simulation: Simulation};
  SimulationScreen: {simulationId: string; action: string};
};

type SimulationDetailsRouteProp = RouteProp<
  RootStackParamList,
  'SimulationDetails'
>;

type SimulationDetailsProps = {
  route: SimulationDetailsRouteProp;
  navigation: NavigationProp<RootStackParamList>;
};

const calculateReminderDates = (
  initialDate: Date,
  total: number,
  periodicity: string,
) => {
  const reminderDates: Date[] = [];
  for (let i = 0; i < total; i++) {
    const nextDate = new Date(initialDate);
    if (periodicity === 'Mensual') {
      nextDate.setMonth(initialDate.getMonth() + i);
    } else if (periodicity === 'Semanal') {
      nextDate.setDate(initialDate.getDate() + i * 7);
    }
    reminderDates.push(nextDate);
  }
  return reminderDates;
};

export const SimulationDetails = ({route}: SimulationDetailsProps) => {
  const {simulation} = route.params;
  const {isScheduling, toggleModal} = useModal();
  const [scheduledNotifications, setScheduledNotifications] = useState<
    ScheduledNotification[]
  >([]);

  // Load scheduled notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      const notifications = await getScheduledNotifications();
      setScheduledNotifications(notifications);
    };
    loadNotifications();
  }, []);

  const handleSchedule = useCallback(
    async (date: Date) => {
      const {periodicity} = simulation.simulationData;
      const totalPeriods = simulation.data.length;

      // Calcular las fechas de recordatorio correctamente
      const reminderDates = calculateReminderDates(
        date,
        totalPeriods,
        periodicity,
      );
      const newScheduledNotifications: ScheduledNotification[] = [];

      // Programar notificaciones
      for (const reminderDate of reminderDates) {
        const notificationDate = new Date(reminderDate);
        notificationDate.setHours(8, 0, 0, 0); // Fijar la hora a las 8 AM

        // Asegurarse de que la fecha de la notificación esté en el futuro
        if (notificationDate > new Date()) {
          try {
            const notificationId = await scheduleNotification({
              date: notificationDate,
              notificationSubtitle: 'Recordatorio de Pago',
              notificationBody: `Este es tu recordatorio para la cuota ${
                reminderDates.indexOf(reminderDate) + 1
              }`,
            });

            // Asegurarse de asignar la fecha correcta (notificationDate) a cada notificación
            newScheduledNotifications.push({
              id: notificationId,
              title: 'Título de la notificación', // Cambia esto según tu lógica
              subtitle: `${simulation.nombre}`,
              message: 'Tienes un pago para hoy',
              body: `Cuota #${reminderDates.indexOf(reminderDate) + 1}`,
              simulationId: simulation.id,
              date: notificationDate, // Asignar la fecha de la cuota, no la fecha de inicio
            });
            console.log(`Notificación programada para ${notificationDate}`);
          } catch (error) {
            console.error('Error programando la notificación:', error);
          }
        } else {
          console.log(
            `No se programará notificación para ${notificationDate}, ya ha pasado.`,
          );
        }
      }

      // Guardar las notificaciones programadas
      await saveScheduledNotifications([
        ...scheduledNotifications,
        ...newScheduledNotifications,
      ]);
      setScheduledNotifications(prev => [
        ...prev,
        ...newScheduledNotifications,
      ]);
      toggleModal(); // Cerrar el modal después de programar
    },
    [simulation, scheduledNotifications, toggleModal],
  );

  return (
    <Layout style={styles.container}>
      <Modal
        visible={isScheduling}
        style={styles.modalContainer}
        backdropStyle={styles.backdrop}>
        <ModalCalendar
          handleSchedule={handleSchedule}
          handleToggleModal={toggleModal}
        />
      </Modal>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{simulation.nombre}</Text>
        <AmortizationTable
          data={simulation.data}
          simulationData={simulation.simulationData}
        />
      </ScrollView>
      <Button style={styles.floatingButtonSchedule} onPress={toggleModal}>
        <MyIcon name="calendar-outline" white />
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  floatingButtonSchedule: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
  },
  modalContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  scrollView: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});
