import {RouteProp, useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {Button, Layout} from '@ui-kitten/components';
import {AmortizationTable} from '../../components/Amortizationtable';

type RootStackParamList = {
  SimulationDetails: {simulation: Simulation};
};

type SimulationDetailsRouteProp = RouteProp<
  RootStackParamList,
  'SimulationDetails'
>;

export const SimulationDetails = ({
  route,
}: {
  route: SimulationDetailsRouteProp;
}) => {
  const {simulation} = route.params;

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack(); // Navegar a la pantalla anterior
  };
  return (
    <Layout style={styles.container}>
      <ScrollView style={{width: '100%'}}>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 800,
            marginBottom: 16,
          }}>
          {simulation.nombre}
        </Text>
        <AmortizationTable
          data={simulation.data}
          simulationData={simulation.simulationData}
        />
      </ScrollView>
      <Button style={styles.floatingButton} onPress={handleBack}>
        Volver
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },

  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
  },
});
