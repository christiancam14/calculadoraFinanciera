import {RouteProp} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {Button, Layout, Modal} from '@ui-kitten/components';
import {AmortizationTable} from '../../components/Amortizationtable';
import {MyIcon} from '../../components/ui/MyIcon';
import {useState} from 'react';
import {ModalCalendar} from '../../components/modalCalendar';

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
  const [isScheduling, setIsScheduling] = useState(false);
  const {simulation} = route.params;

  const handleModal = () => {
    setIsScheduling(prev => !prev);
  };

  const handleSchedule = (date: Date) => {
    console.log(date);
    setIsScheduling(prev => !prev);
  };

  return (
    <Layout style={styles.container}>
      <Modal
        visible={isScheduling}
        style={styles.modalContainer}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        {/* <Layout
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
            style={[
              {
                color: theme['color-basic-color'],
                marginBottom: 12,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 800,
              },
            ]}>
            Agregar recordatorio
          </Text>
          <Button
            onPress={handleSchedule}
            style={{marginTop: 36}}
            disabled={false}>
            Guardar
          </Button>
        </Layout> */}

        <ModalCalendar handleSchedule={handleSchedule} />
      </Modal>
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
      <Button style={styles.floatingButton} onPress={handleModal}>
        {/* Volver */}
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
    bottom: 20,
    right: 20,
    padding: 10,
  },
  toggleBtn: {
    display: 'none',
  },
  modalContainer: {
    width: '100%',
    marginHorizontal: 'auto',
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
  modalText: {
    color: 'white',
  },
  contBtn: {
    paddingVertical: 20,
  },
  btnGuardar: {width: 210, alignSelf: 'center'},
  tableContainer: {},
  header: {
    paddingVertical: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  rowColor: {
    backgroundColor: 'rgba(128, 128, 128, 0.025)',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    display: 'flex',
    gap: 4,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'center',
  },
  tableCell: {
    flex: 2,
    textAlign: 'center',
  },
});
