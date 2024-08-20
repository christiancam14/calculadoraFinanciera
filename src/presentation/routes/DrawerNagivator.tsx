import {createDrawerNavigator} from '@react-navigation/drawer';
// import {HomeScreen} from '../screens/home/HomeScreen';
import {StackNavigator} from './StackNavigator';
import {SimulationScreen} from '../screens/simulation/SimulationScreen';

const Drawer = createDrawerNavigator();

export const DrawerNagivator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={StackNavigator} />
      <Drawer.Screen name="SimulationScreen" component={SimulationScreen} />
    </Drawer.Navigator>
  );
};
