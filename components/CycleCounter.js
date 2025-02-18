// components/CycleCounter.js
import React from 'react';
import { Text } from 'react-native';
import globalStyles from '../styles/globalStyles';

const CycleCounter = ({ cyclesCompleted }) => (
  <Text style={globalStyles.text}>Ciclos completos: {cyclesCompleted}</Text>
);

export default CycleCounter;