import {
  AmortizationEntry,
  Interest,
  Periodicity,
} from '../../core/entities/simulatorEntities';
import {convertInterestRate} from './convertInterestRate ';

export const calculateAmortization = (
  amount: number,
  interestRate: number,
  duration: number,
  periodicity: Periodicity,
  rateType: Interest,
): AmortizationEntry[] => {
  const amortizationEntries: AmortizationEntry[] = [];
  const periodicRate = convertInterestRate(rateType, interestRate, periodicity);

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
