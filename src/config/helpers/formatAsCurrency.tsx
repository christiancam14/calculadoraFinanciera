export const formatAsCurrency = (value: number) => {
  const formatNumber = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // Cambiar a 2 para mostrar dos decimales
    maximumFractionDigits: 0,
  }).format(value);

  return formatNumber;
};
