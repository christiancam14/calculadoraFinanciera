import {
  AmortizationEntry,
  Periodicity,
} from '../../core/entities/simulatorEntities';
import {formatAsCurrency} from '../../config/helpers/formatAsCurrency';

const getEffectiveRate = (
  interestRate: number,
  periodicity: Periodicity,
): number => {
  let periodsPerYear: number;

  switch (periodicity) {
    case 'Diaria':
      periodsPerYear = 360;
      break;
    case 'Semanal':
      periodsPerYear = 52;
      break;
    case 'Quincenal':
      periodsPerYear = 26;
      break;
    case 'Mensual':
      periodsPerYear = 12;
      break;
    case 'Anual':
      periodsPerYear = 1;
      break;
    default:
      throw new Error('Invalid periodicity');
  }

  // Retorna el interés
  return Math.pow(1 + interestRate, 1 / periodsPerYear) - 1;
};

export const calculateAmortizationEA = (
  amount: number,
  interestRate: number,
  duration: number,
  periodicity: Periodicity,
): AmortizationEntry[] => {
  const r = getEffectiveRate(interestRate, periodicity);
  const cuota =
    (amount * r * Math.pow(1 + r, duration)) / (Math.pow(1 + r, duration) - 1);

  let saldo = amount;
  const amortizationEntries: AmortizationEntry[] = [];

  for (let i = 1; i <= duration; i++) {
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
