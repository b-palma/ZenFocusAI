// screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text as RNText, Switch, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons'; // Usando Ionicons para consistência
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; // Para o ícone brightness-4
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveData, loadData } from '../services/StorageService';
import SectionTitle from '../components/SectionTitle';
import { StackNavigationProp } from '@react-navigation/stack';
import { useProfileModal } from '../contexts/ProfileModalContext';

// Defina o tipo das rotas do app
type RootStackParamList = {
  Menu: undefined;
  PomodoroTimer: undefined;
  Settings: undefined;
  Tutorial: undefined;
};

// Defina o tipo da prop `navigation`
type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: { navigation: SettingsScreenNavigationProp }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [silentNotifications, setSilentNotifications] = useState(false);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  // Contexto do modal de perfil
  const { openModal } = useProfileModal();

  // Carregar o estado das configurações ao montar o componente
  useEffect(() => {
    const loadSettings = async () => {
      const savedDarkMode = await loadData('isDarkMode');
      if (savedDarkMode !== null) {
        setIsDarkMode(savedDarkMode);
      }

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
        setFocusTime(savedFocusTime);
      }

      const savedBreakTime = await loadData('breakTime');
      if (savedBreakTime !== null) {
        setBreakTime(savedBreakTime);
      }
    };
    loadSettings();
  }, []);

  // Funções para alternar estados
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await saveData('isDarkMode', newMode); // Salvar o novo estado no AsyncStorage
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await saveData('notificationsEnabled', newValue); // Salvar o novo estado no AsyncStorage
  };

  const toggleSilentNotifications = async () => {
    const newValue = !silentNotifications;
    setSilentNotifications(newValue);
    await saveData('silentNotifications', newValue); // Salvar o novo estado no AsyncStorage
  };

  // Funções para ajustar tempos
  const handleFocusTimeComplete = (value: number) => {
    const roundedValue = Math.round(value);
    setFocusTime(roundedValue);
    saveData('focusTime', roundedValue);
  };

  const handleBreakTimeComplete = (value: number) => {
    const roundedValue = Math.round(value);
    setBreakTime(roundedValue);
    saveData('breakTime', roundedValue);
  };

  // Função para reiniciar o tutorial
  const resetTutorial = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenTutorial'); // Remove a flag do AsyncStorage
      navigation.navigate('Tutorial'); // Redireciona para a tela de tutorial
    } catch (error) {
      console.error('Erro ao reiniciar o tutorial:', error);
    }
  };

  // Função para lidar com os botões da barra inferior
  const handleOptionPress = (screen: string) => {
    if (screen === 'Profile') {
      openModal(); // Abre o modal de perfil
    } else if (screen === 'Pomodoro') {
      navigation.navigate('PomodoroTimer'); // Navega diretamente para o Timer
    } else if (screen === 'Menu') {
      navigation.navigate('Menu'); // Navega diretamente para o Menu
    } else if (screen === 'Settings') {
      navigation.navigate('Settings'); // Navega diretamente para Configurações
    } else {
      console.log(`A tela "${screen}" estará disponível em breve.`);
    }
  };

  // Definição dos botões da barra inferior
  const menuOptions = [
    { id: '1', icon: 'person-outline', screen: 'Profile', label: 'Perfil' }, // Botão Perfil
    { id: '2', icon: 'play-circle-outline', screen: 'Pomodoro', label: 'Iniciar Timer' },
    { id: '3', icon: 'home-outline', screen: 'Menu', label: 'Menu Principal' },
    { id: '4', icon: 'settings-outline', screen: 'Settings', label: 'Configurações' },
  ];

  return (
    <ImageBackground
      source={require('../assets/test.png')} // Caminho para a imagem de fundo
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.container, isDarkMode && styles.darkOverlay]}>
        {/* Título da Tela */}
        <RNText style={[styles.title, isDarkMode && styles.darkText]}>Configurações</RNText>

        {/* Seção: Geral */}
        <SectionTitle title="Geral" isDarkMode={false} />
        <View style={styles.settingItem}>
          <View style={styles.iconLabelContainer}>
            <MaterialIcon name="brightness-4" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
            <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>Modo Escuro</RNText>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        {/* Seção: Notificações */}
        <SectionTitle title="Notificações" isDarkMode={false} />
        <View style={styles.settingItem}>
          <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>Notificações</RNText>
          <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
        </View>
        <View style={styles.settingItem}>
          <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>Notificações Silenciosas</RNText>
          <Switch value={silentNotifications} onValueChange={toggleSilentNotifications} />
        </View>

        {/* Seção: Ajuste do Timer */}
        <SectionTitle title="Ajuste do Timer" isDarkMode={false} />
        <View style={styles.sliderContainer}>
          <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>Tempo de Foco: {focusTime} min</RNText>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={5}
            maximumValue={60}
            step={1}
            value={focusTime}
            onSlidingComplete={handleFocusTimeComplete}
            minimumTrackTintColor="#81b0ff"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={isDarkMode ? '#ffffff' : '#81b0ff'}
          />
        </View>
        <View style={styles.sliderContainer}>
          <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>Tempo de Pausa: {breakTime} min</RNText>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={breakTime}
            onSlidingComplete={handleBreakTimeComplete}
            minimumTrackTintColor="#81b0ff"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={isDarkMode ? '#ffffff' : '#81b0ff'}
          />
        </View>

        {/* Botão "Rever Tutorial" */}
        <TouchableOpacity style={styles.resetButton} onPress={resetTutorial}>
          <MaterialIcon name="help-outline" size={20} color="#ffffff" />
          <RNText style={styles.resetButtonText}>Rever Tutorial</RNText>
        </TouchableOpacity>
      </View>

      {/* Barra Inferior */}
      <View style={styles.bottomBar}>
        {menuOptions.map((item) => (
          <TouchableOpacity key={item.id} style={styles.iconButton} onPress={() => handleOptionPress(item.screen)}>
            <Icon name={item.icon} size={30} color="#87CEEB" />
            <RNText style={styles.iconLabel}>{item.label}</RNText>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.39)', // Fundo semi-transparente para melhorar a legibilidade
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay escuro para o modo escuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#333333',
  },
  sliderContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3ba6a2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
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

export default SettingsScreen;