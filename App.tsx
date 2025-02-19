// App.tsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Alert, Vibration } from 'react-native';
import firebase from '@react-native-firebase/app'; // Importe o módulo principal do Firebase
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import CycleCounter from './components/CycleCounter';
import ProgressCircle from './components/ProgressCircle';
import { configureNotifications, showNotification } from './services/NotificationService';
import { saveData, loadData } from './services/StorageService';
import globalStyles from './styles/globalStyles';
import MenuScreen from './screens/MenuScreen'; // Importe o MenuScreen

const Stack = createNativeStackNavigator();

// Componente PomodoroTimer (sem alterações)
const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  // Inicializa o Firebase
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAOpTwf_NBzEW76MCgsgphZ0IHaXVecUUs",
        authDomain: "zenfocusai-2bb30.firebaseapp.com",
        projectId: "zenfocusai-2bb30",
        storageBucket: "zenfocusai-2bb30.appspot.com",
        messagingSenderId: "911968432765",
        appId: "1:911968432765:android:501fd107f71ab9b4377714"
      }); // Inicializa o Firebase
      console.log('Firebase inicializado com sucesso!');
    }
  }, []);

  // Configurar notificações ao montar o componente
  useEffect(() => {
    configureNotifications();
    loadSavedData();
  }, []);

  // Carregar dados salvos
  const loadSavedData = async () => {
    const savedCycles = await loadData('cyclesCompleted');
    if (savedCycles) setCyclesCompleted(savedCycles);
  };

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
      showNotification(isBreak ? 'Pausa Concluída!' : 'Pomodoro Concluído!', 'Hora de descansar!');
      if (!isBreak) {
        const newCycles = cyclesCompleted + 1;
        setCyclesCompleted(newCycles);
        saveData('cyclesCompleted', newCycles);
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 minutos de pausa
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60); // Reinicia o Pomodoro
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsBreak(false);
  };

  // Calcular o progresso para o círculo de progresso
  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

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

// Componente principal do app
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        {/* Tela de Menu */}
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'ZenFocusAI' }}
        />
        {/* Tela do Timer Pomodoro */}
        <Stack.Screen
          name="PomodoroTimer"
          component={PomodoroTimer}
          options={{ title: 'Timer Pomodoro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;