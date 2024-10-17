import {
  Button,
  IndexPath,
  Input,
  Modal,
  Select,
  SelectItem,
  Spinner,
  Text,
} from '@ui-kitten/components';
import {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useCurrencyInput} from '../../hooks/useCurrencyInput';
import {
  AmortizationEntry,
  Interest,
  InterestData,
  Periodicity,
  PeriodicityData,
  SimulationData,
} from '../../../core/entities/simulatorEntities';
import {calculateAmortizationEA} from '../../../config/helpers/calculateAmortizationEA';
import {calculateAmortizationMonthly} from '../../../config/helpers/calculateAmortizationMonthly';
import {calculateAmortizationNominal} from '../../../config/helpers/calculateAmortizationNominal';
import {AmortizationTable} from '../../components/Amortizationtable';
import {formatAsCurrency} from '../../../config/helpers/formatAsCurrency';

// Custom hook para el manejo de amortización
const useAmortization = () => {
  const [amortizationData, setAmortizationData] = useState<AmortizationEntry[]>(
    [],
  );
  const [dataSimulated, setDataSimulated] = useState<SimulationData>();
  const [isComputing, setIsComputing] = useState(false);

  const calculate = (
    amount: number,
    interestRate: number,
    duration: number,
    periodicity: Periodicity,
    rateType: Interest,
  ) => {
    setIsComputing(true);
    let entries;

    switch (rateType) {
      case 'Mensual':
        entries = calculateAmortizationMonthly(
          amount,
          interestRate,
          duration,
          periodicity,
        );
        break;
      case 'Efectivo Anual':
        entries = calculateAmortizationEA(
          amount,
          interestRate,
          duration,
          periodicity,
        );
        break;
      case 'Nominal Anual':
        entries = calculateAmortizationNominal(
          amount,
          interestRate,
          duration,
          periodicity,
        );
        break;
      default:
        console.error('Tipo de interés no válido');
        setIsComputing(false);
        return;
    }

    setAmortizationData(entries);
    setDataSimulated({
      value: amount.toString(),
      interest: interestRate.toString(),
      duration: duration.toString(),
      periodicity,
      interestRate: rateType,
    });
    setIsComputing(false);
  };

  return {amortizationData, dataSimulated, isComputing, calculate};
};

export const HomeScreen = () => {
  const {value: amount, onChange: setAmount} = useCurrencyInput();
  const [interest, setInterest] = useState('');
  const [duration, setDuration] = useState('');
  const [periodicity, setPeriodicity] = useState<Periodicity>('Mensual');
  const [indexPeriodicity, setIndexPeriodicity] = useState<IndexPath>(
    new IndexPath(0),
  );
  const [interestRate, setInterestRate] = useState<Interest>('Mensual');
  const [indexInterest, setIndexInterest] = useState<IndexPath>(
    new IndexPath(0),
  );

  // Nuevo estado para la cuota calculada
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const isValidForm =
    interest.length > 0 && duration.length > 0 && periodicity.length > 0;

  const {amortizationData, dataSimulated, isComputing, calculate} =
    useAmortization();

  const handleCalculateAmortization = () => {
    const P0 = parseFloat(amount.replace(/,/g, '')); // Monto del crédito
    const tasaInteres = parseFloat(interest) / 100; // Tasa de interés
    const nPeriodos = parseInt(duration, 10); // Número de periodos del préstamo

    calculate(P0, tasaInteres, nPeriodos, periodicity, interestRate);
  };

  const calculatePayment = () => {
    const P0 = parseFloat(amount.replace(/,/g, '')); // Monto del préstamo
    const tasaInteresMensual = parseFloat(interest) / 100; // Tasa de interés mensual en decimal
    const nPeriodos = parseInt(duration, 10); // Número de períodos

    if (!isNaN(P0) && !isNaN(tasaInteresMensual) && !isNaN(nPeriodos)) {
      let tasaPorPeriodo = 0; // Tasa ajustada por periodo
      let numCuotas = nPeriodos; // Número de pagos ajustados

      // Ajustar tasa y número de periodos según la periodicidad seleccionada
      switch (periodicity) {
        case 'Diaria':
          tasaPorPeriodo = Math.pow(1 + tasaInteresMensual, 1 / 30) - 1; // Tasa diaria
          numCuotas = nPeriodos; // Duración en días
          break;
        case 'Semanal':
          tasaPorPeriodo = Math.pow(1 + tasaInteresMensual, 1 / 4) - 1; // Tasa semanal
          numCuotas = nPeriodos; // Duración en semanas
          break;
        case 'Quincenal':
          tasaPorPeriodo = Math.pow(1 + tasaInteresMensual, 1 / 2) - 1; // Tasa quincenal
          numCuotas = nPeriodos * 2; // Ajuste de duración en quincenas
          break;
        case 'Mensual':
          tasaPorPeriodo = tasaInteresMensual; // Usar tasa mensual directamente
          numCuotas = nPeriodos; // Duración en meses
          break;
        case 'Anual':
          tasaPorPeriodo = Math.pow(1 + tasaInteresMensual, 12) - 1; // Tasa anual
          numCuotas = nPeriodos / 12; // Duración en años
          break;
        default:
          console.error('Periodicidad no válida');
          return;
      }

      // Aplicar fórmula de cálculo de pago usando la fórmula de anualidades
      // C = (P * r) / (1 - (1 + r)^-n)
      const C =
        (P0 * tasaPorPeriodo) / (1 - Math.pow(1 + tasaPorPeriodo, -numCuotas));

      // Asignar el valor calculado a la variable que almacena el pago
      setMonthlyPayment(parseFloat(C.toFixed(2))); // Redondear a 2 decimales
    } else {
      setMonthlyPayment(null);
    }
  };

  useEffect(() => {
    calculatePayment();
  }, [amount, interest, duration, interestRate, periodicity]);

  const renderOption = (title: string) => (
    <SelectItem key={title} title={title} />
  );

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="always">
        <Modal
          visible={isComputing}
          backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <Spinner status="info" size="large" />
        </Modal>

        <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
          <Text category="h5" style={{alignSelf: 'center', paddingBottom: 10}}>
            Simulador de crédito
          </Text>
          <Text style={styles.label}>Monto del Crédito ($)</Text>
          <Input
            keyboardType="numeric"
            placeholder="Ingresa el monto"
            value={amount}
            onChangeText={setAmount}
            style={{borderBottomWidth: 1, marginBottom: 20}}
          />

          <Text style={styles.label}>Tasa de Interés (%)</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={{flex: 4}}>
              <Select
                selectedIndex={indexInterest}
                value={interestRate}
                onSelect={(index: IndexPath | IndexPath[]) => {
                  let selectedIndex: IndexPath;

                  // Maneja el caso cuando es un array de IndexPath[]
                  if (Array.isArray(index)) {
                    selectedIndex = index[0]; // Selecciona el primer índice
                  } else {
                    selectedIndex = index; // Es un solo IndexPath
                  }

                  setIndexInterest(selectedIndex);
                  setInterestRate(InterestData[selectedIndex.row]);
                }}
                style={{marginBottom: 20}}>
                {InterestData.map(renderOption)}
              </Select>
            </View>
            <View style={{flex: 5}}>
              <Input
                keyboardType="numeric"
                placeholder="Interés %"
                value={interest}
                onChangeText={setInterest}
                style={{borderBottomWidth: 1, marginBottom: 20}}
              />
            </View>
          </View>

          <Text style={styles.label}>Plazo del préstamo</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={{flex: 4}}>
              <Select
                selectedIndex={indexPeriodicity}
                value={periodicity}
                onSelect={(index: IndexPath | IndexPath[]) => {
                  let selectedIndex: IndexPath;

                  // Maneja el caso cuando es un array de IndexPath[]
                  if (Array.isArray(index)) {
                    selectedIndex = index[0]; // Selecciona el primer índice
                  } else {
                    selectedIndex = index; // Es un solo IndexPath
                  }

                  setIndexPeriodicity(selectedIndex);
                  setPeriodicity(PeriodicityData[selectedIndex.row]);
                }}
                style={{marginBottom: 20}}>
                {PeriodicityData.map(renderOption)}
              </Select>
            </View>
            <View style={{flex: 5}}>
              <Input
                keyboardType="numeric"
                placeholder="Duración"
                value={duration}
                onChangeText={setDuration}
                style={{borderBottomWidth: 1, marginBottom: 20}}
              />
            </View>
          </View>

          {/* Mostrar la cuota calculada */}
          <Text style={[styles.label, {textAlign: 'center', fontSize: 16}]}>
            Cuota Aproximada:
          </Text>
          <Text style={[styles.label, {textAlign: 'center', fontSize: 20}]}>
            {monthlyPayment
              ? `${formatAsCurrency(monthlyPayment)}`
              : 'Ingrese los datos'}
          </Text>

          <Button
            style={styles.btnCalculate}
            disabled={!isValidForm}
            onPress={handleCalculateAmortization}>
            Calcular Amortización
          </Button>

          <View style={{height: 20}} />

          {dataSimulated && (
            <AmortizationTable
              data={amortizationData}
              isNew={false}
              simulationData={dataSimulated}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
  },
  btnCalculate: {
    marginTop: 20,
  },
});
