import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {MMKV} from 'react-native-mmkv';

// Instancia de MMKV
const storage = new MMKV();

// Función para listar todos los datos en MMKV
const listAllStoredData = () => {
  const allData: {key: string; value: string | null}[] = [];
  const keys = storage.getAllKeys(); // Obtener todas las claves

  keys.forEach((key: string) => {
    const value = storage.getString(key); // Obtener el valor de cada clave
    allData.push({key, value: value !== undefined ? value : null}); // Asignar null si el valor es undefined
  });

  console.log('Datos almacenados en MMKV:', allData);
  return allData; // Retorna el array con todas las claves y valores
};

export const StoredDataScreen = () => {
  const [storedData, setStoredData] = useState<
    {key: string; value: string | null}[]
  >([]);

  useEffect(() => {
    const data = listAllStoredData();
    setStoredData(data);
  }, []);

  console.log(storedData);

  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
        Datos almacenados en MMKV:
      </Text>
      <FlatList
        data={storedData}
        keyExtractor={item => item.key}
        renderItem={({item}) => (
          <View style={{paddingVertical: 8}}>
            <Text>{`Key: ${item.key}, Value: ${
              item.value !== null ? item.value : 'No disponible'
            }`}</Text>
          </View>
        )}
      />
    </View>
  );
};
