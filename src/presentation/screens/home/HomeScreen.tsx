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

  const calculateMonthlyPayment = () => {
    const P0 = parseFloat(amount.replace(/,/g, ''));
    const tasaInteres = parseFloat(interest) / 100;
    const nPeriodos = parseInt(duration, 10);

    if (
      !isNaN(P0) &&
      !isNaN(tasaInteres) &&
      !isNaN(nPeriodos) &&
      duration &&
      interest
    ) {
      let r = 0;
      switch (interestRate) {
        case 'Mensual':
          r = tasaInteres / 12; // Tasa mensual
          break;
        case 'Efectivo Anual':
          r = tasaInteres / 1; // Tasa anual (como mensual)
          break;
        case 'Nominal Anual':
          r = tasaInteres / 12; // Tasa nominal anual como mensual
          break;
        default:
          console.error('Tipo de interés no válido');
          return;
      }
      const C =
        (P0 * (r * Math.pow(1 + r, nPeriodos))) /
        (Math.pow(1 + r, nPeriodos) - 1);
      setMonthlyPayment(C);
    } else {
      setMonthlyPayment(null);
    }
  };

  useEffect(() => {
    calculateMonthlyPayment();
  }, [amount, interest, duration, interestRate]); // Calcular cuota cuando cambien estos valores

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
