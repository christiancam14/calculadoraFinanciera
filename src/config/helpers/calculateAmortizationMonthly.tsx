import {
  AmortizationEntry,
  Periodicity,
} from '../../core/entities/simulatorEntities';
import {formatAsCurrency} from '../../config/helpers/formatAsCurrency';

const getPeriodsPerYear = (periodicity: Periodicity): number => {
  switch (periodicity) {
    case 'Diaria':
      return 360;
    case 'Semanal':
      return 52;
    case 'Quincenal':
      return 26;
    case 'Mensual':
      return 12;
    case 'Anual':
      return 1;
    default:
      throw new Error('Invalid periodicity');
  }
};

export const calculateAmortizationMonthly = (
  amount: number,
  interestRate: number, // Tasa de interés mensual en decimal
  duration: number, // Duración en meses
  periodicity: Periodicity,
): AmortizationEntry[] => {
  const periodsPerYear = getPeriodsPerYear(periodicity);
  const totalPayments = (duration * periodsPerYear) / 12; // Convertir la duración a pagos totales

  // Ajuste para la tasa de interés quincenal
  const r = interestRate / 2; // Dividir entre 2 para quincenal
  const cuota =
    (amount * r * Math.pow(1 + r, totalPayments)) /
    (Math.pow(1 + r, totalPayments) - 1);

  let saldo = amount;
  const amortizationEntries: AmortizationEntry[] = [];

  for (let i = 1; i <= totalPayments; i++) {
    const interes = saldo * r;
    const principal = cuota - interes;
    saldo -= principal;

    amortizationEntries.push({
      periodo: i,
      cuota: formatAsCurrency(cuota),
      interes: formatAsCurrency(interes),
      principal: formatAsCurrency(principal),
      saldo: formatAsCurrency(saldo < 0 ? 0 : saldo),
    });
  }

  return amortizationEntries;
};
