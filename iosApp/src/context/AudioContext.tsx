import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
  togglePlayback: (trackName?: string) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  availableTracks: { name: string; file: any }[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.5); // Default volume at 50%

  const availableTracks = [
    { name: 'Space', file: require('../../assets/audio/space.m4a') },
    { name: 'Stars', file: require('../../assets/audio/stars.m4a') },
    { name: 'Galaxy', file: require('../../assets/audio/galaxy.m4a') },
    { name: 'Moon', file: require('../../assets/audio/moon.m4a') },
  ];

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const setVolume = async (newVolume: number) => {
    try {
      setVolumeState(newVolume);
      if (sound) {
        await sound.setVolumeAsync(newVolume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const togglePlayback = async (trackName?: string) => {
    try {
      // If a specific track is selected
      if (trackName) {
        // If the same track is selected and is playing, stop it
        if (currentTrack === trackName && isPlaying) {
          await sound?.pauseAsync();
          setIsPlaying(false);
          return;
        }
        
        // If a different track is selected, stop current track and load new one
        if (sound) {
          await sound.unloadAsync();
        }

        const selectedTrack = availableTracks.find(track => track.name === trackName);
        if (selectedTrack) {
          const { sound: newSound } = await Audio.Sound.createAsync(
            selectedTrack.file,
            { 
              shouldPlay: true,
              volume: volume
            }
          );
          setSound(newSound);
          setCurrentTrack(trackName);
          setIsPlaying(true);
        }
      } else {
        // If no track specified, toggle current track
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling audio playback:', error);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, currentTrack, volume, togglePlayback, setVolume, availableTracks }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}; 