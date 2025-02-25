// components/SectionTitle.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface SectionTitleProps {
  title: string;
  isDarkMode: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, isDarkMode }) => {
  return (
    <Text style={[styles.title, isDarkMode && styles.darkText]}>{title}</Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 24,
    marginBottom: 12,
  },
  darkText: {
    color: '#ffffff',
  },
});

export default SectionTitle;