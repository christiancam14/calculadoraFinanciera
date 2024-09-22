/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {simulatorApp} from './src/simulatorApp';
import notifee, {EventType} from '@notifee/react-native';

// Configurar el Background Event Handler de Notifee
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  if (type === EventType.ACTION_PRESS) {
    console.log('Notificación interactuada en segundo plano');
    // Aquí puedes ejecutar lógica específica si se presiona una acción
    if (pressAction.id === 'default') {
      // Acciones específicas de la notificación
      console.log('Presionada acción por defecto');
    }
  }

  // Cancelar la notificación si es necesario
  await notifee.cancelNotification(notification.id);
});

AppRegistry.registerComponent(appName, () => simulatorApp);
