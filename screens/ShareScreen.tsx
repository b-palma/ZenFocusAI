// screens/ShareScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShareScreen = () => {
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  // Carregar o número de ciclos concluídos do AsyncStorage
  useEffect(() => {
    const loadCompletedCycles = async () => {
      try {
        const cycles = await AsyncStorage.getItem('completedCycles');
        if (cycles) {
          setCompletedCycles(parseInt(cycles, 10));
        }
      } catch (error) {
        console.error('Erro ao carregar ciclos concluídos:', error);
      }
    };
    loadCompletedCycles();
  }, []);

  // Função para compartilhar conteúdo
  const handleShare = async () => {
    let message = '';

    if (completedCycles > 0) {
      // Mensagem para usuários com ciclos concluídos
      message = `🍅 Estou usando o App Pomodoro para gerenciar meu tempo! Hoje completei ${completedCycles} ciclos de foco. Experimente também: https://youtube.com`;
    } else {
      // Mensagem para usuários sem ciclos concluídos
      message =
        '🚀 Acabei de começar a usar o App Pomodoro, uma ferramenta incrível para gerenciar meu tempo e aumentar minha produtividade! Confira: https://youtube.com';
    }

    const shareOptions = {
      title: 'Compartilhar App Pomodoro',
      message: message,
      url: 'https://seuapp.com', // Link para o app (substitua pelo link real)
      subject: 'Confira o app ZenFocusAI Pomodoro!', // Assunto para e-mails
    };

    try {
        console.log('Abrindo menu de compartilhamento...');
        await Share.open(shareOptions);
        console.log('Compartilhamento concluído.');
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compartilhar</Text>
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Compartilhar Progresso</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#87CEEB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ShareScreen;