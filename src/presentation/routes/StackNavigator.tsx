import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';
import {SimulationScreen} from '../screens/simulation/SimulationScreen';
import {LoadingScreen} from '../screens/loading/LoadingScreen';
import {SimulationDetails} from '../screens/simulation/SimulationDetails';
import {Simulation} from '../../core/entities/simulatorEntities';

export type RootStackParams = {
  LoadingScreen: undefined;
  SimulationScreen: {
    productId: string;
    action: string;
  };
  SimulationDetails: {
    simulation: Simulation;
    toggleModal?: boolean;
  };
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
    <Stack.Navigator
      initialRouteName="SimulationScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{cardStyleInterpolator: fadeAnimation}}
      />
      <Stack.Screen
        name="SimulationScreen"
        component={SimulationScreen}
        options={() => ({
          cardStyleInterpolator: fadeAnimation,
          title: 'Detalle',
        })}
      />
      <Stack.Screen
        name="SimulationDetails"
        component={SimulationDetails}
        options={{cardStyleInterpolator: fadeAnimation, title: 'Detalle'}}
      />
    </Stack.Navigator>
  );
};
