export type Periodicity =
  | 'Diaria'
  | 'Semanal'
  | 'Quincenal'
  | 'Mensual'
  | 'Anual';

export const PeriodicityData: Periodicity[] = [
  'Diaria',
  'Semanal',
  'Quincenal',
  'Mensual',
  'Anual',
];

export type Interest = 'Mensual' | 'Efectivo Anual' | 'Nominal Anual';

export const InterestData: Interest[] = [
  'Mensual',
  'Efectivo Anual',
  'Nominal Anual',
];

export interface AmortizationEntry {
  periodo: number; // El número del periodo (por ejemplo, el mes o año correspondiente)
  principal: string; // Cantidad de dinero destinada a reducir el capital del préstamo
  interes: string; // Cantidad de dinero pagada en concepto de intereses en el periodo
  saldo: string; // El saldo restante del préstamo después del pago
  cuota: string; // El valor total del pago (cuota) en ese periodo
}

export interface SimulationData {
  value: string;
  interest: string;
  duration: string;
  periodicity: string;
  interestRate: string;
}

export interface Simulation {
  id: string;
  nombre: string;
  date: Date;
  simulationData: SimulationData;
  data: AmortizationEntry[];
}
