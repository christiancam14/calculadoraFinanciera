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
      <Text>Fechas</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </>
  );
};
