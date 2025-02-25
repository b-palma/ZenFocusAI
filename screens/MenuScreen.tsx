// screens/MenuScreen.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importe ícones do Ionicons
import { StackNavigationProp } from '@react-navigation/stack';

// Defina o tipo das rotas do app
type RootStackParamList = {
  Menu: undefined; // A tela de menu não recebe parâmetros
  PomodoroTimer: undefined; // A tela do timer também não recebe parâmetros
  Settings: undefined; // Adicione a tela de configurações
};

// Defina o tipo da prop `navigation`
type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const menuOptions = [
  { id: '1', icon: 'play-circle-outline', screen: 'Pomodoro', label: 'Iniciar Timer' },
  { id: '2', icon: 'home-outline', screen: 'Menu', label: 'Menu Principal' },
  { id: '3', icon: 'settings-outline', screen: 'Settings', label: 'Configurações' },
  { id: '4', icon: 'share-social-outline', screen: 'Share', label: 'Compartilhar' },
];

const MenuScreen = ({ navigation }: { navigation: MenuScreenNavigationProp }) => {
  const handleOptionPress = (screen: string) => {
    if (screen === 'Pomodoro') {
      navigation.navigate('PomodoroTimer'); // Certifique-se de que o nome da tela está correto
    } else if (screen === 'Settings') {
        navigation.navigate('Settings'); // Navegue para a tela de Configurações
      } else {
        Alert.alert('Em breve!', `A tela "${screen}" estará disponível em breve.`);
      }
    };

  return (
    <ImageBackground
      source={require('../assets/background_menu.png')} // Caminho para a imagem
      style={styles.background}
      resizeMode="cover" // Garante que a imagem cubra toda a tela
    >
      {/* Conteúdo principal */}
      <View style={styles.container}>
        <Text style={styles.title}>ZenFocusAI</Text>
        <Text style={styles.subtitle}>Seu assistente de produtividade</Text>
      </View>

      {/* Barra de Navegação Inferior */}
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
    justifyContent: 'space-between', // Divide o espaço entre o conteúdo e a barra inferior
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
    borderTopColor: 'rgba(255, 255, 255, 0.3)', // Linha divisória
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo semi-transparente
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