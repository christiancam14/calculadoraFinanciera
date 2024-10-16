import {StyleSheet, ScrollView, RefreshControl, Alert} from 'react-native';
import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import {scheduleNotification} from '../../../config/helpers/scheduleNotification';
import {useEffect, useState, Fragment} from 'react';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {MMKV} from 'react-native-mmkv';
import {useIsFocused} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';
import {MyIcon} from '../../components/ui/MyIcon';

import {DisplayedNotification} from '@notifee/react-native';
import notifee from '@notifee/react-native';
import {
  deleteScheduledNotification,
  getScheduledNotifications,
} from '../../../core/services/storeScheduledNotification';

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
  simulationId: string;
}

export const SimulationScreen = ({navigation}: Props) => {
  const isFocused = useIsFocused();
  const storage = new MMKV();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleScheduleNotification = async () => {
    try {
      const scheduleDate = new Date(Date.now() + 5000); // Notificación en 5 segundos
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
        notif => ({
          id: notif.id || '',
          title: notif.notification?.title || 'Título no disponible',
          subtitle: notif.notification?.subtitle || 'Título no disponible',
          message: notif.notification?.body || 'Mensaje no disponible',
          body: notif.notification?.body || 'Cuerpo no disponible',
          date: new Date(notif.date || Date.now()),
          simulationId: String(
            notif.notification?.data?.simulationId || 'default',
          ),
        }),
      );

      const scheduledNotifications = await getScheduledNotifications();
      const allLoadedNotifications = [
        ...mappedNotifications,
        ...scheduledNotifications.map(
          (notification: {
            id: any;
            title: any;
            subtitle: any;
            body: any;
            date: string | number | Date;
            simulationId: any;
          }) => ({
            id: notification.id || '',
            title: notification.title || 'Título no disponible',
            subtitle: notification.subtitle || 'Título no disponible',
            message: notification.body || 'Mensaje no disponible',
            body: notification.body || 'Cuerpo no disponible',
            date: new Date(notification.date),
            simulationId: String(notification.simulationId || 'default'),
          }),
        ),
      ];

      setNotifications(allLoadedNotifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const deleteSimulationById = async (simulationId: string) => {
    setSimulations(prevSimulations => {
      const updatedSimulations = prevSimulations.filter(
        sim => sim.id !== simulationId,
      );
      const notificationsToDelete = notifications.filter(
        notification => notification.simulationId === simulationId,
      );

      const cancelPromises = notificationsToDelete.map(async notification => {
        await notifee.cancelNotification(notification.id);
        console.log(
          `Notificación eliminada de Notifee con ID: ${notification.id}`,
        );
        await deleteScheduledNotification(notification.id);
      });

      Promise.all(cancelPromises)
        .then(() => {
          const updatedNotifications = notifications.filter(
            notification => notification.simulationId !== simulationId,
          );
          storage.set('simulations', JSON.stringify(updatedSimulations));
          storage.set('notifications', JSON.stringify(updatedNotifications));
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
      loadNotifications();
      loadSimulations();
    }
  }, [isFocused]);

  const handleAction = (action: 'view' | 'delete', simulation: Simulation) => {
    if (action === 'view') {
      navigation.navigate('SimulationDetails', {simulation});
    } else if (action === 'delete') {
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
                    index % 2 !== 0 ? styles.rowColor : null,
                  ]}>
                  <Text style={[styles.tableCell, {flex: 1}]}>
                    {sim.nombre}
                  </Text>
                  <Text style={[styles.tableCell, {flex: 1}]}>
                    {new Date(sim.date).toLocaleDateString()}
                  </Text>
                  <Layout style={styles.actionsContainer}>
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
  container: {
    padding: 20,
  },
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
    alignItems: 'center',
    paddingVertical: 8,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 'auto',
    flex: 1,
  },
});
