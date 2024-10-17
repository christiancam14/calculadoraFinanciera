import React, {useState, useMemo} from 'react';
import {ScrollView, RefreshControl, Alert} from 'react-native';
import {Layout, Text, Button, Divider} from '@ui-kitten/components';
import notifee from '@notifee/react-native';
import {useIsFocused} from '@react-navigation/native';
import {deleteScheduledNotification} from '../../../core/services/storeScheduledNotification';
import {useNotifications} from '../../hooks/useNotifications';

interface Notification {
  subtitle: string;
  id: string;
  title: string;
  message: string;
  body: string;
  date: Date;
  simulationId: string;
}

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
                <Text category="h6" style={{marginBottom: 8}}>
                  ID: {simulationId}
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
