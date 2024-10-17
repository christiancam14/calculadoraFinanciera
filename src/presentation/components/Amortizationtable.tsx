import React, {useState} from 'react';
import {
  Layout,
  Text,
  Divider,
  Button,
  Modal,
  Input,
} from '@ui-kitten/components';
import {StyleSheet, useColorScheme} from 'react-native';
import {
  AmortizationEntry,
  Simulation,
} from '../../core/entities/simulatorEntities';
import {formatAsCurrency} from '../../config/helpers/formatAsCurrency';
import * as eva from '@eva-design/eva';
import {MMKV} from 'react-native-mmkv';

interface SimulationData {
  value: string;
  interest: string;
  duration: string;
  periodicity: string;
  interestRate: string;
}

interface AmortizationTableProps {
  data: AmortizationEntry[];
  simulationData: SimulationData;
  isNew?: boolean;
}

export const AmortizationTable = ({
  data,
  simulationData,
  isNew = true,
}: AmortizationTableProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [nombreSimulacion, setNombreSimulacion] = useState('');

  const storage = new MMKV();

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Text style={{textAlign: 'center'}}>
        Ingresa la información de tu crédito
      </Text>
    );
  }

  console.log({data});

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[$,]/g, ''));
  };

  const totalPrincipal = data.reduce(
    (acc, item) =>
      acc +
      (typeof item.principal === 'number'
        ? item.principal
        : parseCurrency(item.principal)),
    0,
  );
  const totalInterest = data.reduce(
    (acc, item) =>
      acc +
      (typeof item.interes === 'number'
        ? item.interes
        : parseCurrency(item.interes)),
    0,
  );

  const handleModalSave = () => {
    // Lógica de guardado

    setIsSaving(true);
  };

  const handleSave = () => {
    const simulationId = Date.now().toString(); // Genera un ID único usando la fecha actual
    const nuevaSimulacion: Simulation = {
      id: simulationId,
      nombre: nombreSimulacion,
      date: new Date(),
      simulationData: simulationData,
      data: data,
    };

    // Guarda la simulación en MMKV
    // storage.set(simulationId, JSON.stringify(simulationData));
    const storedSimulations = storage.getString('simulations');
    let simulations = storedSimulations ? JSON.parse(storedSimulations) : [];

    // Agregar la nueva simulación
    simulations.push(nuevaSimulacion);

    // Guardar el array actualizado como JSON
    storage.set('simulations', JSON.stringify(simulations));

    setIsSaving(false); // Cierra el modal después de guardar
    setNombreSimulacion(''); // Limpia el campo de nombre
  };

  return (
    <Layout style={{width: '100%'}}>
      <Modal
        visible={isSaving}
        style={styles.modalContainer}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
        <Layout
          style={[
            styles.modalContent,
            {
              backgroundColor:
                colorScheme === 'dark'
                  ? theme['color-basic-800']
                  : theme['color-basic-100'],
            },
          ]}>
          <Text
            style={[
              {
                color: theme['color-basic-color'],
                marginBottom: 12,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 800,
              },
            ]}>
            Guardar Simulación
          </Text>
          <Input
            placeholder="Nombre de tu simulación"
            value={nombreSimulacion}
            onChangeText={setNombreSimulacion}
          />
          <Button
            onPress={handleSave}
            style={{marginTop: 36}}
            disabled={nombreSimulacion.length === 0}>
            Guardar
          </Button>
        </Layout>
      </Modal>
      <Layout style={styles.tableContainer}>
        <Layout
          style={{display: 'flex', flexDirection: 'column', marginBottom: 12}}>
          <Text style={{flex: 1, textAlign: 'center'}}>Monto</Text>
          <Text style={{flex: 1, textAlign: 'center'}}>
            {formatAsCurrency(parseFloat(simulationData.value!))!}
          </Text>
        </Layout>
        <Layout style={{display: 'flex', flexDirection: 'row'}}>
          <Text style={{flex: 1}}>
            Interes: {(parseFloat(simulationData.interest) * 100).toFixed(2)!}%
          </Text>
          <Text style={{flex: 1}}>{simulationData.interestRate!}</Text>
        </Layout>
        <Layout
          style={{display: 'flex', flexDirection: 'row', marginBottom: 12}}>
          <Text style={{flex: 1}}>Cuotas: {simulationData.duration!}</Text>
          <Text style={{flex: 1}}>
            Frecuencia: {simulationData.periodicity!}
          </Text>
        </Layout>

        <Layout style={[styles.tableRow, styles.header]}>
          <Text style={styles.tableHeader}>No.</Text>
          <Text style={[styles.tableHeader, {flex: 4}]}>Capital</Text>
          <Text style={[styles.tableHeader, {flex: 4}]}>Interés</Text>
          <Text style={[styles.tableHeader, {flex: 4}]}>Saldo</Text>
        </Layout>
        <Divider />
        {data.map((item, index) => (
          <React.Fragment key={item.periodo}>
            <Layout
              style={[
                styles.tableRow,
                index % 2 === 0 ? null : styles.rowColor, // Usa null en lugar de cadena vacía
              ]}>
              <Text style={styles.tableCell}>{item.periodo}</Text>
              <Text style={[styles.tableCell, {flex: 4}]}>
                {formatAsCurrency(item.principal)}
              </Text>
              <Text style={[styles.tableCell, {flex: 4}]}>
                {formatAsCurrency(item.interes)}
              </Text>
              <Text style={[styles.tableCell, {flex: 4}]}>
                {formatAsCurrency(item.saldo)}
              </Text>
            </Layout>
            <Divider />
          </React.Fragment>
        ))}
        <Layout style={[styles.tableRow, {marginTop: 10}]}>
          <Text style={[styles.tableCell, {fontWeight: '900'}]}>Total</Text>
          <Text style={[styles.tableCell, {flex: 4}]}>
            {formatAsCurrency(totalPrincipal)}
          </Text>
          <Text style={[styles.tableCell, {flex: 4}]}>
            {formatAsCurrency(totalInterest)}
          </Text>
          <Text style={[styles.tableCell, {flex: 4}]}>
            {formatAsCurrency(totalPrincipal + totalInterest)}
          </Text>
        </Layout>
      </Layout>
      <Layout style={[styles.contBtn, isNew ? styles.toggleBtn : null]}>
        <Button onPress={handleModalSave} style={styles.btnGuardar}>
          Guardar Simulación
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  toggleBtn: {
    display: 'none',
  },
  modalContainer: {
    width: '100%',
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 6,
  },
  modalText: {
    color: 'white',
  },
  contBtn: {
    paddingVertical: 20,
  },
  btnGuardar: {width: 210, alignSelf: 'center'},
  tableContainer: {},
  header: {
    paddingVertical: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  rowColor: {
    backgroundColor: 'rgba(128, 128, 128, 0.025)',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    display: 'flex',
    gap: 4,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'center',
  },
  tableCell: {
    flex: 2,
    textAlign: 'center',
  },
});
