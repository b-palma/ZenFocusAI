// components/PomodoroTimer.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Vibration } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { loadData } from '../services/StorageService';
import globalStyles from '../styles/globalStyles';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import CycleCounter from './CycleCounter';
import ProgressCircle from './ProgressCircle';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Valor inicial padrão
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [silentNotifications, setSilentNotifications] = useState(false);

  // Carregar as configurações ao montar o componente
  useEffect(() => {
    const loadSettings = async () => {
      const savedNotificationsEnabled = await loadData('notificationsEnabled');
      if (savedNotificationsEnabled !== null) {
        setNotificationsEnabled(savedNotificationsEnabled);
      }

      const savedSilentNotifications = await loadData('silentNotifications');
      if (savedSilentNotifications !== null) {
        setSilentNotifications(savedSilentNotifications);
      }

      const savedFocusTime = await loadData('focusTime');
      if (savedFocusTime !== null) {
        setTimeLeft(savedFocusTime * 60); // Converte minutos para segundos
      }
    };
    loadSettings();
  }, []);

  // Atualizar o tempo e verificar se o tempo acabou
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && interval) {
      clearInterval(interval);
      setIsRunning(false);
      Vibration.vibrate([500, 500, 500]); // Vibra ao terminar

      if (notificationsEnabled) {
        PushNotification.localNotification({
          title: isBreak ? 'Pausa Concluída!' : 'Pomodoro Concluído!',
          message: isBreak ? 'Hora de focar novamente!' : 'Hora de descansar!',
          playSound: !silentNotifications,
          soundName: silentNotifications ? undefined : 'default', // Corrigido aqui
        });
      }

      const handleCycleCompletion = async () => {
        if (!isBreak) {
          const newCycles = cyclesCompleted + 1;
          setCyclesCompleted(newCycles);
          setIsBreak(true);
          const savedBreakTime = await loadData('breakTime');
          setTimeLeft((savedBreakTime || 5) * 60); // Usa o tempo de pausa configurado
        } else {
          setIsBreak(false);
          const savedFocusTime = await loadData('focusTime');
          setTimeLeft((savedFocusTime || 25) * 60); // Usa o tempo de foco configurado
        }
      };

      handleCycleCompletion();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, notificationsEnabled, silentNotifications]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = async () => {
    const savedFocusTime = await loadData('focusTime');
    setTimeLeft((savedFocusTime || 25) * 60); // Reinicia com o tempo de foco configurado
    setIsRunning(false);
    setIsBreak(false);
  };

  // Calcular o progresso para o círculo de progresso
  const calculateProgress = async () => {
    const savedFocusTime = await loadData('focusTime');
    const savedBreakTime = await loadData('breakTime');

    const totalTime = isBreak ? (savedBreakTime || 5) * 60 : (savedFocusTime || 25) * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = async () => {
      const newProgress = await calculateProgress();
      setProgress(newProgress);
    };
    updateProgress();
  }, [timeLeft, isBreak]);

  return (
    <View style={globalStyles.container}>
      <ProgressCircle progress={progress} />
      <TimerDisplay timeLeft={timeLeft} />
      <CycleCounter cyclesCompleted={cyclesCompleted} />
      <Text style={globalStyles.modeText}>{isBreak ? 'Pausa' : 'Foco'}</Text>
      <Controls isRunning={isRunning} toggleTimer={toggleTimer} resetTimer={resetTimer} />
    </View>
  );
};

export default PomodoroTimer;