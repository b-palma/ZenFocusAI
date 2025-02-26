// screens/TutorialScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage

// Defina o tipo de navegação para esta tela
type TutorialScreenNavigationProp = NavigationProp<RootStackParamList, 'Tutorial'>;

interface Props {
  navigation: TutorialScreenNavigationProp;
}

const TutorialScreen = ({ navigation }: Props) => {
  // Função para marcar o tutorial como concluído
  const markTutorialAsSeen = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTutorial', 'true');
    } catch (error) {
      console.error('Erro ao salvar status do tutorial:', error);
    }
  };

  return (
    <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
      {/* Tela 1 */}
      <ImageBackground
        source={require('../assets/test.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.slide}>
          <Icon name="timer" size={100} color="#ffffff" />
          <Text style={styles.title}>O que é o Método Pomodoro?</Text>
          <Text style={styles.description}>
            O Método Pomodoro é uma técnica de gerenciamento de tempo que divide o trabalho em intervalos focados (25 minutos) seguidos por pausas curtas.
          </Text>
        </View>
      </ImageBackground>

      {/* Tela 2 */}
      <ImageBackground
        source={require('../assets/test.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.slide}>
          <Icon name="timer" size={100} color="#ffffff" />
          <Text style={styles.title}>Como Funciona?</Text>
          <Text style={styles.description}>
            1. Escolha uma tarefa.{'\n'}
            2. Trabalhe por 25 minutos (um 'Pomodoro').{'\n'}
            3. Faça uma pausa curta (5 minutos).{'\n'}
            4. Repita e faça uma pausa longa após 4 ciclos.
          </Text>
        </View>
      </ImageBackground>

      {/* Tela 3 */}
      <ImageBackground
        source={require('../assets/test.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.slide}>
          <Icon name="check-circle" size={100} color="#ffffff" />
          <Text style={styles.title}>Benefícios</Text>
          <Text style={styles.description}>
            Aumenta a produtividade, melhora o foco, reduz o estresse e ajuda a evitar a procrastinação.
          </Text>
        </View>
      </ImageBackground>

      {/* Tela 4 (Opcional) */}
      <ImageBackground
        source={require('../assets/test.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.slide}>
          <Icon name="rocket-launch" size={100} color="#ffffff" />
          <Text style={styles.title}>Comece Agora!</Text>
          <Text style={styles.description}>Pronto para começar? Configure seu primeiro ciclo Pomodoro e veja os resultados!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              markTutorialAsSeen(); // Marque o tutorial como concluído
              navigation.navigate('Menu'); // Navegue para o menu principal
            }}
          >
            <Text style={styles.buttonText}>Ir para o Menu Principal</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#81b0ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default TutorialScreen;