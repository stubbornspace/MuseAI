import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_IMAGES = {
  space: require('../../assets/bgs/space.jpg'),
  wave: require('../../assets/bgs/wave.png'),
  ocean: require('../../assets/bgs/ocean.png'),
  galaxy: require('../../assets/bgs/galaxy.png'),
  nyc: require('../../assets/bgs/nyc.png')
};

type BackgroundContextType = {
  backgroundImage: any;
  setBackgroundImage: (id: string) => Promise<void>;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImageState] = useState(BACKGROUND_IMAGES.space);

  useEffect(() => {
    loadBackgroundImage();
  }, []);

  const loadBackgroundImage = async () => {
    try {
      const savedBackground = await AsyncStorage.getItem('background_image');
      if (savedBackground && BACKGROUND_IMAGES[savedBackground as keyof typeof BACKGROUND_IMAGES]) {
        setBackgroundImageState(BACKGROUND_IMAGES[savedBackground as keyof typeof BACKGROUND_IMAGES]);
      }
    } catch (error) {
      console.error('Error loading background:', error);
    }
  };

  const setBackgroundImage = async (id: string) => {
    try {
      if (BACKGROUND_IMAGES[id as keyof typeof BACKGROUND_IMAGES]) {
        await AsyncStorage.setItem('background_image', id);
        setBackgroundImageState(BACKGROUND_IMAGES[id as keyof typeof BACKGROUND_IMAGES]);
      }
    } catch (error) {
      console.error('Error saving background:', error);
      throw error; // Re-throw the error to handle it in the Settings screen
    }
  };

  return (
    <BackgroundContext.Provider value={{ backgroundImage, setBackgroundImage }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}; 