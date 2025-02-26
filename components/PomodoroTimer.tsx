// components/PomodoroTimer.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Vibration } from 'react-native'; // Removido Alert
import Icon from 'react-native-vector-icons/Ionicons'; // Usando Ionicons para consistência
import PushNotification from 'react-native-push-notification';
import { loadData } from '../services/StorageService';
import globalStyles from '../styles/globalStyles';
import TimerDisplay from './TimerDisplay';
import Controls from './Controls';
import CycleCounter from './CycleCounter';
import ProgressCircle from './ProgressCircle';
import { StackNavigationProp } from '@react-navigation/stack';

// Defina o tipo das rotas do app
type RootStackParamList = {
  Menu: undefined;
  PomodoroTimer: undefined;
  Settings: undefined;
  Tutorial: undefined;
};

// Defina o tipo da prop `navigation`
type PomodoroTimerNavigationProp = StackNavigationProp<RootStackParamList, 'PomodoroTimer'>;

const PomodoroTimer = ({ navigation }: { navigation: PomodoroTimerNavigationProp }) => {
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
  const handleOptionPress = (screen: string) => {
    const currentRoute = navigation.getState().routes[navigation.getState().index].name;
  
    // Verifica se o usuário já está na tela selecionada
    if (currentRoute === screen) {
      return; // Não faz nada se o usuário já estiver na tela
    }
  
    if (screen === 'Menu') {
      navigation.navigate('Menu'); // Navega para o Menu
    } else if (screen === 'Settings') {
      navigation.navigate('Settings'); // Navega para Configurações
    } else {
      console.log(`A tela "${screen}" estará disponível em breve.`);
    }
  };

  // Definição dos botões da barra inferior
  const menuOptions = [
    { id: '1', icon: 'play-circle-outline', screen: 'Pomodoro', label: 'Iniciar Timer' },
    { id: '2', icon: 'home-outline', screen: 'Menu', label: 'Menu Principal' },
    { id: '3', icon: 'settings-outline', screen: 'Settings', label: 'Configurações' },
    { id: '4', icon: 'share-social-outline', screen: 'Share', label: 'Compartilhar' },
  ];

  return (
    <ImageBackground
      source={require('../assets/test.png')} // Caminho para a imagem de fundo
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[globalStyles.container, styles.overlay]}>
        <ProgressCircle progress={progress} />
        <TimerDisplay timeLeft={timeLeft} />
        <CycleCounter cyclesCompleted={cyclesCompleted} />
        <Text style={globalStyles.modeText}>{isBreak ? 'Pausa' : 'Foco'}</Text>
        <Controls isRunning={isRunning} toggleTimer={toggleTimer} resetTimer={resetTimer} />
      </View>

      {/* Barra Inferior */}
      <View style={styles.bottomBar}>
        {menuOptions.map((item) => (
          <TouchableOpacity key={item.id} style={styles.iconButton} onPress={() => handleOptionPress(item.screen)}>
            <Icon name={item.icon} size={30} color="#87CEEB" />
            <Text style={styles.iconLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay escuro para melhorar a legibilidade
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
});

export default PomodoroTimer;