import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../context/AudioContext';
import { globalStyles } from '../styles/globalStyles';

export const AudioButton: React.FC = () => {
  const { isPlaying, togglePlayback } = useAudio();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[globalStyles.button, styles.audioButton]} 
        onPress={togglePlayback}
      >
        <Ionicons 
          name={isPlaying ? "pause" : "play"} 
          size={24} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    left: 30,
    zIndex: 1000,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 