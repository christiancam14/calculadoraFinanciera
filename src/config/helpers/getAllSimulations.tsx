import {Simulation} from '../../core/entities/simulatorEntities';
import {MMKV} from 'react-native-mmkv';

export const getAllSimulations = () => {
  const storage = new MMKV();

  const simulations: Simulation[] = [];
  // Itera sobre todas las claves en MMKV
  storage.getAllKeys().forEach(key => {
    const simulationData = storage.getString(key);
    if (simulationData) {
      simulations.push(JSON.parse(simulationData));
    }
  });
  return simulations;
};
