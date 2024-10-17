import {Interest, Periodicity} from '../../core/entities/simulatorEntities';
import {
  convertNominalToEfectivaAnual,
  convertEfectivoAnualToNominalMensual,
} from './rateConver';

// Mapa de conversiones de periodicidad
const periodicityMap: Record<Periodicity, number> = {
  Diaria: 30, // 30 días en un mes
  Semanal: 4.345, // Aproximadamente 4.345 semanas en un mes
  Quincenal: 2, // 2 quincenas en un mes
  Mensual: 1, // Tasa mensual es directa
  Anual: 1 / 12, // Un año es 12 veces un mes
};

// Helper para convertir tasas según el tipo de interés
export const convertInterestRate = (
  rateType: Interest,
  interestRate: number,
  periodicity: Periodicity,
): number => {
  let tasaMensual: number;

  switch (rateType) {
    case 'Mensual':
      tasaMensual = interestRate; // Tasa mensual directamente
      break;
    case 'Efectivo Anual':
      tasaMensual = convertEfectivoAnualToNominalMensual(interestRate); // Convertir efectivo anual a mensual
      break;
    case 'Nominal Anual':
      const efectivaAnual = convertNominalToEfectivaAnual(interestRate); // Convertir nominal anual a efectiva anual
      tasaMensual = convertEfectivoAnualToNominalMensual(efectivaAnual); // Convertir efectiva anual a mensual
      break;
    default:
      throw new Error('Tipo de interés no válido');
  }

  // Convertir tasa mensual a la periodicidad deseada
  const conversionFactor = periodicityMap[periodicity];
  if (!conversionFactor) {
    throw new Error('Periodicidad no válida');
  }

  return Math.pow(1 + tasaMensual, 1 / conversionFactor) - 1; // Aplicar la fórmula de conversión
};
