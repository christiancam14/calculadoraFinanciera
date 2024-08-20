import { useState } from 'react';
import numeral from 'numeral';


export const useCurrencyInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const handleInputChange = (input: string) => {
    // Eliminar todos los caracteres no numéricos
    const numericValue = input.replace(/[^0-9]/g, '');

    // Formatear el número como moneda
    const formattedValue = numeral(numericValue).format('0,0[.]00');

    setValue(formattedValue);
  };

  return {
    value,
    onChange: handleInputChange,
  };
};
