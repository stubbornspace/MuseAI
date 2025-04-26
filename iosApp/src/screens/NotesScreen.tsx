import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Note } from '../types/note';
import { createGlobalStyles } from '../styles/globalStyles';
import { MenuButton } from '../components/MenuButton';
import { Ionicons } from '@expo/vector-icons';
import { useBackground } from '../context/BackgroundContext';
import { useFontSize } from '../context/FontSizeContext';
import { useAudio } from '../context/AudioContext';

type RootStackParamList = {
  Tags: undefined;
  Notes: { tag: string };
  Editor: { noteId?: string };
  Settings: undefined;
  TagManagement: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type NotesRouteProp = RouteProp<RootStackParamList, 'Notes'>;
type IconName = keyof typeof Ionicons.glyphMap;

export const NotesScreen = () => {
  const { notes } = useNotes();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<NotesRouteProp>();
  const { backgroundImage } = useBackground();
  const { fontSize } = useFontSize();
  const { isPlaying, togglePlayback } = useAudio();
  const globalStyles = createGlobalStyles(fontSize);

  const { tag } = route.params;
  const notesUnderTag = notes.filter(note => note.tag === tag);

  const menuActions = [
    {
      label: 'New Note',
      onPress: () => navigation.navigate('Editor', { noteId: undefined }),
      icon: 'add-circle-outline' as IconName,
    },
    {
      label: 'Manage Tags',
      onPress: () => navigation.navigate('TagManagement'),
      icon: 'pricetags-outline' as IconName,
    },
    {
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
      icon: 'settings-outline' as IconName,
    },
  ];

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={globalStyles.item}
      onPress={() => navigation.navigate('Editor', { noteId: item.id })}
    >
      <Text style={[globalStyles.text, globalStyles.itemTitle]}>
        {item.title || 'Untitled Note'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={backgroundImage}
      style={globalStyles.container}
    >
      <TouchableOpacity 
        style={globalStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <View style={globalStyles.backButtonCircle}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      
      <MenuButton actions={menuActions} />
      <FlatList
        data={notesUnderTag}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        contentContainerStyle={globalStyles.listContent}
        style={globalStyles.list}
      />
    </ImageBackground>
  );
}; 