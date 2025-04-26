import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, Animated, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { createGlobalStyles } from '../styles/globalStyles';
import { useFontSize } from '../context/FontSizeContext';
import { useAudio } from '../context/AudioContext';

export const MusicButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const { fontSize } = useFontSize();
  const { isPlaying, currentTrack, volume, togglePlayback, setVolume, availableTracks } = useAudio();
  const globalStyles = createGlobalStyles(fontSize);

  const toggleMenu = () => {
    const toValue = isVisible ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    setIsVisible(!isVisible);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[globalStyles.button, styles.musicButton]} 
        onPress={toggleMenu}
      >
        <Ionicons 
          name={isPlaying ? 'musical-notes' : 'musical-notes-outline'} 
          size={24} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        >
          <Animated.View 
            style={[
              styles.menuContainer,
              { transform: [{ translateY }], opacity }
            ]}
          >
            {availableTracks.map((track, index) => (
              <TouchableOpacity
                key={index}
                style={[globalStyles.button, styles.trackButton]}
                onPress={() => {
                  togglePlayback(track.name);
                  toggleMenu();
                }}
              >
                <Ionicons 
                  name={currentTrack === track.name && isPlaying ? 'pause' : 'play'} 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.trackIcon}
                />
                <Text style={styles.trackName}>
                  {track.name}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.volumeContainer}>
              <Ionicons name="volume-low" size={20} color="#FFFFFF" style={styles.volumeIcon} />
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={setVolume}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbTintColor="#FFFFFF"
              />
              <Ionicons name="volume-high" size={20} color="#FFFFFF" style={styles.volumeIcon} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 1000,
  },
  musicButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    alignItems: 'flex-end',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: 200,
  },
  volumeIcon: {
    marginHorizontal: 8,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: 120,
  },
  trackIcon: {
    marginRight: 8,
  },
  trackName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 