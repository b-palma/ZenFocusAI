// styles/globalStyles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 18,
    color: colors.text,
  },
  timerText: {
    fontSize: 48,
    color: colors.primary,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  modeText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
});