import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {ScheduledNotification} from '../../core/entities/notificationEntities';

type NotificationDatesListProps = {
  notifications: ScheduledNotification[];
};

export const NotificationDatesList: React.FC<NotificationDatesListProps> = ({
  notifications,
}) => {
  console.log(notifications);

  const renderItem = ({item}: {item: ScheduledNotification}) => (
    <View>
      <Text>
        {item.body} - {item.date.toLocaleDateString()}
      </Text>
      {/* Muestra un mensaje alternativo si item.body no es un string */}
    </View>
  );

  return (
    <>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 16,
          fontWeight: 600,
          marginVertical: 12,
        }}>
        Fechas de pagos
      </Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        style={{marginHorizontal: 'auto'}}
        keyExtractor={item => item.id.toString()}
      />
    </>
  );
};
