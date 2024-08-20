import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';
import {HomeScreen} from '../screens/home/HomeScreen';
import { SimulationScreen } from '../screens/simulation/SimulationScreen';
import {LoadingScreen} from '../screens/loading/LoadingScreen';

export type RootStackParams = {
  LoadingScreen: undefined;
  HomeScreen: undefined;
  SimulationScreen: {productId: string};
};

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({current}) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{cardStyleInterpolator: fadeAnimation}}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{cardStyleInterpolator: fadeAnimation}}
      />
      <Stack.Screen
        name="SimulationScreen"
        component={SimulationScreen}
        options={{cardStyleInterpolator: fadeAnimation}}
      />
      {/* <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} /> */}
    </Stack.Navigator>
  );
};
