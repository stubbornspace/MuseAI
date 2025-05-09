import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createGlobalStyles } from '../styles/globalStyles';
import { useFontSize } from '../context/FontSizeContext';

type IconName = keyof typeof Ionicons.glyphMap;

interface MenuAction {
  label: string;
  onPress: () => void;
  icon: IconName;
}

interface MenuButtonProps {
  actions: MenuAction[];
}

export const MenuButton: React.FC<MenuButtonProps> = ({ actions }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const { fontSize } = useFontSize();
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
        style={[globalStyles.button, styles.menuButton]} 
        onPress={toggleMenu}
      >
        <Ionicons name="menu" size={20} color="#FFFFFF" />
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
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  action.onPress();
                  toggleMenu();
                }}
              >
                <View style={[globalStyles.button, styles.menuItemButton]}>
                  <Ionicons name={action.icon} size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  menuButton: {
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
    top: 100,
    right: 20,
    alignItems: 'flex-end',
  },
  menuItem: {
    marginBottom: 10,
  },
  menuItemButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 