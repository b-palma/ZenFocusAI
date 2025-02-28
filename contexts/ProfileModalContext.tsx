// context/ProfileModalContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface ProfileModalContextType {
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ProfileModalContext = createContext<ProfileModalContextType | undefined>(undefined);

export const ProfileModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <ProfileModalContext.Provider value={{ isModalVisible, openModal, closeModal }}>
      {children}
    </ProfileModalContext.Provider>
  );
};

export const useProfileModal = () => {
  const context = useContext(ProfileModalContext);
  if (!context) {
    throw new Error('useProfileModal must be used within a ProfileModalProvider');
  }
  return context;
};