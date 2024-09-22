import {Input, Layout, Text} from '@ui-kitten/components';
import {useState} from 'react';
import {
  convertEfectivoAnualToNominalAnual,
  convertEfectivoAnualToNominalMensual,
} from '../../config/helpers/rateConver';
import {globalStyles} from '../styles/styles';

export const InputEfectivoAnual = () => {
  // Estados para los inputs
  const [efectivoAnual, setEfectivoAnual] = useState<string>('');

  // Estados para los resultados
  const [resultNominalAnual, setResultNominalAnual] = useState<string>('');
  const [resultNominalMensual, setResultNominalMensual] = useState<string>('');

  const handleEfectivoAnualChange = (value: string) => {
    setEfectivoAnual(value);
    const efectivoAnualValue = parseFloat(value) / 100;
    if (!isNaN(efectivoAnualValue)) {
      setResultNominalMensual(
        (
          convertEfectivoAnualToNominalMensual(efectivoAnualValue) * 100
        ).toFixed(2),
      );
      setResultNominalAnual(
        (convertEfectivoAnualToNominalAnual(efectivoAnualValue) * 100).toFixed(
          2,
        ),
      );
    }
  };

  return (
    <>
      {/* Input para Tasa Efectiva Anual */}
      <Layout style={globalStyles.contTitulo}>
        <Text style={globalStyles.tituloPrincipal}>
          Tasa Efectiva anual (%)
        </Text>
        <Input
          style={globalStyles.input}
          keyboardType="numeric"
          placeholder="(%)"
          value={efectivoAnual}
          onChangeText={handleEfectivoAnualChange}
        />
      </Layout>
      <Layout style={globalStyles.results}>
        <Layout style={globalStyles.resultItem} level="4">
          <Text style={(globalStyles.resultText, globalStyles.resultTitle)}>
            NM%
          </Text>
          <Text style={globalStyles.resultText}>{resultNominalMensual}%</Text>
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
          <Text style={globalStyles.resultText}>{resultNominalMensual}%</Text>
        </Layout>
      </Layout>
    </>
  );
};
