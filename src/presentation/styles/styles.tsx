import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  contTitulo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tituloPrincipal: {
    textAlign: 'left',
    flex: 2,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 800,
  },
  input: {
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
  },
  results: {
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  resultItem: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
  },
  resultItemCenter: {
    borderRightColor: 'gray',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    color: 'white',
  },
  resultTitle: {
    fontWeight: '900',
    marginBottom: 4,
  },
  resultText: {
    textAlign: 'center',
  },
});
