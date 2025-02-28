// components/ProfileModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal'; // Importe o Modal personalizado
import { useProfileModal } from '../contexts/ProfileModalContext';

const ProfileModal = () => {
  const { isModalVisible, closeModal } = useProfileModal();

  // Lista de opções do painel
  const panelOptions = [
    { label: 'Compartilhar Progresso', onPress: () => console.log('Compartilhar') },
    { label: 'Estatísticas', onPress: () => console.log('Estatísticas') },
    { label: 'Upgrade Premium', onPress: () => console.log('Upgrade Premium') },
    { label: 'Configurações de Conta', onPress: () => console.log('Configurações de Conta') },
  ];

  // Altura de cada item e espaçamento adicional
  const ITEM_HEIGHT = 50; // Altura de cada item
  const EXTRA_HEIGHT = 60; // Espaço para o indicador de arraste e margens
  const windowHeight = Dimensions.get('window').height; // Altura da tela

  // Calcula a altura total do modal
  const modalHeight = Math.min(panelOptions.length * ITEM_HEIGHT + EXTRA_HEIGHT, windowHeight);

  return (
    <Modal
      isVisible={isModalVisible} // Controla a visibilidade do modal
      onBackdropPress={closeModal} // Fecha o modal ao clicar fora
      onSwipeComplete={closeModal} // Fecha o modal ao fazer swipe
      swipeDirection={['left']} // Permite fechar com swipe da direita para a esquerda
      style={styles.modal} // Estilo do modal
    >
      {/* Painel Flutuante */}
      <View style={[styles.panelContainer, { height: modalHeight }]}>
        {/* Indicador de Arraste (Reposicionado) */}
        <View style={styles.dragIndicator} />

        {/* Opções do Painel */}
        {panelOptions.map((option, index) => (
          <TouchableOpacity key={index} style={styles.panelOption} onPress={option.onPress}>
            <Text style={styles.panelOptionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end', // Alinha o modal à esquerda
    margin: 0, // Remove margens padrão
    backgroundColor: 'transparent', // Fundo transparente
  },
  panelContainer: {
    width: '50%', // Ocupa metade da largura da tela
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fundo semi-transparente escuro
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  dragIndicator: {
    width: 5, // Largura reduzida para ficar no canto direito
    height: 40, // Altura maior para ser mais visível
    backgroundColor: '#ccc',
    borderRadius: 5,
    position: 'absolute', // Posicionamento absoluto
    right: 10, // Alinhado à direita
    top: '50%', // Centralizado verticalmente
    transform: [{ translateY: -20 }], // Ajuste para centralizar
  },
  panelOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Cor mais clara para contrastar com o fundo escuro
  },
  panelOptionText: {
    fontSize: 16,
    color: '#fff', // Texto branco para melhor contraste
    textAlign: 'left',
  },
});

export default ProfileModal;