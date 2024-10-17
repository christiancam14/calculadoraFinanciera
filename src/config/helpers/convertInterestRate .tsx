import {Interest} from '../../core/entities/simulatorEntities';
import {
  convertNominalToEfectivaAnual,
  convertEfectivoAnualToNominalMensual,
} from './rateConver';

// Helper para convertir tasas según el tipo de interés
export const convertInterestRate = (
  rateType: Interest,
  interestRate: number,
): number => {
  console.log(interestRate);
  switch (rateType) {
    case 'Mensual':
      return interestRate; // Retornar la tasa mensual directamente
    case 'Efectivo Anual':
      return convertEfectivoAnualToNominalMensual(interestRate); // Convertir efectivo anual a nominal mensual
    case 'Nominal Anual':
      // Convertir nominal anual a efectivo anual y luego a mensual
      const efectivaAnual = convertNominalToEfectivaAnual(interestRate);
      return convertEfectivoAnualToNominalMensual(efectivaAnual);
    default:
      throw new Error('Tipo de interés no válido');
  }
};
