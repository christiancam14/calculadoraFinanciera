import React, {useEffect, useState} from 'react';
import {ScrollView, RefreshControl, Alert} from 'react-native';
import {Layout, Text, Button, Divider} from '@ui-kitten/components';
import notifee, {DisplayedNotification} from '@notifee/react-native';
import {getScheduledNotifications} from '../../../core/services/storeScheduledNotification ';

interface Notification {
  subtitle: string;
  id: string;
  title: string;
  message: string;
  body: string;
  simulationId: string; // Asegúrate de que sea solo un string
}

export const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
          simulationId: String(
            notif.notification?.data?.simulationId || 'default',
          ), // Convertir a string
        }),
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
              await notifee.cancelNotification(notificationId);
              loadNotifications(); // Recargar notificaciones después de eliminar
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
    loadNotifications(); // Cargar notificaciones al montar la pantalla
  }, []);

  // Agrupar notificaciones por simulationId
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const {simulationId} = notification;
    if (!acc[simulationId]) {
      acc[simulationId] = [];
    }
    acc[simulationId].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

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
              <Text category="h6">Simulación ID: {simulationId}</Text>
              {groupedNotifications[simulationId].map(notification => (
                <Layout key={notification.id} style={{marginVertical: 4}}>
                  <Text>{notification.subtitle}</Text>
                  <Text>{notification.body}</Text>
                  <Divider />
                  <Button
                    onPress={() => deleteNotification(notification.id)}
                    status="danger">
                    Eliminar
                  </Button>
                </Layout>
              ))}
            </Layout>
          ))
        )}
      </ScrollView>
    </Layout>
  );
};
