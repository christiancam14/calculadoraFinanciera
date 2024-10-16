import React, {useEffect, useState} from 'react';
import {ScrollView, RefreshControl, Alert} from 'react-native';
import {Layout, Text, Button, Divider} from '@ui-kitten/components';
import notifee, {DisplayedNotification} from '@notifee/react-native';
import {useIsFocused} from '@react-navigation/native'; // Importa el hook useIsFocused
import {MyIcon} from '../../components/ui/MyIcon';
import {
  getScheduledNotifications,
  deleteScheduledNotification,
} from '../../../core/services/storeScheduledNotification ';

interface Notification {
  subtitle: string;
  id: string;
  title: string;
  message: string;
  body: string;
  date: Date;
  simulationId: string; // Asegúrate de que sea solo un string
}

export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadNotifications = async () => {
    try {
      const allNotifications: DisplayedNotification[] =
        await notifee.getDisplayedNotifications();
      const mappedNotifications: Notification[] = allNotifications.map(
        notif => {
          const date =
            notif.notification && notif.date
              ? new Date(notif.date)
              : new Date(); // Maneja la fecha

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

  const deleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Eliminar Notificación',
      '¿Estás seguro de que quieres eliminar esta notificación?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              // Eliminar de Notifee
              await notifee.cancelNotification(notificationId);
              console.log(
                `Notificación eliminada de Notifee con ID: ${notificationId}`,
              );

              // Eliminar de MMKV
              await deleteScheduledNotification(notificationId);

              // Actualizar estado local
              setNotifications(prevNotifications =>
                prevNotifications.filter(
                  notification => notification.id !== notificationId,
                ),
              );
            } catch (error) {
              console.error('Error al eliminar la notificación:', error);
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

  useEffect(() => {
    if (isFocused) {
      loadNotifications(); // Cargar notificaciones cada vez que la pantalla está enfocada
    }
  }, [isFocused]);

  // Agrupar notificaciones por simulationId
  const groupedNotifications = notifications.reduce((acc, notification) => {
    if (!acc[notification.simulationId]) {
      acc[notification.simulationId] = [];
    }
    acc[notification.simulationId].push(notification);
    return acc;
  }, {} as {[key: string]: Notification[]});

  return (
    <Layout style={{flex: 1, padding: 16}}>
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
              <Text category="h6" style={{marginBottom: 8}}>
                ID: {simulationId}
              </Text>
              <Layout
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  width: '100%',
                  overflow: 'hidden',
                }}>
                {groupedNotifications[simulationId].map(notification => (
                  <Layout
                    key={notification.id}
                    style={{
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}>
                    <Layout style={{flex: 1}}>
                      <Text category="s1">{notification.subtitle}</Text>
                      {/* Mueve el subtítulo aquí */}
                      <Text>{notification.body}</Text>
                      <Text>
                        {notification.date.toLocaleDateString('es-ES')}
                      </Text>
                      {/* Mostrar solo la fecha sin hora */}
                    </Layout>
                    <Button
                      onPress={() => deleteNotification(notification.id)}
                      status="danger">
                      <MyIcon name="trash" white />
                    </Button>
                    <Divider />
                  </Layout>
                ))}
              </Layout>
            </Layout>
          ))
        )}
      </ScrollView>
    </Layout>
  );
};
