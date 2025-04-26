import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { createGlobalStyles } from '../styles/globalStyles';
import { useFontSize } from '../context/FontSizeContext';
import { Ionicons } from '@expo/vector-icons';

interface SaveNoteModalProps {
  visible: boolean;
  onSave: (title: string, tag: string) => void;
  onCancel: () => void;
  initialTitle?: string;
  initialTag?: string;
}

export const SaveNoteModal: React.FC<SaveNoteModalProps> = ({ 
  visible, 
  onSave, 
  onCancel,
  initialTitle = '',
  initialTag = ''
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [tag, setTag] = useState(initialTag);
  const { fontSize } = useFontSize();
  const globalStyles = createGlobalStyles(fontSize);

  // Reset form when modal becomes visible with new initial values
  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setTag(initialTag);
    }
  }, [visible, initialTitle, initialTag]);

  const handleSave = () => {
    onSave(title || 'Untitled Note', tag);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={[globalStyles.title, styles.modalTitle]}>Save Note</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[globalStyles.text, styles.input]}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            autoFocus
          />
          
          <TextInput
            style={[globalStyles.text, styles.input]}
            placeholder="Tag (optional)"
            value={tag}
            onChangeText={setTag}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
          
          <TouchableOpacity 
            style={[globalStyles.button, styles.saveButton]} 
            onPress={handleSave}
          >
            <Text style={globalStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '70%',
    maxWidth: 800,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 10,
    padding: 20,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 0,
  },
  closeButton: {
    padding: 5,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15,
    paddingBottom: 8,
    fontSize: 16,
  },
  saveButton: {
    width: '100%',
    height: 40,
    marginTop: 5,
  },
}); 