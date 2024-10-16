import React, {useEffect, useState, useMemo} from 'react';
import {ScrollView, RefreshControl, Alert} from 'react-native';
import {Layout, Text, Button, Divider} from '@ui-kitten/components';
import notifee, {DisplayedNotification} from '@notifee/react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  deleteScheduledNotification,
  getScheduledNotifications,
} from '../../../core/services/storeScheduledNotification';

interface Notification {
  subtitle: string;
  id: string;
  title: string;
  message: string;
  body: string;
  date: Date;
  simulationId: string;
}

const useNotifications = (isFocused: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const allNotifications: DisplayedNotification[] =
        await notifee.getDisplayedNotifications();

      const mappedNotifications: Notification[] = allNotifications.map(
        notif => {
          // Verificamos si scheduledTime es un string o un número antes de convertirlo a Date
          const scheduledTime = notif.notification?.data?.scheduledTime;
          const displayDate =
            typeof scheduledTime === 'string' ||
            typeof scheduledTime === 'number'
              ? new Date(scheduledTime)
              : new Date(); // Fallback a la fecha actual si no es válida

          return {
            id: notif.id || '',
            title: notif.notification?.title || 'Título no disponible',
            subtitle: notif.notification?.subtitle || 'Subtítulo no disponible',
            message: notif.notification?.body || 'Mensaje no disponible',
            body: notif.notification?.body || 'Cuerpo no disponible',
            date: displayDate, // Usamos la fecha validada
            simulationId: String(
              notif.notification?.data?.simulationId || 'default',
            ),
          };
        },
      );

      const scheduledNotifications = await getScheduledNotifications();
      const allLoadedNotifications = [
        ...mappedNotifications,
        ...scheduledNotifications.map(notification => ({
          id: notification.id || '',
          title: notification.title || 'Título no disponible',
          subtitle: notification.subtitle || 'Subtítulo no disponible',
          message: notification.body || 'Mensaje no disponible',
          body: notification.body || 'Cuerpo no disponible',
          date: new Date(notification.date), // Asegúrate que esta fecha es la correcta
          simulationId: String(notification.simulationId || 'default'),
        })),
      ];

      setNotifications(allLoadedNotifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadNotifications();
    }
  }, [isFocused]);

  return {notifications, loading, loadNotifications, setNotifications};
};

export const NotificationsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const {notifications, loading, loadNotifications, setNotifications} =
    useNotifications(isFocused);

  const groupedNotifications = useMemo(() => {
    return notifications.reduce((acc, notification) => {
      if (!acc[notification.simulationId]) {
        acc[notification.simulationId] = [];
      }
      acc[notification.simulationId].push(notification);
      return acc;
    }, {} as {[key: string]: Notification[]});
  }, [notifications]);

  const deleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Eliminar Notificación',
      '¿Estás seguro de que quieres eliminar esta notificación?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          onPress: async () => {
            setDeletingId(notificationId);
            try {
              await notifee.cancelNotification(notificationId);
              await deleteScheduledNotification(notificationId);
              setNotifications(prevNotifications =>
                prevNotifications.filter(
                  notification => notification.id !== notificationId,
                ),
              );
              await loadNotifications();
            } catch (error) {
              console.error('Error al eliminar la notificación:', error);
            } finally {
              setDeletingId(null);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  return (
    <Layout style={{flex: 1, padding: 16}}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {Object.keys(groupedNotifications).length === 0 ? (
            <Text>No hay notificaciones disponibles.</Text>
          ) : (
            Object.keys(groupedNotifications).map(simulationId => (
              <Layout key={simulationId} style={{marginVertical: 8}}>
                <Text category="h6" style={{marginBottom: 8}}>
                  Simulación: {groupedNotifications[simulationId][0].subtitle}
                </Text>
                {groupedNotifications[simulationId].map(notification => (
                  <Layout
                    key={notification.id}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Layout>
                      <Text>{notification.message}</Text>
                      <Text appearance="hint" style={{marginVertical: 4}}>
                        Fecha: {notification.date.toLocaleDateString()}
                      </Text>
                    </Layout>

                    <Button
                      status="danger"
                      appearance="outline"
                      disabled={deletingId === notification.id}
                      onPress={() => deleteNotification(notification.id)}>
                      Eliminar
                    </Button>
                  </Layout>
                ))}
                <Divider />
              </Layout>
            ))
          )}
        </ScrollView>
      )}
    </Layout>
  );
};
