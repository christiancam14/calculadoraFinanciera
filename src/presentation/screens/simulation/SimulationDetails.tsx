import {NavigationProp, RouteProp} from '@react-navigation/native';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {Button, Layout, Modal} from '@ui-kitten/components';
import {AmortizationTable} from '../../components/Amortizationtable';
import {ModalCalendar} from '../../components/modalCalendar';
import {useModal} from '../../../core/providers/ModalProvider';
import {MyIcon} from '../../components/ui/MyIcon';
import {scheduleNotification} from '../../../config/helpers/scheduleNotification';
import {useEffect, useState} from 'react';
import {
  getScheduledNotifications,
  saveScheduledNotifications,
} from '../../../core/services/storeScheduledNotification ';
import {ScheduledNotification} from '../../../core/entities/notificationEntities';

type RootStackParamList = {
  SimulationDetails: {
    simulation: Simulation;
  };
  SimulationScreen: {
    simulationId: string;
    action: string;
  };
};

type SimulationDetailsRouteProp = RouteProp<
  RootStackParamList,
  'SimulationDetails'
>;

type SimulationDetailsProps = {
  route: SimulationDetailsRouteProp;
  navigation: NavigationProp<RootStackParamList>;
};

export const SimulationDetails = ({route}: SimulationDetailsProps) => {
  const {simulation} = route.params; // Obteniendo simulation del parámetro

  const {isScheduling, toggleModal} = useModal(); // Uso del contexto

  const [scheduledNotifications, setScheduledNotifications] = useState<
    ScheduledNotification[]
  >([]); // Estado para las notificaciones

  // Cargar notificaciones programadas al montar el componente
  useEffect(() => {
    const loadNotifications = async () => {
      const notifications = await getScheduledNotifications();
      setScheduledNotifications(notifications);
    };
    loadNotifications();
  }, []);

  const handleSchedule = async (date: Date) => {
    const periodicity = simulation.simulationData.periodicity; // Usar la variable existente
    const totalPeriods = simulation.data.length; // Total de cuotas

    // Función para calcular las fechas de recordatorio
    const calculateReminderDates = (initialDate: Date, total: number) => {
      const reminderDates = [];
      for (let i = 0; i < total; i++) {
        const nextDate = new Date(initialDate);

        if (periodicity === 'Mensual') {
          nextDate.setMonth(initialDate.getMonth() + i);
        } else if (periodicity === 'Semanal') {
          nextDate.setDate(initialDate.getDate() + i * 7); // Sumar semanas
        }
        reminderDates.push(nextDate);
      }
      return reminderDates;
    };

    const reminderDates = calculateReminderDates(date, totalPeriods);
    const newScheduledNotifications: ScheduledNotification[] = []; // Para almacenar las nuevas notificaciones

    // Programar las notificaciones
    for (const reminderDate of reminderDates) {
      const notificationDate = new Date(reminderDate);
      notificationDate.setHours(8, 0, 0, 0); // Establecer hora a las 8 AM

      // Solo programar si la fecha de notificación es futura
      const now = new Date();
      if (notificationDate > now) {
        try {
          const notificationId = await scheduleNotification({
            date: notificationDate,
            notificationSubtitle: 'Recordatorio de Pago',
            notificationBody: `Este es tu recordatorio para la cuota ${
              reminderDates.indexOf(reminderDate) + 1
            }`,
          });

          // Asegúrate de asignar el simulationId correcto aquí
          newScheduledNotifications.push({
            id: notificationId,
            title: 'Título de la notificación', // Cambia esto según tu lógica
            subtitle: 'Subtítulo de la notificación',
            message: 'Mensaje de la notificación',
            body: `Este es tu recordatorio para la cuota ${
              reminderDates.indexOf(reminderDate) + 1
            }`,
            simulationId: simulation.id, // Asegúrate de que simulation.id contenga el ID correcto
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

    // Guardar las nuevas notificaciones programadas
    await saveScheduledNotifications([
      ...scheduledNotifications,
      ...newScheduledNotifications,
    ]);

    setScheduledNotifications(prev => [...prev, ...newScheduledNotifications]); // Actualizar el estado
    toggleModal(); // Cerrar el modal después de programar
  };

  return (
    <Layout style={styles.container}>
      <Modal
        visible={isScheduling}
        style={styles.modalContainer}
        backdropStyle={styles.backdrop}>
        <ModalCalendar
          handleSchedule={handleSchedule}
          handleToggleModal={toggleModal} // Pasando la función del contexto
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
  floatingButton: {
    position: 'absolute',
    backgroundColor: '#DD4B39',
    bottom: 20,
    right: 20,
    padding: 10,
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
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 6,
  },
  modalText: {
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    marginTop: 36,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#DD4B39',
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
