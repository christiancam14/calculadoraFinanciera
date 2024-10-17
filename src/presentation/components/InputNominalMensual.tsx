import {Input, Layout, Text} from '@ui-kitten/components';
import {useState} from 'react';
import {
  convertNominalToEfectivaAnual,
  convertNominalToNominalAnual,
} from '../../config/helpers/rateConver';
import {globalStyles} from '../styles/styles';

export const InputNominalMensual = () => {
  // Estados para los inputs
  const [nominalMensual, setNominalMensual] = useState<string>('');

  // Estados para los resultados
  const [resultEfectivaAnual, setResultEfectivaAnual] = useState<string>('');
  const [resultNominalAnual, setResultNominalAnual] = useState<string>('');

  // Manejadores de cambio de input
  const handleNominalMensualChange = (value: string) => {
    setNominalMensual(value);
    const nominal = parseFloat(value) / 100;
    if (!isNaN(nominal)) {
      setResultEfectivaAnual(
        (convertNominalToEfectivaAnual(nominal) * 100).toFixed(2),
      );
      setResultNominalAnual(
        (convertNominalToNominalAnual(nominal) * 100).toFixed(2),
      );
    }
  };

  return (
    <>
      {/* Input para Tasa Nominal Mensual */}
      <Layout style={globalStyles.contTitulo}>
        <Text style={globalStyles.tituloPrincipal}>
          Tasa Nominal Mensual (%)
        </Text>
        <Input
          style={globalStyles.input}
          keyboardType="numeric"
          placeholder="(%)"
          value={nominalMensual}
          onChangeText={handleNominalMensualChange}
        />
      </Layout>
      <Layout style={globalStyles.results}>
        <Layout style={globalStyles.resultItem} level="4">
          <Text style={(globalStyles.resultText, globalStyles.resultTitle)}>
            EA%
          </Text>
          <Text style={globalStyles.resultText}>{resultEfectivaAnual}%</Text>
        </Layout>
        <Layout style={globalStyles.resultItem} level="3">
          <Text style={(globalStyles.resultText, globalStyles.resultTitle)}>
            NA%
          </Text>
          <Text style={globalStyles.resultText}>{resultNominalAnual}%</Text>
        </Layout>
        <Layout style={globalStyles.resultItem} level="4">
          <Text style={(globalStyles.resultText, globalStyles.resultTitle)}>
            EM%
          </Text>
          <Text style={globalStyles.resultText}>{nominalMensual || 0}%</Text>
        </Layout>
      </Layout>
    </>
  );
};
