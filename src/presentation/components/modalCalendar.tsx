import React from 'react';
import {Button, Calendar, Layout, Text} from '@ui-kitten/components';
import {useState} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import * as eva from '@eva-design/eva';

interface Props {
  handleSchedule: (date: Date) => void;
  handleToggleModal: () => void;
}

export const ModalCalendar = ({handleSchedule, handleToggleModal}: Props) => {
  const [date, setDate] = useState(new Date());
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;
  return (
    <>
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
          Agregar recordatorio
        </Text>
        <Calendar
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          style={{width: '100%'}}
        />

        <Layout style={{display: 'flex', flexDirection: 'row', gap: 12}}>
          <Button
            onPress={handleToggleModal}
            style={{marginTop: 36, flex: 1}}
            disabled={false}>
            Salir
          </Button>
          <Button
            onPress={() => handleSchedule(date)}
            style={{marginTop: 36, flex: 1}}
            disabled={false}>
            Guardar
          </Button>
        </Layout>
      </Layout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },

  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
  },
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
