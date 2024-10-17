import {useState, useEffect} from 'react';

export const useCurrencyFormat = (value: number) => {
  const [formattedValue, setFormattedValue] = useState('');

  useEffect(() => {
    if (value !== undefined && value !== null) {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
      setFormattedValue(formatted);
    }
  }, [value]);

  return formattedValue;
};
