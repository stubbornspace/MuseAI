import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ImageBackground, Text } from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { createGlobalStyles } from '../styles/globalStyles';
import { useFontSize } from '../context/FontSizeContext';
import { useBackground } from '../context/BackgroundContext';
import { useAudio } from '../context/AudioContext';
import { MenuButton } from '../components/MenuButton';
import * as Haptics from 'expo-haptics';

type RootStackParamList = {
  Tags: undefined;
  Notes: { tag: string };
  Editor: { noteId?: string };
  Settings: undefined;
  TagManagement: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type IconName = keyof typeof Ionicons.glyphMap;

export const TagManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { notes, updateTag, deleteTag } = useNotes();
  const { fontSize } = useFontSize();
  const { backgroundImage } = useBackground();
  const { isPlaying, togglePlayback } = useAudio();
  const globalStyles = createGlobalStyles(fontSize);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');

  // Get unique tags from all notes
  const tags = Array.from(new Set(notes.map(note => note.tag).filter(Boolean)));

  const menuActions = [
    {
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
      icon: 'settings-outline' as IconName,
    },
  ];

  const handleEditTag = (oldTag: string, newTag: string) => {
    if (newTag.trim() === '') {
      Alert.alert('Error', 'Tag name cannot be empty');
      return;
    }

    if (tags.includes(newTag) && newTag !== oldTag) {
      Alert.alert('Error', 'Tag already exists');
      return;
    }

    updateTag(oldTag, newTag);
    setEditingTag(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteTag = (tag: string) => {
    Alert.alert(
      'Delete Tag',
      `Are you sure you want to delete the tag "${tag}"? This will remove the tag from all notes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTag(tag);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleAddTag = () => {
    if (newTagName.trim() === '') {
      Alert.alert('Error', 'Tag name cannot be empty');
      return;
    }

    if (tags.includes(newTagName)) {
      Alert.alert('Error', 'Tag already exists');
      return;
    }

    // Add the new tag to a note to make it available
    updateTag('', newTagName);
    setNewTagName('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderAddTagItem = () => (
    <View style={styles.tagItem}>
      <View style={styles.tagContent}>
        <View style={styles.tagTextContainer}>
          <TextInput
            style={[styles.tagInput, { fontSize }]}
            placeholder="Add new tag..."
            placeholderTextColor="#666666"
            value={newTagName}
            onChangeText={setNewTagName}
            onSubmitEditing={handleAddTag}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTag}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTag = ({ item: tag }: { item: string }) => {
    const noteCount = notes.filter(note => note.tag === tag).length;
    
    return (
      <View style={styles.tagItem}>
        {editingTag === tag ? (
          <TextInput
            style={[styles.tagInput, { fontSize }]}
            value={newTagName}
            onChangeText={setNewTagName}
            autoFocus
            onSubmitEditing={() => handleEditTag(tag, newTagName)}
            onBlur={() => {
              handleEditTag(tag, newTagName);
              setEditingTag(null);
            }}
          />
        ) : (
          <View style={styles.tagContent}>
            <TouchableOpacity
              style={styles.tagTextContainer}
              onPress={() => {
                setEditingTag(tag);
                setNewTagName(tag);
              }}
            >
              <Ionicons name="pencil" size={20} color="#FFFFFF" style={styles.icon} />
              <View style={styles.tagInfoContainer}>
                <View style={styles.tagRow}>
                  <TextInput
                    style={[styles.tagText, { fontSize }]}
                    value={tag}
                    editable={false}
                  />
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Notes', { tag })}
                    style={styles.noteCountButton}
                  >
                    <Text style={[styles.noteCount, { fontSize: fontSize * 0.8 }]}>
                      {noteCount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteTag(tag)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

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

      <View style={styles.contentContainer}>
        <FlatList
          data={[...tags, 'add']}
          renderItem={({ item }) => 
            item === 'add' ? renderAddTagItem() : renderTag({ item })
          }
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginTop: 140,
  },
  listContainer: {
    padding: 20,
  },
  tagItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  tagTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: '#FFFFFF',
    flex: 1,
  },
  tagInput: {
    color: '#FFFFFF',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  addButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  tagInfoContainer: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteCount: {
    color: '#4A90E2',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  noteCountButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
}); 