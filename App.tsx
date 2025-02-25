// App.tsx
import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './screens/MenuScreen';
import SettingsScreen from './screens/SettingsScreen';
import PomodoroTimer from './components/PomodoroTimer';

// Configuração inicial do PushNotification
PushNotification.configure({
  // Chamado quando uma notificação é recebida
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },

  // Solicita permissão no primeiro uso (iOS)
  requestPermissions: true,
});

// Configurar um receptor para broadcasts personalizados
const setupBroadcastReceiver = () => {
  PushNotification.createChannel(
    {
      channelId: 'test-channel', // ID do canal
      channelName: 'Test Channel', // Nome do canal
      playSound: true, // Tocar som
      soundName: 'default', // Som padrão
      importance: 4, // Alta prioridade
      vibrate: true, // Vibração
    },
    (created) => console.log(`Canal criado: ${created}`)
  );

  // Adicionar um listener para broadcasts personalizados
  PushNotification.popInitialNotification((notification) => {
    console.log('Notificação inicial:', notification);
  });

  // Lidar com intents recebidas
  PushNotification.popInitialNotification((notification) => {
    console.log('Intent recebida:', notification);
  });
};

const App = () => {
  useEffect(() => {
    setupBroadcastReceiver();
  }, []);

  const Stack = createNativeStackNavigator();

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
        {/* Tela de Configurações */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Configurações' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;