// screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text as RNText, Switch, StyleSheet, ImageBackground } from 'react-native'; // Importe ImageBackground
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { saveData, loadData } from '../services/StorageService';
import SectionTitle from '../components/SectionTitle';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [silentNotifications, setSilentNotifications] = useState(false);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  // Carregar o estado das configurações ao montar o componente
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
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const toggleSilentNotifications = () => setSilentNotifications((prev) => !prev);

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

  return (
    <ImageBackground
    source={require('../assets/test.png')} // Caminho para a imagem
    style={styles.background}
    resizeMode="cover" // Garante que a imagem cubra toda a tela
    >
      <View style={[styles.container, isDarkMode && styles.darkOverlay]}>
        {/* Título da Tela */}
        <RNText style={[styles.title, isDarkMode && styles.darkText]}>Configurações</RNText>

        {/* Seção: Geral */}
        <SectionTitle title="Geral" isDarkMode={isDarkMode} />
        <View style={styles.settingItem}>
          <View style={styles.iconLabelContainer}>
            <Icon name="brightness-4" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
            <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>Modo Escuro</RNText>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>

        {/* Seção: Notificações */}
        <SectionTitle title="Notificações" isDarkMode={isDarkMode} />
        <View style={styles.settingItem}>
          <View style={styles.iconLabelContainer}>
            <Icon name="notifications" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
            <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>Notificações</RNText>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={'#f4f3f4'}
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.iconLabelContainer}>
            <Icon name="volume-off" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
            <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>
              Notificações Silenciosas
            </RNText>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={'#f4f3f4'}
            onValueChange={toggleSilentNotifications}
            value={silentNotifications}
          />
        </View>

        {/* Seção: Ajuste do Timer */}
        <SectionTitle title="Ajuste do Timer" isDarkMode={isDarkMode} />
        <View style={styles.sliderContainer}>
          <View style={styles.iconLabelContainer}>
            <Icon name="timer" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
            <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>
              Tempo de Foco: {focusTime} min
            </RNText>
          </View>
          <Slider
            style={{ width: '80%', alignSelf: 'center' }}
            minimumValue={5}
            maximumValue={60}
            step={1}
            value={focusTime}
            onSlidingComplete={(value) => handleFocusTimeComplete(value)}
            minimumTrackTintColor="#81b0ff"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={isDarkMode ? '#ffffff' : '#81b0ff'}
          />
        </View>
        <View style={styles.sliderContainer}>
          <View style={styles.iconLabelContainer}>
            <Icon name="pause-circle-filled" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
            <RNText style={[styles.settingLabel, isDarkMode && styles.darkText]}>
              Tempo de Pausa: {breakTime} min
            </RNText>
          </View>
          <Slider
            style={{ width: '80%', alignSelf: 'center' }}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={breakTime}
            onSlidingComplete={(value) => handleBreakTimeComplete(value)}
            minimumTrackTintColor="#81b0ff"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={isDarkMode ? '#ffffff' : '#81b0ff'}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
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
});

export default SettingsScreen;