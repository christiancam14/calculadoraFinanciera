import {StyleSheet, ScrollView} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import {PieChart} from 'react-native-gifted-charts';

export const FinanceScreen = () => {
  const pieData = [
    {value: 54},
    {value: 54, focused: false},
    {value: 20, focused: false},
  ];

  return (
    <ScrollView>
      <Layout style={styles.container}>
        <Text>Saldo en las cuentas</Text>
        <PieChart data={pieData} donut animationDuration={2} />
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    alignItems: 'center',
    paddingVertical: 8,
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'center',
  },
  tableCell: {
    flex: 2,
    textAlign: 'center',
    alignSelf: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 'auto',
    flex: 1,
  },
});
