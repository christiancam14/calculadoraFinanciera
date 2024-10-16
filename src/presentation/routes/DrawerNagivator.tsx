import {createDrawerNavigator} from '@react-navigation/drawer';
import {RootStackParams, StackNavigator} from './StackNavigator';
import {useColorScheme} from 'react-native';
import * as eva from '@eva-design/eva';
import {HomeScreen} from '../screens/home/HomeScreen';
import {ConversionScreen} from '../screens/conversion/ConversionScreen';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Button} from '@ui-kitten/components';
import {MyIcon} from '../components/ui/MyIcon';
import {useModal} from '../../core/providers/ModalProvider';
import {NotificationsScreen} from '../screens/notification/NotificationsScreen';
import {StoredDataScreen} from '../screens/db/dbScreen';

const Drawer = createDrawerNavigator();

export const DrawerNagivator = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const {toggleModal} = useModal();
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
      <Drawer.Screen name="Calculadora de créditos" component={HomeScreen} />
      <Drawer.Screen
        name="StackNavigator "
        component={StackNavigator}
        options={() => ({
          title: 'Créditos simulados',
          headerRight: () => {
            const currentRoute = (navigation as any).getCurrentRoute();
            if (currentRoute.name === 'SimulationDetails') {
              return (
                <Button
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  onPress={toggleModal}>
                  {/* Llama a toggleModal aquí */}
                  <MyIcon name="calendar-outline" color="white" />
                </Button>
              );
            }
            return null; // No mostrar nada si no es la SimulationScreen
          },
        })}
      />
      <Drawer.Screen name="Conversion de tasas" component={ConversionScreen} />
      <Drawer.Screen name="Notificaciones" component={NotificationsScreen} />
      <Drawer.Screen name="DB" component={StoredDataScreen} />
      {/* <Drawer.Screen name="SimulationDetails" component={StackNavigator} /> */}
    </Drawer.Navigator>
  );
};
