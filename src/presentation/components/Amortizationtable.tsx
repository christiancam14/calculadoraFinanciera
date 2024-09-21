import React from 'react';
import {Layout, Text, Divider} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {AmortizationEntry} from '../../core/entities/simulatorEntities';
import {formatAsCurrency} from '../../config/helpers/formatAsCurrency';

interface AmortizationTableProps {
  data: AmortizationEntry[];
}

export const AmortizationTable = ({data}: AmortizationTableProps) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <Text>No hay datos para mostrar.</Text>;
  }

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

  return (
    <Layout style={{width: '100%'}}>
      <Layout style={styles.tableContainer}>
        <Layout style={styles.tableRow}>
          <Text style={styles.tableHeader}>No.</Text>
          <Text style={[styles.tableHeader, {flex: 4}]}>Capital</Text>
          <Text style={[styles.tableHeader, {flex: 4}]}>Interés</Text>
          <Text style={[styles.tableHeader, {flex: 4}]}>Saldo</Text>
        </Layout>
        <Divider />
        {data.map(item => (
          <React.Fragment key={item.periodo}>
            <Layout style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.periodo}</Text>
              <Text style={[styles.tableCell, {flex: 4}]}>
                {item.principal}
              </Text>
              <Text style={[styles.tableCell, {flex: 4}]}>{item.interes}</Text>
              <Text style={[styles.tableCell, {flex: 4}]}>{item.saldo}</Text>
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
    </Layout>
  );
};

const styles = StyleSheet.create({
  tableContainer: {},
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
