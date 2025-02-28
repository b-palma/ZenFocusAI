// screens/MenuScreen.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useProfileModal } from '../contexts/ProfileModalContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const menuOptions = [
  { id: '1', icon: 'person-outline', screen: 'Profile', label: 'Perfil' },
  { id: '2', icon: 'play-circle-outline', screen: 'PomodoroTimer', label: 'Iniciar Timer' },
  { id: '3', icon: 'home-outline', screen: 'Menu', label: 'Menu Principal' },
  { id: '4', icon: 'settings-outline', screen: 'Settings', label: 'Configurações' },
];

const MenuScreen = ({ navigation }: { navigation: MenuScreenNavigationProp }) => {
  const { openModal } = useProfileModal();

  const handleOptionPress = (screen: string) => {
    if (screen === 'Profile') {
      openModal(); // Abre o modal de perfil
    } else {
      navigation.navigate(screen); // Navega para a tela correspondente
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_menu.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>ZenFocusAI</Text>
        <Text style={styles.subtitle}>Seu assistente de produtividade</Text>
      </View>

      <View style={styles.bottomBar}>
        {menuOptions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.iconButton}
            onPress={() => handleOptionPress(item.screen)}
          >
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 360,
  },
  subtitle: {
    fontSize: 16,
    color: '#006400',
    textAlign: 'center',
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

export default MenuScreen;