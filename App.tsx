// App.tsx
import React, { useEffect, useState } from 'react';
import PushNotification from 'react-native-push-notification';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './types';
import MenuScreen from './screens/MenuScreen';
import SettingsScreen from './screens/SettingsScreen';
import PomodoroTimer from './components/PomodoroTimer';
import TutorialScreen from './screens/TutorialScreen';
import { ProfileModalProvider } from './contexts/ProfileModalContext'; // Contexto do modal
import ProfileModal from './components/ProfileModal'; // Modal global

// Configuração inicial do PushNotification
PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  requestPermissions: true,
});

// Configurar um receptor para broadcasts personalizados
const setupBroadcastReceiver = () => {
  PushNotification.createChannel(
    {
      channelId: 'test-channel',
      channelName: 'Test Channel',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Canal criado: ${created}`)
  );
  PushNotification.popInitialNotification((notification) => {
    console.log('Notificação inicial:', notification);
  });
};

// Crie o navegador com o tipo RootStackParamList
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean | null>(null);

  // Verifique se o tutorial já foi visto ao iniciar o app
  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenTutorial');
        if (value === 'true') {
          setHasSeenTutorial(true); // Tutorial já foi visto
        } else {
          setHasSeenTutorial(false); // Tutorial ainda não foi visto
        }
      } catch (error) {
        console.error('Erro ao verificar status do tutorial:', error);
      }
    };
    checkTutorialStatus();
    setupBroadcastReceiver();
  }, []);

  // Se o estado ainda não foi carregado, exiba uma tela de carregamento
  if (hasSeenTutorial === null) {
    return null; // Ou exiba um componente de carregamento
  }

  return (
    <ProfileModalProvider> {/* Envolva o app com o contexto do modal */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName={hasSeenTutorial ? 'Menu' : 'Tutorial'}>
          {/* Tela de Tutorial */}
          <Stack.Screen
            name="Tutorial"
            component={TutorialScreen}
            options={{ headerShown: false }} // Oculta o cabeçalho
          />
          {/* Tela de Menu */}
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{ headerShown: false }} // Oculta o cabeçalho
          />
          {/* Tela do Timer Pomodoro */}
          <Stack.Screen
            name="PomodoroTimer"
            component={PomodoroTimer}
            options={{ headerShown: false }} // Oculta o cabeçalho
          />
          {/* Tela de Configurações */}
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }} // Oculta o cabeçalho
          />
        </Stack.Navigator>
        <ProfileModal /> {/* Renderiza o modal global */}
      </NavigationContainer>
    </ProfileModalProvider>
  );
};

export default App;