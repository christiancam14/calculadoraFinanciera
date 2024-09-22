import {createDrawerNavigator} from '@react-navigation/drawer';
// import {HomeScreen} from '../screens/home/HomeScreen';
import {StackNavigator} from './StackNavigator';
import {SimulationScreen} from '../screens/simulation/SimulationScreen';
import {useColorScheme} from 'react-native';
import * as eva from '@eva-design/eva';
import {ConversionScreen} from '../screens/conversion/ConversionScreen';

const Drawer = createDrawerNavigator();

export const DrawerNagivator = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;
  const backgroundColor =
    colorScheme === 'dark'
      ? theme['color-basic-800']
      : theme['color-basic-100'];

  const fontColor =
    colorScheme === 'dark'
      ? theme['color-basic-100']
      : theme['color-basic-800'];

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleStyle: {
          color: fontColor,
        },
        headerShadowVisible: true,
      }}>
      <Drawer.Screen name="Simulador" component={StackNavigator} />
      <Drawer.Screen name="Mis simulaciones" component={SimulationScreen} />
      <Drawer.Screen name="Conversión de tasas" component={ConversionScreen} />
    </Drawer.Navigator>
  );
};
