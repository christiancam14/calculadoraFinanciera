import React from 'react';
import {Layout, Text, Divider} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {AmortizationEntry} from '../../core/entities/simulatorEntities';
import {formatAsCurrency} from '../../config/helpers/formatAsCurrency';

interface AmortizationTableProps {
  data: AmortizationEntry[];
}

export const AmortizationTable = ({data}: AmortizationTableProps) => {
  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(/[$,]/g, ''));
  };

  const totalPrincipal = data.reduce(
    (acc, item) => acc + parseCurrency(item.principal),
    0,
  );
  const totalInterest = data.reduce(
    (acc, item) => acc + parseCurrency(item.interest),
    0,
  );

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
              <Text style={[styles.tableCell, {flex: 3}]}>
                {item.principal}
              </Text>
              <Text style={[styles.tableCell, {flex: 3}]}>{item.interest}</Text>
              <Text style={[styles.tableCell, {flex: 3}]}>{item.balance}</Text>
            </Layout>
            <Divider />
          </React.Fragment>
        ))}
        <Layout style={[styles.tableRow, {marginTop: 10}]}>
          <Text style={[styles.tableCell, {fontWeight: '900'}]}>Total</Text>
          <Text style={[styles.tableCell, {flex: 3}]}>
            {formatAsCurrency(totalPrincipal)}
          </Text>
          <Text style={[styles.tableCell, {flex: 3}]}>
            {formatAsCurrency(totalInterest)}
          </Text>
          <Text style={[styles.tableCell, {flex: 3}]}>
            {formatAsCurrency(totalPrincipal + totalInterest)}
          </Text>
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
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
