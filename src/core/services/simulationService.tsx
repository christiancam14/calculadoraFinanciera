import {MMKV} from 'react-native-mmkv';
import {Simulation} from '../entities/simulatorEntities';

export const deleteSimulationById = (
  simulationId: string,
  setSimulations: React.Dispatch<React.SetStateAction<Simulation[]>>,
) => {
  const storage = new MMKV();

  setSimulations(prevSimulations => {
    // Filtra las simulaciones, eliminando la que tiene el ID proporcionado
    const updatedSimulations = prevSimulations.filter(
      sim => sim.id !== simulationId,
    );

    // Guarda las simulaciones actualizadas en el almacenamiento local
    storage.set('simulations', JSON.stringify(updatedSimulations));

    // Retorna las simulaciones actualizadas
    return updatedSimulations;
  });
};
