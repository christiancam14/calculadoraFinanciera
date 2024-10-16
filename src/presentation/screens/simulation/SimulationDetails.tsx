import {NavigationProp, RouteProp} from '@react-navigation/native';
import {StyleSheet, Text, ScrollView, useColorScheme} from 'react-native';
import {Simulation} from '../../../core/entities/simulatorEntities';
import {Button, Layout, Modal} from '@ui-kitten/components';
import {AmortizationTable} from '../../components/Amortizationtable';
import {MyIcon} from '../../components/ui/MyIcon';
import {useEffect, useState} from 'react';
import {ModalCalendar} from '../../components/modalCalendar';
import * as eva from '@eva-design/eva';
import {useModal} from '../../../core/providers/ModalProvider';

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
  const {simulation} = route.params; // Obteniendo simulation del parámetro
  const {isScheduling, toggleModal} = useModal(); // Uso del contexto
  const [isDeleting, setIsDeleting] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;

  const handleSchedule = (date: Date) => {
    console.log(date);
    toggleModal(); // Llama a toggleModal directamente desde el contexto
  };

  const handleDelete = () => {
    setIsDeleting(prev => !prev); // Solo cambia la visibilidad del modal
  };

  const handleDeleteSimulation = () => {
    navigation.navigate('SimulationScreen', {
      simulationId: simulation.id,
      action: 'delete',
    });
    setIsDeleting(false); // Cierra el modal después de la eliminación
  };

  useEffect(() => {
    const headerRightButton = () => (
      <Button onPress={handleDelete} appearance="ghost">
        Eliminar
      </Button>
    );

    navigation.setOptions({
      headerRight: headerRightButton,
    });
  }, [navigation]);

  useEffect(() => {
    // Efecto para ejecutar la eliminación cuando isDeleting es verdadero
    if (isDeleting) {
      handleDeleteSimulation(); // Ejecuta la función cuando se activa la eliminación
    }
  }, [isDeleting]);

  return (
    <Layout style={styles.container}>
      <Modal
        visible={isScheduling}
        style={styles.modalContainer}
        backdropStyle={styles.backdrop}>
        <ModalCalendar
          handleSchedule={handleSchedule}
          handleToggleModal={toggleModal} // Pasando la función del contexto
        />
      </Modal>
      <Modal
        visible={isDeleting}
        style={styles.modalContainer}
        backdropStyle={styles.backdrop}>
        <Layout
          style={[
            styles.modalContent,
            {
              backgroundColor: theme['color-basic-100'],
            },
          ]}>
          <Text style={styles.modalText}>
            ¿Estás seguro que deseas eliminar esta simulación?
          </Text>
          <Layout style={styles.modalButtons}>
            <Button onPress={handleDelete} style={styles.modalButton}>
              Salir
            </Button>
            <Button
              onPress={() => setIsDeleting(true)}
              style={[styles.modalButton, styles.deleteButton]}>
              Eliminar
            </Button>
          </Layout>
        </Layout>
      </Modal>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{simulation.nombre}</Text>
        <AmortizationTable
          data={simulation.data}
          simulationData={simulation.simulationData}
        />
      </ScrollView>
      <Button style={styles.floatingButtonSchedule} onPress={() => toggleModal}>
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
    right: 20,
    padding: 10,
  },
  modalContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 6,
  },
  modalText: {
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    marginTop: 36,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#DD4B39',
  },
  scrollView: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});
