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

type Periodicity = 'Diaria' | 'Semanal' | 'Quincenal' | 'Mensual' | 'Anual';

const PeriodicityData: Periodicity[] = [
  'Diaria',
  'Semanal',
  'Quincenal',
  'Mensual',
  'Anual',
];

type Interest = 'Mensual' | 'Efectivo Anual' | 'Nominal Anual';

const InterestData: Interest[] = ['Mensual', 'Efectivo Anual', 'Nominal Anual'];

interface AmortizationEntry {
  period: number;
  principal: string;
  interest: string;
  balance: string;
}

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

  const calculateAmortization = () => {
    setIsComputing(true);

    // Convert inputs to numbers
    const P = parseFloat(amount);
    // const r = (1 + parseFloat(interestRate) / 100)  getPeriodsPerYear(periodicity);
    const base = 1 + parseFloat(interestRate) / 100;
    const potencia = 1 / getPeriodsPerYear(periodicity);
    const r = Math.pow(base, potencia);
    const n = parseInt(duration, 10);

    // Calculate monthly payment
    const C = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    console.log(getPeriodsPerYear(periodicity));

    // Initialize balance
    let balance = P;
    const amortizationEntries: AmortizationEntry[] = [];

    // Generate amortization data
    for (let i = 0; i < n; i++) {
      const interestCalc = balance * r;
      const principal = C - interestCalc;
      balance -= principal;

      amortizationEntries.push({
        period: i + 1,
        principal: principal.toFixed(2),
        interest: interestCalc.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    // Update state with the complete amortization data
    setAmortizationData(amortizationEntries);

    setIsComputing(false);
  };

  const getPeriodsPerYear = (periodicityUser: Periodicity) => {
    switch (periodicityUser) {
      case 'Diaria':
        return 365;
      case 'Semanal':
        return 52;
      case 'Quincenal':
        return 26;
      case 'Mensual':
        return 12;
      case 'Anual':
        return 1;
      default:
        return 12;
      /*
       */
    }
  };

  const renderOption = (title: string) => (
    <SelectItem key={title} title={title} />
  );

  return (
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
          disabled={isComputing}
          onPress={calculateAmortization}>
          Calcular Amortización
        </Button>

        <View style={{height: 20}} />

        <AmortizationTable data={amortizationData} />
      </View>
    </ScrollView>
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
