export type Periodicity = 'Diaria' | 'Semanal' | 'Quincenal' | 'Mensual' | 'Anual';

export const PeriodicityData: Periodicity[] = [
  'Diaria',
  'Semanal',
  'Quincenal',
  'Mensual',
  'Anual',
];

export type Interest = 'Mensual' | 'Efectivo Anual' | 'Nominal Anual';

export const InterestData: Interest[] = ['Mensual', 'Efectivo Anual', 'Nominal Anual'];

export interface AmortizationEntry {
  period: number;
  principal: string;
  interest: string;
  balance: string;
}
