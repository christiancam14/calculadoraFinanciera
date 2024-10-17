import {StyleSheet, View} from 'react-native';
import {InputNominalMensual} from '../../components/InputNominalMensual';
import {InputEfectivoAnual} from '../../components/InputEfectivoAnual';
import {InputEfectivoMensual} from '../../components/InputEfectivoMensual';
import {Divider, Layout} from '@ui-kitten/components';

export const ConversionScreen = () => {
  return (
    <View style={styles.container}>
      {/* Input para Tasa Nominal Mensual */}
      <InputNominalMensual />
      <Divider />
      <Layout style={{height: 12}} />
      <InputEfectivoAnual />
      <Divider />
      <Layout style={{height: 12}} />
      <InputEfectivoMensual />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  results: {
    marginBottom: 16,
  },
});
