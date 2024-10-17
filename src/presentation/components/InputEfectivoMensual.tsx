import {Input, Text, Layout} from '@ui-kitten/components';
import {useState} from 'react';
import {
  convertEfectivoMensualToEfectivoAnual,
  convertEfectivoMensualToNominalAnual,
  convertEfectivoMensualToNominalMensual,
} from '../../config/helpers/rateConver';
import {globalStyles} from '../styles/styles';

export const InputEfectivoMensual = () => {
  // Estados para los inputs
  const [efectivoMensual, setEfectivoMensual] = useState<string>('');

  // Estados para los resultados
  const [resultEfectivaAnual, setResultEfectivaAnual] = useState<string>('');
  const [resultNominalAnual, setResultNominalAnual] = useState<string>('');
  const [resultNominalMensual, setResultNominalMensual] = useState<string>('');

  const handleEfectivoMensualChange = (value: string) => {
    setEfectivoMensual(value);
    const efectivoMensualValue = parseFloat(value) / 100;
    if (!isNaN(efectivoMensualValue)) {
      setResultEfectivaAnual(
        (
          convertEfectivoMensualToEfectivoAnual(efectivoMensualValue) * 100
        ).toFixed(2),
      );
      setResultNominalMensual(
        (
          convertEfectivoMensualToNominalMensual(efectivoMensualValue) * 100
        ).toFixed(2),
      );
      setResultNominalAnual(
        (
          convertEfectivoMensualToNominalAnual(efectivoMensualValue) * 100
        ).toFixed(2),
      );
    }
  };

  return (
    <>
      {/* Input para Tasa Efectiva Mensual */}
      <Layout style={globalStyles.contTitulo}>
        <Text style={globalStyles.tituloPrincipal}>
          Tasa Efectiva Mensual (%)
        </Text>
        <Input
          style={globalStyles.input}
          keyboardType="numeric"
          placeholder="(%)"
          value={efectivoMensual}
          onChangeText={handleEfectivoMensualChange}
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
            NM%
          </Text>
          <Text style={globalStyles.resultText}>{resultNominalMensual}%</Text>
        </Layout>
      </Layout>
    </>
  );
};
