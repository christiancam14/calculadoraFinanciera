import {
  NavigationProp,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import {StyleSheet, Text, FlatList} from 'react-native';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {Layout, Modal} from '@ui-kitten/components';
import {AmortizationTable} from '../../components/Amortizationtable';
import {ModalCalendar} from '../../components/modalCalendar';
import {useModal} from '../../../core/providers/ModalProvider';
import {scheduleNotification} from '../../../config/helpers/scheduleNotification';
import {useEffect, useState, useCallback} from 'react';
import {ScheduledNotification} from '../../../core/entities/notificationEntities';
import {
  getScheduledNotifications,
  saveScheduledNotifications,
} from '../../../core/services/storeScheduledNotification';
import {useNotifications} from '../../hooks/useNotifications';
import {NotificationDatesList} from '../../components/NotificationDatesList ';

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

interface NotificationItem {
  type: 'notification'; // Literal de cadena
  notifications: ScheduledNotification[];
}

interface AmortizationItem {
  type: 'amortization'; // Literal de cadena
}

interface HeaderItem {
  type: 'header'; // Literal de cadena para el encabezado
  title: string;
}

type ListItem = NotificationItem | AmortizationItem | HeaderItem;

export const SimulationDetails = ({route}: SimulationDetailsProps) => {
  const {simulation} = route.params;
  const {isScheduling, toggleModal} = useModal();
  const [scheduledNotifications, setScheduledNotifications] = useState<
    ScheduledNotification[]
  >([]);
  const isFocused = useIsFocused();
  const [simulationId] = useState<string>(simulation.id);
  const {notifications, loading} = useNotifications(isFocused, simulationId);

  // Cargar notificaciones programadas al montar el componente
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
      const reminderDates = calculateReminderDates(
        date,
        totalPeriods,
        periodicity,
      );
      const newScheduledNotifications: ScheduledNotification[] = [];

      for (const reminderDate of reminderDates) {
        const notificationDate = new Date(reminderDate);
        notificationDate.setHours(8, 0, 0, 0);

        if (notificationDate > new Date()) {
          try {
            const notificationId = await scheduleNotification({
              date: notificationDate,
              notificationSubtitle: 'Recordatorio de Pago',
              notificationBody: `Este es tu recordatorio para la cuota ${
                reminderDates.indexOf(reminderDate) + 1
              }`,
            });

            newScheduledNotifications.push({
              id: notificationId,
              title: 'Título de la notificación',
              subtitle: `${simulation.nombre}`,
              message: 'Tienes un pago para hoy',
              body: `Cuota #${reminderDates.indexOf(reminderDate) + 1}`,
              simulationId: simulation.id,
              date: notificationDate,
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

      await saveScheduledNotifications([
        ...scheduledNotifications,
        ...newScheduledNotifications,
      ]);
      setScheduledNotifications(prev => [
        ...prev,
        ...newScheduledNotifications,
      ]);
      toggleModal();
    },
    [simulation, scheduledNotifications, toggleModal],
  );

  const renderItem = ({item}: {item: ListItem}) => {
    if (item.type === 'notification') {
      return <NotificationDatesList notifications={item.notifications} />;
    } else if (item.type === 'amortization') {
      return (
        <AmortizationTable
          data={simulation.data}
          simulationData={simulation.simulationData}
        />
      );
    }
    return null;
  };

  const combinedData: ListItem[] = [
    {type: 'header', title: simulation.nombre},
    {type: 'amortization'}, // Cambiar si necesitas más datos aquí
    {
      type: 'notification',
      notifications: loading ? [] : notifications,
    },
  ];

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
      <FlatList
        data={combinedData}
        renderItem={({item}) => {
          if (item.type === 'header') {
            return <Text style={styles.title}>{item.title}</Text>; // Asegúrate de que item.title contenga texto
          } else {
            return renderItem({item});
          }
        }}
        keyExtractor={(item, index) => index.toString()} // Cambia esto si puedes usar un id único
        contentContainerStyle={styles.scrollView}
        style={{width: '100%'}} // Asegúrate de que el FlatList ocupe el ancho completo
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'stretch', // Cambiado de 'center' a 'stretch'
    padding: 12,
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

// Función para calcular las fechas de recordatorio
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
