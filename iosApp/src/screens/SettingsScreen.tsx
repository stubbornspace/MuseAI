import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { createGlobalStyles } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { useBackground } from '../context/BackgroundContext';
import { useFontSize } from '../context/FontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BACKGROUND_IMAGES = [
  { id: 'space', name: 'Space', source: require('../../assets/bgs/space.jpg') },
  { id: 'wave', name: 'Wave', source: require('../../assets/bgs/wave.png') },
  { id: 'ocean', name: 'Ocean', source: require('../../assets/bgs/ocean.png') },
  { id: 'galaxy', name: 'Galaxy', source: require('../../assets/bgs/galaxy.png') },
  { id: 'nyc', name: 'NYC', source: require('../../assets/bgs/nyc.png') }
];

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const { backgroundImage, setBackgroundImage } = useBackground();
  const { fontSize, setFontSize } = useFontSize();
  const [selectedBackground, setSelectedBackground] = useState('space');
  const globalStyles = createGlobalStyles(fontSize);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedBackground = await AsyncStorage.getItem('background_image');
      if (savedBackground) {
        setSelectedBackground(savedBackground);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleBackgroundSelect = async (backgroundId: string) => {
    try {
      await setBackgroundImage(backgroundId);
      setSelectedBackground(backgroundId);
    } catch (error) {
      console.error('Error saving background:', error);
      Alert.alert('Error', 'Failed to save background selection');
    }
  };

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[globalStyles.title, styles.title]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[globalStyles.title, styles.sectionTitle]}>Font Size</Text>
          <Text style={[globalStyles.text, styles.description]}>
            Adjust the text size throughout the app.
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={[globalStyles.text, styles.sliderValue]}>{fontSize}</Text>
            <Slider
              style={styles.slider}
              minimumValue={14}
              maximumValue={30}
              step={1}
              value={fontSize}
              onValueChange={handleFontSizeChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor="#007AFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[globalStyles.title, styles.sectionTitle]}>Background Image</Text>
          <Text style={[globalStyles.text, styles.description]}>
            Choose your preferred background image for the app.
          </Text>
          
          <View style={styles.backgroundGrid}>
            {BACKGROUND_IMAGES.map((bg) => (
              <TouchableOpacity
                key={bg.id}
                style={[
                  styles.backgroundItem,
                  selectedBackground === bg.id && styles.selectedBackground,
                ]}
                onPress={() => handleBackgroundSelect(bg.id)}
              >
                <Image source={bg.source} style={styles.backgroundImage} />
                <Text style={[globalStyles.text, styles.backgroundLabel]}>{bg.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 40,
    textAlign: 'center',
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backgroundItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBackground: {
    borderColor: '#007AFF',
  },
  backgroundImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  backgroundLabel: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}); 