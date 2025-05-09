import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuButton } from './MenuButton';

type IconName = keyof typeof Ionicons.glyphMap;

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onBackPress?: () => void;
  menuActions: {
    label: string;
    onPress: () => void;
    icon: IconName;
  }[];
}

export const Header: React.FC<HeaderProps> = ({
  showBack = true,
  title,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  onBackPress,
  menuActions,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
          >
            <View style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        {showSearch ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Search..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              autoFocus
            />
          </View>
        ) : (
          <MenuButton actions={menuActions} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 20,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 10,
    minWidth: 200,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    padding: 8,
    fontSize: 16,
  },
}); 