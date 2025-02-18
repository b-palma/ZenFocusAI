// components/TimerDisplay.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import TimerDisplay from './TimerDisplay';

test('exibe o tempo formatado corretamente', () => {
  const { getByText } = render(<TimerDisplay timeLeft={125} />);
  expect(getByText('2:05')).toBeTruthy();
});