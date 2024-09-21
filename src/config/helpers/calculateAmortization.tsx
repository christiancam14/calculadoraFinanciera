import { AmortizationEntry } from '../../core/entities/simulatorEntities';
import { formatAsCurrency } from '../../config/helpers/formatAsCurrency';

export const calculateAmortizationEA = (
  amount: number,
  interestRate: number,
  duration: number,
): AmortizationEntry[] => {
  const r = Math.pow(1 + interestRate, 1 / 12) - 1; // Asumiendo que interestRate ya es decimal
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
      cuota: formatAsCurrency(cuota), // Formatear aquí
      interes: formatAsCurrency(interes), // Formatear aquí
      principal: formatAsCurrency(principal), // Formatear aquí
      saldo: formatAsCurrency(saldo < 0 ? 0 : saldo), // Formatear aquí
    });
  }

  return amortizationEntries;
};
