import 'react-native-gesture-handler';

import {PermissionsAndroid, Platform, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {DrawerNagivator} from './presentation/routes/DrawerNagivator';
import {useEffect} from 'react';

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Permiso de notificaciones',
          message:
            'Esta aplicación necesita permiso para enviarte notificaciones',
          buttonPositive: 'Aceptar',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Error solicitando permisos de notificación', err);
      return false;
    }
  }
  return true;
}

export const simulatorApp = () => {
  useEffect(() => {
    // Llama a la función para solicitar permisos
    requestNotificationPermission().then(granted => {
      if (granted) {
        console.log('Permiso de notificaciones concedido');
        // Aquí puedes agregar cualquier configuración adicional de notificaciones
      } else {
        console.log('Permiso de notificaciones denegado');
      }
    });
  }, []);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;
  const backgroundColor =
    colorScheme === 'dark'
      ? theme['color-basic-800']
      : theme['color-basic-100'];

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <NavigationContainer
          theme={{
            dark: colorScheme === 'dark',
            colors: {
              primary: theme['color-primary-500'],
              background: backgroundColor,
              card: theme['color-basic-100'],
              text: theme['color-basic-color'],
              border: theme['color-basic-800'],
              notification: theme['color-primary-500'],
            },
          }}>
          <DrawerNagivator />
          {/* <StackNavigator /> */}
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
};
