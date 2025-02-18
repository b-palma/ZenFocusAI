// components/Controls.js
import React from 'react';
import { Button, View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';

const Controls = ({ isRunning, toggleTimer, resetTimer }) => (
  <View style={globalStyles.buttonContainer}>
    <Button
      title={isRunning ? 'Pausar' : 'Iniciar'}
      onPress={toggleTimer}
      color={isRunning ? colors.accent : colors.secondary}
    />
    <Button title="Reiniciar" onPress={resetTimer} color={colors.primary} />
  </View>
);

export default Controls;