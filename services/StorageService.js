import AsyncStorage from '@react-native-async-storage/async-storage';

const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return null;
  }
};

export { saveData, loadData };