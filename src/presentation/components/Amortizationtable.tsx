import React from 'react';
import {Layout, Text, Divider} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';

interface AmortizationEntry {
  period: number;
  principal: string;
  interest: string;
  balance: string;
}

interface AmortizationTableProps {
  data: AmortizationEntry[];
}

export const AmortizationTable = ({data}: AmortizationTableProps) => {
  return (
    <Layout style={{width: '100%'}}>
      <Layout style={styles.tableContainer}>
        <Layout style={styles.tableRow}>
          <Text style={[styles.tableHeader]}>Periodo</Text>
          <Text style={[styles.tableHeader, {flex: 3}]}>Capital</Text>
          <Text style={[styles.tableHeader, {flex: 3}]}>Interés</Text>
          <Text style={[styles.tableHeader, {flex: 3}]}>Saldo</Text>
        </Layout>
        <Divider />
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <Layout style={styles.tableRow}>
              <Text style={[styles.tableCell]}>{item.period}</Text>
              <Text style={[styles.tableCell, {flex: 3}]}>{item.principal}</Text>
              <Text style={[styles.tableCell, {flex: 3}]}>{item.interest}</Text>
              <Text style={[styles.tableCell, {flex: 3}]}>{item.balance}</Text>
            </Layout>
            <Divider />
          </React.Fragment>
        ))}
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: 'green',
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
    // backgroundColor: 'red',
  },
  tableCell: {
    flex: 2,
    textAlign: 'center',
  },
});

