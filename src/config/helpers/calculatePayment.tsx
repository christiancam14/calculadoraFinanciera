import {Periodicity} from '../../core/entities/simulatorEntities';
import {convertInterestRate} from './convertInterestRate ';

export const calculatePayment = (
  amount: string, // Monto del préstamo
  interest: string, // Tasa de interés ingresada
  duration: string, // Número de períodos (ej: meses)
  periodicity: Periodicity, // Periodicidad seleccionada (ej: 'Mensual', 'Quincenal', etc.)
  rateType: 'Mensual' | 'Efectivo Anual' | 'Nominal Anual', // Tipo de tasa ingresada
): number | null => {
  const P0 = parseFloat(amount.replace(/,/g, '')); // Convertir el monto a número
  const tasaInteresOriginal = parseFloat(interest) / 100; // Tasa de interés ingresada en decimal
  const nPeriodos = parseInt(duration, 10); // Convertir duración a número

  if (!isNaN(P0) && !isNaN(tasaInteresOriginal) && !isNaN(nPeriodos)) {
    let tasaPorPeriodo = 0; // Tasa ajustada por periodo
    let numCuotas = nPeriodos; // Número de pagos ajustados

    // Ajustar la tasa de interés según la periodicidad seleccionada
    tasaPorPeriodo = convertInterestRate(
      rateType,
      tasaInteresOriginal,
      periodicity,
    );

    // Ajustar el número de cuotas dependiendo de la periodicidad
    switch (periodicity) {
      case 'Diaria':
        numCuotas = nPeriodos; // Duración en días
        break;
      case 'Semanal':
        numCuotas = nPeriodos; // Duración en semanas
        break;
      case 'Quincenal':
        numCuotas = nPeriodos * 2; // Ajuste de duración en quincenas
        break;
      case 'Mensual':
        numCuotas = nPeriodos; // Duración en meses
        break;
      case 'Anual':
        numCuotas = nPeriodos / 12; // Duración en años
        break;
      default:
        console.error('Periodicidad no válida');
        return null;
    }

    // Aplicar fórmula de cálculo de pago usando la fórmula de anualidades
    // C = (P * r) / (1 - (1 + r)^-n)
    const C =
      (P0 * tasaPorPeriodo) / (1 - Math.pow(1 + tasaPorPeriodo, -numCuotas));

    return parseFloat(C.toFixed(2)); // Retornar la cuota calculada redondeada a 2 decimales
  } else {
    return null; // Si los valores son inválidos, retornar null
  }
};
