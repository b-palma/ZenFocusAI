// components/TimerDisplay.js
import React from 'react';
import { Text } from 'react-native';
import formatTime from '../utils/formatTime';
import globalStyles from '../styles/globalStyles';

const TimerDisplay = ({ timeLeft }) => (
  <Text style={globalStyles.timerText}>{formatTime(timeLeft)}</Text>
);

export default TimerDisplay;