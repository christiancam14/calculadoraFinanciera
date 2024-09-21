import 'react-native-gesture-handler';

import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {DrawerNagivator} from './presentation/routes/DrawerNagivator';
import {useEffect} from 'react';
import notifee from '@notifee/react-native';

export const simulatorApp = () => {
  useEffect(() => {
    // Solicitar permiso para enviar notificaciones
    async function requestUserPermission() {
      const authStatus = await notifee.requestPermission();
      if (authStatus.authorizationStatus !== 1) {
        console.log('Permission not granted');
      }
    }

    requestUserPermission();
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
