import {createDrawerNavigator} from '@react-navigation/drawer';
import {HomeScreen} from '../screens/home/HomeScreen';

const Drawer = createDrawerNavigator();

export const DrawerNagivator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};
