import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import {scheduleNotification} from '../../../config/helpers/scheduleNotification';
import {useEffect, useState, useCallback, Fragment} from 'react';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {MMKV} from 'react-native-mmkv';
import {useIsFocused} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../../routes/StackNavigator';
import {MyIcon} from '../../components/ui/MyIcon';

type SimulationScreenNavigationProp = StackNavigationProp<
  RootStackParams,
  'SimulationScreen'
>;

interface Props {
  navigation: SimulationScreenNavigationProp;
}

export const SimulationScreen = ({navigation}: Props) => {
  const isFocused = useIsFocused();
  const storage = new MMKV(); // Crear la instancia de almacenamiento

  console.log(navigation.getState());

  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleScheduleNotification = async () => {
    try {
      const scheduleDate = new Date();
      scheduleDate.setSeconds(scheduleDate.getSeconds() + 5);

      await scheduleNotification({
        date: scheduleDate,
        notificationSubtitle: 'Recordatorio',
        notificationBody: 'Este es el cuerpo de tu recordatorio',
      });
      console.log('Notificación programada exitosamente.');
    } catch (error) {
      console.error('Error programando la notificación:', error);
    }
  };

  const loadSimulations = () => {
    const storedSimulations = storage.getString('simulations');
    if (storedSimulations) {
      setSimulations(JSON.parse(storedSimulations));
    }
  };

  // Llamar la función para cargar las simulaciones cuando la pantalla está enfocada
  useEffect(() => {
    loadSimulations();
  }, [isFocused]);

  // Función para refrescar la lista de simulaciones
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Aquí puedes agregar lógica para recargar las simulaciones
    loadSimulations();
    setRefreshing(false);
  }, []);

  const handleViewSimulation = (sim: Simulation) => {
    navigation.navigate('SimulationDetails', {simulation: sim});
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Layout style={styles.container}>
        <Layout style={styles.tableContainer}>
          <Layout style={[styles.tableRow, styles.header]}>
            <Text
              style={[
                styles.tableHeader,
                {flex: 1, textAlign: 'center', marginLeft: 4},
              ]}>
              No.
            </Text>
            <Text style={[styles.tableHeader, {flex: 4}]}>Nombre</Text>
            <Text style={[styles.tableHeader, {flex: 4}]}>Fecha</Text>
            <Text style={[styles.tableHeader, {flex: 1, marginRight: 4}]}>
              Ver
            </Text>
          </Layout>
          <Divider />
          {simulations.length === 0 ? (
            <Text>No hay simulaciones guardadas.</Text>
          ) : (
            simulations.map((sim, index) => (
              <Fragment key={sim.id}>
                <Layout
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? null : styles.rowColor,
                  ]}>
                  <Text style={[styles.tableCell, {flex: 1}]}>{index + 1}</Text>
                  <Text style={[styles.tableCell, {flex: 4}]}>
                    {sim.nombre}
                  </Text>
                  <Text style={[styles.tableCell, {flex: 4}]}>
                    {new Date(sim.date).toLocaleDateString()}
                  </Text>
                  <Button
                    style={[styles.tableCell, {flex: 1, marginRight: 4}]}
                    size="tiny"
                    onPress={() => handleViewSimulation(sim)}>
                    <MyIcon name="eye" />
                  </Button>
                </Layout>
                <Divider />
              </Fragment>
            ))
          )}
        </Layout>

        <Layout style={{height: 40}} />
        <Button onPress={handleScheduleNotification}>
          Programar Notificación
        </Button>
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  container: {
    padding: 20,
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
    alignContent: 'center',
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
    alignSelf: 'center',
  },
});
