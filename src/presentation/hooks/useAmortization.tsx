import {useState} from 'react';
import {
  AmortizationEntry,
  Interest,
  Periodicity,
  SimulationData,
} from '../../core/entities/simulatorEntities';
import {calculateAmortization} from '../../config/helpers/calculateAmortization';

export const useAmortization = () => {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(
    null,
  );
  const [amortizationData, setAmortizationData] = useState<AmortizationEntry[]>(
    [],
  );
  const [isComputing, setIsComputing] = useState(false);

  const calculate = (
    amount: number,
    interestRate: number,
    duration: number,
    periodicity: Periodicity,
    rateType: Interest,
  ) => {
    setIsComputing(true);
    try {
      const entries = calculateAmortization(
        amount,
        interestRate,
        duration,
        periodicity,
        rateType,
      );
      setAmortizationData(entries);

      setSimulationData({
        value: amount.toString(),
        interest: interestRate.toString(),
        duration: duration.toString(),
        periodicity,
        interestRate: rateType,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsComputing(false);
    }
  };

  return {amortizationData, simulationData, isComputing, calculate};
};
