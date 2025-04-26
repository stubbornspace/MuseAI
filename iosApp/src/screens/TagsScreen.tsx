import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Note } from '../types/note';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createGlobalStyles } from '../styles/globalStyles';
import { MenuButton } from '../components/MenuButton';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
type IconName = keyof typeof Ionicons.glyphMap;

interface TagGroup {
  tag: string;
  notes: Note[];
}

export const TagsScreen = () => {
  const { notes } = useNotes();
  const navigation = useNavigation<NavigationProp>();
  const { backgroundImage } = useBackground();
  const { fontSize } = useFontSize();
  const { isPlaying, togglePlayback } = useAudio();
  const globalStyles = createGlobalStyles(fontSize);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  // Group notes by tag
  const tagGroups = notes.reduce((groups: TagGroup[], note) => {
    const tag = note.tag || 'Untagged';
    const existingGroup = groups.find(g => g.tag === tag);
    
    if (existingGroup) {
      existingGroup.notes.push(note);
    } else {
      groups.push({ tag, notes: [note] });
    }
    
    return groups;
  }, []);

  // Sort tag groups by number of notes (descending)
  tagGroups.sort((a, b) => b.notes.length - a.notes.length);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = notes.filter(note => 
      note.title?.toLowerCase().includes(query.toLowerCase()) ||
      note.tag?.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const renderSearchResult = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={globalStyles.searchResultItem}
      onPress={() => navigation.navigate('Editor', { noteId: item.id })}
    >
      <Text style={[globalStyles.text, globalStyles.searchResultTitle]}>
        {item.title || 'Untitled Note'}
      </Text>
      <Text style={[globalStyles.text, globalStyles.searchResultTag]}>
        #{item.tag || 'Untagged'}
      </Text>
    </TouchableOpacity>
  );

  const renderTagItem = ({ item }: { item: TagGroup }) => (
    <TouchableOpacity
      style={globalStyles.item}
      onPress={() => navigation.navigate('Notes', { tag: item.tag })}
    >
      <Text style={[globalStyles.text, globalStyles.itemTitle]}>
        {item.tag}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={backgroundImage}
      style={globalStyles.container}
    >
      <View style={globalStyles.header}>
        {isSearching ? (
          <View style={globalStyles.searchContainer}>
            <TextInput
              style={globalStyles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search notes and tags..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              autoFocus
            />
            <TouchableOpacity
              style={globalStyles.closeButton}
              onPress={() => {
                setIsSearching(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={globalStyles.searchButton}
            onPress={() => setIsSearching(true)}
          >
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      <MenuButton actions={menuActions} />
      {isSearching ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.id}
          contentContainerStyle={globalStyles.searchResultsContainer}
          style={globalStyles.list}
        />
      ) : (
        <FlatList
          data={tagGroups}
          renderItem={renderTagItem}
          keyExtractor={item => item.tag}
          contentContainerStyle={globalStyles.listContent}
          style={globalStyles.list}
        />
      )}
    </ImageBackground>
  );
}; 