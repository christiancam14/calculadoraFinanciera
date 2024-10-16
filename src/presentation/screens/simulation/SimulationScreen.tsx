import {StyleSheet, ScrollView, RefreshControl, Alert} from 'react-native';
import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import {scheduleNotification} from '../../../config/helpers/scheduleNotification'; // Asegúrate de que cancelNotification esté exportado
import {useEffect, useState, Fragment} from 'react';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {MMKV} from 'react-native-mmkv';
import {useIsFocused} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';
import {MyIcon} from '../../components/ui/MyIcon';
import {
  deleteScheduledNotification,
  getScheduledNotifications,
} from '../../../core/services/storeScheduledNotification ';
import {DisplayedNotification} from '@notifee/react-native';
import notifee from '@notifee/react-native';

type SimulationScreenNavigationProp = StackNavigationProp<
  RootStackParams,
  'SimulationScreen'
>;

interface Props {
  navigation: SimulationScreenNavigationProp;
}

interface Notification {
  subtitle: string;
  id: string;
  title: string;
  message: string;
  body: string;
  date: Date;
  simulationId: string; // Asegúrate de que sea solo un string
}

export const SimulationScreen = ({navigation}: Props) => {
  const isFocused = useIsFocused();
  const storage = new MMKV(); // Crear la instancia de almacenamiento
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
    }
  };

  const loadSimulations = () => {
    const storedSimulations = storage.getString('simulations');
    if (storedSimulations) {
      setSimulations(JSON.parse(storedSimulations));
    }
  };

  const loadNotifications = async () => {
    try {
      const allNotifications: DisplayedNotification[] =
        await notifee.getDisplayedNotifications();
      const mappedNotifications: Notification[] = allNotifications.map(
        notif => {
          const date = notif.date // Cambia esto a la propiedad correcta
            ? new Date(notif.date) // Asegúrate de que esta propiedad tenga la fecha correcta
            : new Date();

          return {
            id: notif.id || '',
            title: notif.notification?.title || 'Título no disponible',
            subtitle: notif.notification?.subtitle || 'Título no disponible',
            message: notif.notification?.body || 'Mensaje no disponible',
            body: notif.notification?.body || 'Cuerpo no disponible',
            date, // Usa la variable `date` aquí
            simulationId: String(
              notif.notification?.data?.simulationId || 'default',
            ), // Convertir a string
          };
        },
      );

      // Cargar notificaciones programadas
      const scheduledNotifications = await getScheduledNotifications();
      const allLoadedNotifications = [
        ...mappedNotifications,
        ...scheduledNotifications.map(notification => ({
          id: notification.id || '',
          title: notification.title || 'Título no disponible',
          subtitle: notification.subtitle || 'Título no disponible',
          message: notification.body || 'Mensaje no disponible',
          body: notification.body || 'Cuerpo no disponible',
          date: new Date(notification.date), // Asegúrate de incluir la fecha
          simulationId: String(notification.simulationId || 'default'), // Convertir a string
        })),
      ];

      setNotifications(allLoadedNotifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const deleteSimulationById = async (simulationId: string) => {
    // Actualiza las simulaciones
    setSimulations(prevSimulations => {
      const updatedSimulations = prevSimulations.filter(
        sim => sim.id !== simulationId,
      );

      // Obtiene las notificaciones asociadas a la simulación
      const notificationsToDelete = notifications.filter(
        notification => notification.simulationId === simulationId,
      );

      // Cancela y elimina las notificaciones asociadas
      const cancelPromises = notificationsToDelete.map(async notification => {
        await notifee.cancelNotification(notification.id); // Cancelar notificación de Notifee
        console.log(
          `Notificación eliminada de Notifee con ID: ${notification.id}`,
        );
        await deleteScheduledNotification(notification.id); // Aquí asumo que tienes una función similar para MMKV
      });

      // Espera a que todas las notificaciones sean canceladas
      Promise.all(cancelPromises)
        .then(() => {
          // Filtra las notificaciones que no están asociadas a la simulación eliminada
          const updatedNotifications = notifications.filter(
            notification => notification.simulationId !== simulationId,
          );

          // Actualiza el almacenamiento con la nueva lista de simulaciones
          storage.set('simulations', JSON.stringify(updatedSimulations));

          // Actualiza el almacenamiento con la nueva lista de notificaciones
          storage.set('notifications', JSON.stringify(updatedNotifications));

          // Actualiza el estado de las notificaciones
          setNotifications(updatedNotifications);
        })
        .catch(error => {
          console.error('Error al cancelar notificaciones:', error);
        });

      return updatedSimulations;
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      loadNotifications(); // Cargar notificaciones cada vez que la pantalla está enfocada
    }
  }, [isFocused]);

  // Función para manejar las acciones (ver o eliminar)
  const handleAction = (action: 'view' | 'delete', simulation: Simulation) => {
    if (action === 'view') {
      navigation.navigate('SimulationDetails', {
        simulation: simulation,
      });
    } else if (action === 'delete') {
      // Confirmar antes de eliminar
      Alert.alert(
        'Eliminar Simulación',
        '¿Estás seguro de que quieres eliminar esta simulación?',
        [
          {text: 'Cancelar', style: 'cancel'},
          {
            text: 'Eliminar',
            onPress: () => deleteSimulationById(simulation.id),
            style: 'destructive',
          },
        ],
        {cancelable: true},
      );
    }
  };

  // Llamar la función para cargar las simulaciones cuando la pantalla está enfocada
  useEffect(() => {
    loadSimulations();
  }, [isFocused]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Layout style={styles.container}>
        <Layout style={styles.tableContainer}>
          <Layout style={[styles.tableRow, styles.header]}>
            <Text style={[styles.tableHeader, {flex: 1}]}>Nombre</Text>
            <Text style={[styles.tableHeader, {flex: 1}]}>Fecha</Text>
            <Text style={[styles.tableHeader, {flex: 1, marginRight: 4}]}>
              Acciones
            </Text>
          </Layout>
          <Divider />
          {simulations.length === 0 ? (
            <Text>No hay simulaciones guardadas.</Text>
          ) : (
            simulations.map((sim, index) => (
              <Fragment key={sim.id}>
                <Layout
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? null : styles.rowColor,
                  ]}>
                  <Text style={[styles.tableCell, {flex: 1}]}>
                    {sim.nombre}
                  </Text>
                  <Text style={[styles.tableCell, {flex: 1}]}>
                    {new Date(sim.date).toLocaleDateString()}
                  </Text>
                  <Layout
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      height: 'auto',
                      flex: 1,
                    }}>
                    <Button
                      style={[styles.tableCell, {flex: 1, marginRight: 4}]}
                      size="tiny"
                      onPress={() => handleAction('view', sim)}>
                      <MyIcon name="eye" white />
                    </Button>
                    <Button
                      style={[styles.tableCell, {flex: 1, marginRight: 4}]}
                      size="tiny"
                      status="danger"
                      onPress={() => handleAction('delete', sim)}>
                      <MyIcon name="trash" white />
                    </Button>
                  </Layout>
                </Layout>
                <Divider />
              </Fragment>
            ))
          )}
        </Layout>

        <Layout style={{height: 40}} />
        <Button onPress={handleScheduleNotification}>
          Programar Notificación
        </Button>
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  container: {
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 6,
  },
  modalText: {
    color: 'white',
  },
  contBtn: {
    paddingVertical: 20,
  },
  btnGuardar: {width: 210, alignSelf: 'center'},
  tableContainer: {},
  header: {
    paddingVertical: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  rowColor: {
    backgroundColor: 'rgba(128, 128, 128, 0.025)',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 8,
    display: 'flex',
    gap: 4,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'center',
  },
  tableCell: {
    flex: 2,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
