import {useState} from 'react';
import {
  AmortizationEntry,
  Interest,
  Periodicity,
  SimulationData,
} from '../../core/entities/simulatorEntities';
import {convertInterestRate} from '../../config/helpers/convertInterestRate ';

const calculateAmortization = (
  amount: number,
  interestRate: number,
  duration: number,
  periodicity: Periodicity,
  rateType: Interest,
): AmortizationEntry[] => {
  const amortizationEntries: AmortizationEntry[] = [];
  const periodicRate = convertInterestRate(rateType, interestRate);

  console.log({periodicRate});

  // Cálculo de la cuota fija
  const paymentAmount =
    amount * (periodicRate / (1 - Math.pow(1 + periodicRate, -duration)));

  let balance = amount;

  for (let i = 1; i <= duration; i++) {
    const interestPayment = balance * periodicRate;
    const principalPayment = paymentAmount - interestPayment;

    // Asegúrate de que el saldo no sea negativo
    balance -= principalPayment;
    const remainingBalance = balance < 0 ? 0 : balance; // Evitar que el balance sea negativo

    amortizationEntries.push({
      periodo: i,
      principal: principalPayment,
      interes: interestPayment,
      saldo: remainingBalance, // Corregido de 'balance' a 'saldo' para coincidir con la interfaz
      cuota: paymentAmount, // Añadido para incluir la cuota en cada entrada
    });
  }

  return amortizationEntries;
};

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
