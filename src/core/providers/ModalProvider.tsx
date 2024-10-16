import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

// Define el tipo para el contexto
type ModalContextType = {
  isScheduling: boolean;
  toggleModal: () => void;
} | null;

const ModalContext = createContext<ModalContextType>(null);

export const ModalProvider = ({children}: PropsWithChildren) => {
  const [isScheduling, setIsScheduling] = useState(false);

  const toggleModal = () => {
    setIsScheduling(prev => !prev);
  };

  return (
    <ModalContext.Provider value={{isScheduling, toggleModal}}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === null) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
