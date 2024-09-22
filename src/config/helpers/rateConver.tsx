// Funciones para conversiones
export const convertNominalToEfectivaAnual = (nominal: number) =>
  Math.pow(1 + nominal, 12) - 1;

export const convertNominalToNominalAnual = (nominal: number) => nominal * 12;

export const convertEfectivoAnualToNominalMensual = (efectivoAnual: number) =>
  Math.pow(1 + efectivoAnual, 1 / 12) - 1;

export const convertEfectivoAnualToNominalAnual = (efectivoAnual: number) =>
  (Math.pow(1 + efectivoAnual, 1 / 12) - 1) * 12;

export const convertEfectivoMensualToEfectivoAnual = (
  efectivoMensual: number,
) => Math.pow(1 + efectivoMensual, 12) - 1;

export const convertEfectivoMensualToNominalMensual = (
  efectivoMensual: number,
) => efectivoMensual;

export const convertEfectivoMensualToNominalAnual = (efectivoMensual: number) =>
  efectivoMensual * 12;
