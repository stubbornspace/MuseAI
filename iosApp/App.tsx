import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesProvider } from './src/context/NotesContext';
import { AudioProvider } from './src/context/AudioContext';
import { BackgroundProvider } from './src/context/BackgroundContext';
import { FontSizeProvider } from './src/context/FontSizeContext';
import { TagsScreen } from './src/screens/TagsScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TagManagementScreen } from './src/screens/TagManagementScreen';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { MusicButton } from './src/components/MusicButton';
import { useNavigationState } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const MusicButtonWrapper = () => {
  const navigationState = useNavigationState(state => state);
  const currentRoute = navigationState?.routes[navigationState?.index]?.name;
  const shouldShowMusicButton = currentRoute !== 'Settings';

  return shouldShowMusicButton ? <MusicButton /> : null;
};

const AppContent = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <View style={styles.mainContent}>
          <View style={styles.content}>
            <StatusBar style="light" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="Tags" component={TagsScreen} />
              <Stack.Screen name="Notes" component={NotesScreen} />
              <Stack.Screen name="Editor" component={EditorScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="TagManagement" component={TagManagementScreen} />
            </Stack.Navigator>
            <MusicButtonWrapper />
          </View>
        </View>
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <BackgroundProvider>
      <NotesProvider>
        <AudioProvider>
          <FontSizeProvider>
            <AppContent />
          </FontSizeProvider>
        </AudioProvider>
      </NotesProvider>
    </BackgroundProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
