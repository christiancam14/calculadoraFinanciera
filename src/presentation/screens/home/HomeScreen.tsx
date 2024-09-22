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
import {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {AmortizationTable} from '../../components/Amortizationtable';
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

export const HomeScreen = () => {
  // const [amount, setAmount] = useState('');
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
  const [amortizationData, setAmortizationData] = useState<AmortizationEntry[]>(
    [],
  );
  const [isComputing, setIsComputing] = useState(false);

  const [dataSimulated, setDataSimulated] = useState<SimulationData>();

  const isValidForm =
    interest.length > 0 && duration.length > 0 && periodicity.length > 0;

  const handleCalculateAmortization = () => {
    setIsComputing(true);

    // Convertir valores de strings a números
    const P0 = parseFloat(amount.replace(/,/g, '')); // Monto del crédito
    const tasaInteres = parseFloat(interest) / 100; // Tasa de interés
    const nPeriodos = parseInt(duration, 10); // Número de periodos del préstamo

    let entries;

    // Calcular la amortización usando la función externa
    switch (interestRate) {
      case 'Mensual':
        entries = calculateAmortizationMonthly(
          P0,
          tasaInteres,
          nPeriodos,
          periodicity,
        );
        break;
      case 'Efectivo Anual':
        entries = calculateAmortizationEA(
          P0,
          tasaInteres,
          nPeriodos,
          periodicity,
        );
        break;
      case 'Nominal Anual':
        entries = calculateAmortizationNominal(
          P0,
          tasaInteres,
          nPeriodos,
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
      value: amount,
      interest: interest,
      duration: duration,
      periodicity: periodicity,
      interestRate: interestRate,
    });
    setIsComputing(false);
  };

  const renderOption = (title: string) => (
    <SelectItem key={title} title={title} />
  );

  return (
    <>
      <ScrollView>
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
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <View style={{flex: 4}}>
              <Select
                selectedIndex={indexInterest}
                value={interestRate}
                onSelect={(index: IndexPath | IndexPath[]) => {
                  let selectedIndex;
                  if (Array.isArray(index)) {
                    // Maneja el caso cuando es un array de IndexPath[]
                    selectedIndex = index[0];
                    setIndexInterest(selectedIndex); // Solo selecciona el primero en caso de array
                  } else {
                    // Maneja el caso cuando es un solo IndexPath
                    selectedIndex = index;
                    setIndexInterest(selectedIndex);
                  }
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
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <View style={{flex: 4}}>
              <Select
                selectedIndex={indexPeriodicity}
                value={periodicity}
                onSelect={(index: IndexPath | IndexPath[]) => {
                  let selectedIndex;
                  if (Array.isArray(index)) {
                    // Maneja el caso cuando es un array de IndexPath[]
                    selectedIndex = index[0];
                    setIndexPeriodicity(selectedIndex); // Solo selecciona el primero en caso de array
                  } else {
                    // Maneja el caso cuando es un solo IndexPath
                    selectedIndex = index;
                    setIndexPeriodicity(selectedIndex);
                  }
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
          <Button
            style={styles.btnCalculate}
            disabled={!isValidForm}
            onPress={handleCalculateAmortization}>
            Calcular Amortización
          </Button>

          <View style={{height: 20}} />

          <AmortizationTable
            data={amortizationData}
            isNew={false}
            simulationData={dataSimulated!}
          />
          <View style={{height: 100}} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  btnContainer: {
    display: 'flex',
  },
  btnCalculate: {
    width: 210,
    alignSelf: 'center',
  },
});
