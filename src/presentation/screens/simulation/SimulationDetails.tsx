import {NavigationProp, RouteProp} from '@react-navigation/native';
import {StyleSheet, Text, ScrollView, useColorScheme} from 'react-native';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {Button, Layout, Modal} from '@ui-kitten/components';
import {AmortizationTable} from '../../components/Amortizationtable';
import {MyIcon} from '../../components/ui/MyIcon';
import {useEffect, useState} from 'react';
import {ModalCalendar} from '../../components/modalCalendar';
import * as eva from '@eva-design/eva';

type RootStackParamList = {
  SimulationDetails: {
    simulation: Simulation;
  };
  SimulationScreen: {
    simulationId: string;
    action: string;
  };
};

type SimulationDetailsRouteProp = RouteProp<
  RootStackParamList,
  'SimulationDetails'
>;

type SimulationDetailsProps = {
  route: SimulationDetailsRouteProp;
  navigation: NavigationProp<RootStackParamList>;
};

export const SimulationDetails = ({
  route,
  navigation,
}: SimulationDetailsProps) => {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {simulation} = route.params;

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;

  const handleModal = () => {
    setIsScheduling(prev => !prev);
  };

  const handleModalDelete = () => {
    setIsDeleting(prev => !prev);
  };

  const handleSchedule = (date: Date) => {
    console.log(date);
    setIsScheduling(prev => !prev);
  };

  const handleDelete = () => {
    navigation.navigate('SimulationScreen', {
      simulationId: simulation.id,
      action: 'delete',
    });
    setIsDeleting(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handleModalDelete} appearance="ghost">
          Eliminar
        </Button>
      ),
    });
  }, [navigation]);

  return (
    <Layout style={styles.container}>
      <Modal
        visible={isScheduling}
        style={styles.modalContainer}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        <ModalCalendar
          handleSchedule={handleSchedule}
          handleToggleModal={() => setIsScheduling(prev => !prev)}
        />
      </Modal>
      <Modal
        visible={isDeleting}
        style={styles.modalContainer}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        <Layout
          style={[
            styles.modalContent,
            {
              backgroundColor:
                colorScheme === 'dark'
                  ? theme['color-basic-800']
                  : theme['color-basic-100'],
            },
          ]}>
          <Text
            style={{
              color: theme['color-basic-color'],
              marginBottom: 12,
              paddingHorizontal: 12,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '800',
            }}>
            ¿Estás seguro que deseas eliminar esta simulación?
          </Text>
          <Layout style={{flexDirection: 'row', gap: 12}}>
            <Button
              onPress={handleModalDelete}
              style={{marginTop: 36, flex: 1}}>
              Salir
            </Button>
            <Button
              onPress={handleDelete}
              style={{marginTop: 36, flex: 1, backgroundColor: '#DD4B39'}}>
              Eliminar
            </Button>
          </Layout>
        </Layout>
      </Modal>
      <ScrollView style={{width: '100%'}}>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            fontWeight: '800',
            marginBottom: 16,
          }}>
          {simulation.nombre}
        </Text>
        <AmortizationTable
          data={simulation.data}
          simulationData={simulation.simulationData}
        />
      </ScrollView>
      <Button style={styles.floatingButton} onPress={handleModalDelete}>
        <MyIcon name="trash-2-outline" color="white" />
      </Button>
      <Button style={styles.floatingButtonSchedule} onPress={handleModal}>
        <MyIcon name="calendar-outline" color="white" />
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
    backgroundColor: '#DD4B39',
    bottom: 20,
    right: 20,
    padding: 10,
  },
  floatingButtonSchedule: {
    position: 'absolute',
    bottom: 20,
    right: 80,
    padding: 10,
  },
  modalContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 6,
  },
});
