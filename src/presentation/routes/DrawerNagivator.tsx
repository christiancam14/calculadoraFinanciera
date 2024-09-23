import {createDrawerNavigator} from '@react-navigation/drawer';
import {StackNavigator} from './StackNavigator';
import {useColorScheme} from 'react-native';
import * as eva from '@eva-design/eva';
import {HomeScreen} from '../screens/home/HomeScreen';
import {ConversionScreen} from '../screens/conversion/ConversionScreen';
import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export const DrawerNagivator = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  // const navigationRef = useNavigationContainerRef();

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
      <Drawer.Screen name="Simulador" component={HomeScreen} />
      <Drawer.Screen
        name="StackNavigator "
        component={StackNavigator}
        options={() => ({
          title: 'Simulación',
          headerRight: () => {
            console.log(navigation);
            // Mostrar el botón solo si la ruta actual es SimulationScreen
            return null; // No mostrar nada si no es la SimulationScreen
          },
        })}
      />
      <Drawer.Screen name="Conversion de tasas" component={ConversionScreen} />
      {/* <Drawer.Screen name="SimulationDetails" component={StackNavigator} /> */}
    </Drawer.Navigator>
  );
};
